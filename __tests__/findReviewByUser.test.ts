import {findReviewByUser, Review} from '../src/reviews';

test(`Finds latest review in list`, () => {
  const input: Review[] = [
    {
      id: 123,
      user: {login: 'test-user'},
      state: 'DISMISSED',
    },
    {
      id: 456,
      user: {login: 'test-user'},
      state: 'APPROVE',
    },
    {
      id: 789,
      user: {login: 'decoy-user'},
      state: 'APPROVE',
    },
  ];

  let review = findReviewByUser(input, 'test-user');
  expect(review?.id).toEqual(456);
});
