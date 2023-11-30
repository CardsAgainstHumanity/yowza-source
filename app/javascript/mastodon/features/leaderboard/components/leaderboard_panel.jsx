import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import { NavLink } from 'react-router-dom';

import { topReferrers } from 'mastodon/initial_state';

import Leader from './leader';

const messages = defineMessages({
  title: { id: 'leaderboard.title', defaultMessage: 'Referral Leaderboard' },
  description: { id: 'leaderboard.description', defaultMessage: 'Here are the Yowza acounts who have referred the most new yowzers. The top referrers will win huge prizes at midnight tonight.' },
  learnMore: { id: 'leaderboard.learn_more', defaultMessage: 'Learn more.' },
});

class LeaderboardPanel extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { intl: { formatMessage } } = this.props;
    return (
      <div className='leaderboard-panel'>
        <h1 className='column-header'>{formatMessage(messages.title)}</h1>
        <p className='description'>
          {formatMessage(messages.description, { link: <a href='https://www.headtrip.game' target='_blank'>Head-Trip</a>})}&nbsp;
          <NavLink exact to={'/leaderboard'}>{formatMessage(messages.learnMore)}</NavLink>
        </p>
        <div className='leaderboard-list'>
          {(topReferrers || []).map((child, index) => {
            return (
              <Leader
                key={child.username}
                id={child.username}
                index={index}
                leader={child}
                position={index + 1}
              />
            )
          })}
        </div>
      </div>
    );
  }
}

export default injectIntl(LeaderboardPanel);
