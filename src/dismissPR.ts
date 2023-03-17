import * as core from '@actions/core';
import * as github from '@actions/github';

type Octokit = ReturnType<typeof github.getOctokit>;

type Params = {
  octokit: Octokit;
  owner: string;
  repo: string;
  pullRequest: number;
  reviewId: number;
};

export async function dismissPR({
  octokit,
  owner,
  repo,
  pullRequest,
  reviewId,
}: Params) {
  try {
    await octokit.rest.pulls.dismissReview({
      owner,
      repo,
      pull_number: pullRequest,
      review_id: reviewId,
      message: 'Removing review as label was removed',
    });
  } catch (err: any) {
    core.error(`Something went wrong when dismissing the review: ${err}`);
    throw err;
  }
}
