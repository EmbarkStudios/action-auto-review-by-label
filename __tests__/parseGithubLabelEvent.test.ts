import {parseGithubLabelEvent} from '../src/types/githubEvent';

const input = `{
  "action": "labeled",
  "label": {
    "color": "d73a4a",
    "default": true,
    "description": "Something isn't working",
    "id": 5209427085,
    "name": "bug",
    "url": "https://api.github.com/repos/thefuntastic/actions_test/labels/bug"
  },
  "pull_request": {
    "body": "Test test",
    "id": 123456,
    "labels": [
      {
        "color": "d73a4a",
        "default": true,
        "description": "Something isn't working",
        "id": 5209427085,
        "name": "bug",
        "url": "https://api.github.com/repos/thefuntastic/actions_test/labels/bug"
      }
    ],
    "number": 1,
    "title": "PR no 1 "
  },
  "repository": {
    "name": "actions_test",
    "owner": {
      "login": "thefuntastic"
    }
  }
}`;

test('Postive case', () => {
  const data = parseGithubLabelEvent(input);

  expect(data.action).toEqual('labeled');
});
