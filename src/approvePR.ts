import * as core from '@actions/core';
import * as github from '@actions/github';

type Octokit = ReturnType<typeof github.getOctokit>;

type Params = {
  octokit: Octokit;
  owner: string;
  repo: string;
  pullRequest: number;
  commitId: string;
};

export async function approvePR({
  octokit,
  owner,
  repo,
  pullRequest,
  commitId,
}: Params) {
  try {
    core.debug('calling create review');
    core.debug(owner);
    core.debug(repo);
    core.debug(pullRequest.toString());
    core.debug(commitId);

    await octokit.rest.pulls.createReview({
      owner,
      repo,
      pull_number: pullRequest,
      commit_id: commitId,
      event: 'APPROVE',
    });
  } catch (err: any) {
    core.error(`Something went wrong when posting the review: ${err}`);
    throw err;
  }
}
