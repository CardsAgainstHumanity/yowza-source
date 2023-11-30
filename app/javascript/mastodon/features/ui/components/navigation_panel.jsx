import PropTypes from 'prop-types';
import { Component } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import { Link } from 'react-router-dom';

import { WordmarkLogo } from 'mastodon/components/logo';
import NavigationPortal from 'mastodon/components/navigation_portal';
import YowzaBlack from 'mastodon/features/yowza_black';
import { ec, eyb, timelinePreview, trendsEnabled, eys } from 'mastodon/initial_state';
import { transientSingleColumn } from 'mastodon/is_mobile';

import ColumnLink from './column_link';
import DisabledAccountBanner from './disabled_account_banner';
import FollowRequestsColumnLink from './follow_requests_column_link';
import NotificationsCounterIcon from './notifications_counter_icon';
import SignInBanner from './sign_in_banner';

const messages = defineMessages({
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  explore: { id: 'explore.title', defaultMessage: 'Popular' },
  firehose: { id: 'column.firehose', defaultMessage: 'Live feeds' },
  direct: { id: 'navigation_bar.direct', defaultMessage: 'Private mentions' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Likes' },
  bookmarks: { id: 'navigation_bar.bookmarks', defaultMessage: 'Bookmarks' },
  faq: { id: 'navigation_bar.faq', defaultMessage: 'FAQ' },
  leaderboard: { id: 'navigation_bar.leaderboard', defaultMessage: 'Leaderboard' },
  challenges: { id: 'navigation_bar.challenges', defaultMessage: 'Challenges' },
  store: { id: 'navigation_bar.store', defaultMessage: 'Yowza Store' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  followsAndFollowers: { id: 'navigation_bar.follows_and_followers', defaultMessage: 'Follows and followers' },
  about: { id: 'navigation_bar.about', defaultMessage: 'About' },
  search: { id: 'navigation_bar.search', defaultMessage: 'Search' },
  advancedInterface: { id: 'navigation_bar.advanced_interface', defaultMessage: 'Open in advanced web interface' },
});

class NavigationPanel extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  isFirehoseActive = (match, location) => {
    return match || location.pathname.startsWith('/public');
  };

  render () {
    const { intl } = this.props;
    const { signedIn, disabledAccountId } = this.context.identity;

    return (
      <div className='navigation-panel'>
        <div className='navigation-panel__logo'>
          <Link to='/' className='column-link column-link--logo'><WordmarkLogo /></Link>

          {transientSingleColumn && (
            <a href={`/deck${location.pathname}`} className='button button--block'>
              {intl.formatMessage(messages.advancedInterface)}
            </a>
          )}
          <hr />
        </div>

        {signedIn && (
          <ColumnLink transparent to='/home' icon='home' text={intl.formatMessage(messages.home)} />
        )}

        {trendsEnabled ? (
          <ColumnLink transparent to='/explore' icon='hashtag' text={intl.formatMessage(messages.explore)} />
        ) : (
          <ColumnLink transparent to='/search' icon='search' text={intl.formatMessage(messages.search)} />
        )}

        <ColumnLink transparent exact to='/leaderboard' icon='trophy' text={intl.formatMessage(messages.leaderboard)} />

        { ec && <ColumnLink transparent to='/leaderboard/challenges' icon='bolt' text={intl.formatMessage(messages.challenges)} /> }

        {signedIn && (
          <>
            <ColumnLink transparent to='/notifications' icon={<NotificationsCounterIcon className='column-link__icon' />} text={intl.formatMessage(messages.notifications)} />
            <FollowRequestsColumnLink />
          </>
        )}

        {(signedIn || timelinePreview) && (
          <ColumnLink transparent to='/public/local' isActive={this.isFirehoseActive} icon='globe' text={intl.formatMessage(messages.firehose)} />
        )}

        {signedIn && (
          <>
            <ColumnLink transparent to='/conversations' icon='at' text={intl.formatMessage(messages.direct)} />
            <ColumnLink transparent to='/bookmarks' icon='bookmark' text={intl.formatMessage(messages.bookmarks)} />
            <ColumnLink transparent href='/settings/profile' icon='cog' text={intl.formatMessage(messages.preferences)} />
          </>
        )}

        <ColumnLink transparent href='/faq' icon='question-circle' text={intl.formatMessage(messages.faq)} />

        {signedIn && eys && (
          <ColumnLink transparent to='/store' icon='cart' text={intl.formatMessage(messages.store)} />
        )}

        {!signedIn && (
          <div className='navigation-panel__sign-in-banner'>
            <hr />
            { disabledAccountId ? <DisabledAccountBanner /> : <SignInBanner /> }
          </div>
        )}

        {signedIn && eyb && <YowzaBlack extraClasses={{'black-button--sidebar': true}} />}

        <NavigationPortal />
      </div>
    );
  }

}

export default injectIntl(NavigationPanel);
