import {hasLabel} from '../src/checkLabelExists';

test('Label exists', () => {
  const input = {
    action: 'labeled',
    label: {
      id: 1234,
      name: 'bug',
    },
    repository: {
      name: 'test',
      owner: {
        login: 'test_owner',
      },
    },
    pull_request: {
      number: 1234,
      title: 'test_pr',
      body: 'pr description',
      head: {sha: 'ablkjles'},
      labels: [
        {
          id: 2345,
          name: 'docs',
        },
        {
          id: 1234,
          name: 'bug',
        },
      ],
    },
  };

  const labelExists = hasLabel('bug', input);

  expect(labelExists).toBeTruthy();
});

test(`Label doesn't exist`, () => {
  const input = {
    action: 'labeled',
    label: {
      id: 1234,
      name: 'bug',
    },
    repository: {
      name: 'test',
      owner: {
        login: 'test_owner',
      },
    },
    pull_request: {
      number: 1234,
      title: 'test_pr',
      body: 'pr description',
      head: {sha: 'ablkjles'},
      labels: [],
    },
  };

  const labelExists = hasLabel('bug', input);

  expect(labelExists).toBeFalsy();
});
