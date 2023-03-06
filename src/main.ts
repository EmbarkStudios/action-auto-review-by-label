import fs from 'fs/promises';
import * as github from '@actions/github';
import * as core from '@actions/core';

import {approvePR} from './approvePR';
import {hasLabel} from './checkLabelExists';
import {GithubLabelEvent, parseGithubLabelEvent} from './types/githubEvent';
import {findReviewByUserName} from './reviews';
import {determineIntent} from './determineIntent';
import {Intent} from './types/intent';

const {GITHUB_EVENT_PATH} = process.env;
const {owner, repo} = github.context.repo;
const token = core.getInput('github-token') || core.getInput('githubToken');
const octokit = token && github.getOctokit(token);
const labelName = core.getInput('label-name');
const botUsername = core.getInput('bot-username');

async function run(): Promise<void> {
  if (!octokit) {
    core.debug('No octokit client');
    return;
  }

  if (!GITHUB_EVENT_PATH) {
    core.debug('No GITHUB_EVENT_PATH environment vaiable set');
    return;
  }

  if (!botUsername) {
    core.debug('No input defining bot-username found');
    return;
  }

  let parsedEvent: GithubLabelEvent;

  try {
    const eventData = await fs.readFile(GITHUB_EVENT_PATH, 'utf-8');
    parsedEvent = parseGithubLabelEvent(eventData);
  } catch (err: any) {
    core.error(`Could not parse GITHUB_EVENT ${err} ${GITHUB_EVENT_PATH}`);
    core.setFailed(err);
    return;
  }

  // Note, github event data only contains 1 label, even if multiple were updated.
  // So we must instead poll available labels instead of relying on triggeredLabel.
  const triggeredLabel = parsedEvent.label.name;
  const prNumber = parsedEvent.pull_request.number;
  const repoName = parsedEvent.repository.name;
  const repoOwner = parsedEvent.repository.owner.login;

  if (parsedEvent.action === 'labeled') {
    core.debug(
      `PR #${prNumber} in ${repoOwner}/${repoName} has been labeled with "${triggeredLabel}".`
    );
  } else if (parsedEvent.action === 'unlabeled') {
    core.debug(
      `PR #${prNumber} in ${repoOwner}/${repoName} has been unlabeled with "${triggeredLabel}".`
    );
  }

  const labelExists = hasLabel(labelName, parsedEvent);
  core.debug(
    `Was label (name="${labelName}") found in list of labels? ${labelExists}`
  );

  const review = await findReviewByUserName(
    octokit,
    owner,
    repo,
    parsedEvent.pull_request.number,
    botUsername
  );

  const intent = determineIntent(labelExists, review);

  switch (intent) {
    case Intent.Approve:
      try {
        core.debug(
          `PR #${prNumber} in ${repoOwner}/${repoName}: approving review by "${botUsername}".`
        );
        await approvePR({
          octokit,
          owner,
          repo,
          pullRequest: parsedEvent.pull_request.number,
          commitId: parsedEvent.pull_request.head.sha,
        });
      } catch (err: any) {
        core.setFailed(`Something went wrong when posting the review: ${err}`);
      }
      break;
    case Intent.Dismiss:
      // Ideally we want to dismiss the review here, however Github uses a "you touched it you bought it" model, instead of removing the review entirely it converts back to a review request.
      // Becuase this is acting on behalf of a bot account, there is no way to manually complete outstanding reviews for the user - so we'd just have a orphaned review request that would block merging
      // Will instead leave the approval in place. In some cases this might lead to an earger merge, if no other reviewers were added before the label is removed.
      core.debug(
        `PR #${prNumber} in ${repoOwner}/${repoName}: leaving the approved PR in place, or else it will block merge".`
      );
      break;

    //   core.debug(
    //     `PR #${prNumber} in ${repoOwner}/${repoName}: dismissing review by "${botUsername}".`
    //   );
    //   try {
    //     if (!review) {
    //       break;
    //     }
    //     await dismissPR({
    //       octokit,
    //       owner,
    //       repo,
    //       pullRequest: parsedEvent.pull_request.number,
    //       reviewId: review.id,
    //     });
    //   } catch (err: any) {
    //     core.setFailed(`Something went wrong dismissing the review: ${err}`);
    //   }
    //   break;
    // case Intent.DoNothing:
    //   core.debug(
    //     `PR #${prNumber} in ${repoOwner}/${repoName}: nothing to do here!.`
    //   );
    default:
      break;
  }
}

run();
