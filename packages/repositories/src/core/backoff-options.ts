import { IBackOffOptions } from 'exponential-backoff'

export const backoff_options: Partial<IBackOffOptions> = {
  delayFirstAttempt: false,
  startingDelay: 250,
  maxDelay: 1000,
  numOfAttempts: 1000,
  timeMultiple: 1.2,
}
