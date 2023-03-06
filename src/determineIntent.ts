import {Review} from './reviews';
import {Intent} from './types/intent';

export function determineIntent(
  hasLabel: boolean,
  review: Review | undefined
): Intent {
  if (hasLabel && !review) {
    return Intent.Approve;
  }
  if (!hasLabel && review?.state === 'APPROVED') {
    return Intent.Dismiss;
  }
  return Intent.DoNothing;
}
