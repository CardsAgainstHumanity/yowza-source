import React from 'react';

import { FormattedMessage } from 'react-intl';

export const StatusesCounter = (
  displayNumber: React.ReactNode,
  pluralReady: number,
) => (
  <FormattedMessage
    id='account.statuses_counter'
    defaultMessage='{count, plural, one {{counter} Yowza} other {{counter} Yowzas}}'
    values={{
      count: pluralReady,
      counter: <strong>{displayNumber}</strong>,
    }}
  />
);

export const FollowingCounter = (
  displayNumber: React.ReactNode,
  pluralReady: number,
) => (
  <FormattedMessage
    id='account.following_counter'
    defaultMessage='{count, plural, one {{counter} Following} other {{counter} Following}}'
    values={{
      count: pluralReady,
      counter: <strong>{displayNumber}</strong>,
    }}
  />
);

export const FollowersCounter = (
  displayNumber: React.ReactNode,
  pluralReady: number,
) => (
  <FormattedMessage
    id='account.followers_counter'
    defaultMessage='{count, plural, one {{counter} Follower} other {{counter} Followers}}'
    values={{
      count: pluralReady,
      counter: <strong>{displayNumber}</strong>,
    }}
  />
);

export const ReferralsCounter = (
  displayNumber: React.ReactNode,
  pluralReady: number,
) => (
  <FormattedMessage
    id='account.referrals_counter'
    defaultMessage='{count, plural, one {{counter} Referral} other {{counter} Referrals}}'
    values={{
      count: pluralReady,
      counter: <strong>{displayNumber}</strong>,
    }}
  />
);
