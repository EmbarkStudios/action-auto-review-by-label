import {GithubLabelEvent} from './types/githubEvent';

export function hasLabel(labelName: string, event: GithubLabelEvent): boolean {
  const labelFound = event.pull_request.labels
    .map(label => label.name)
    .includes(labelName);
  return labelFound;
}
