import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { NavLink, Switch, Route } from 'react-router-dom';

import { connect } from 'react-redux';

import { fetchAnnouncements, toggleShowAnnouncements } from 'mastodon/actions/announcements';
import Column from 'mastodon/components/column';
import ColumnHeader from 'mastodon/components/column_header';
import { IconWithBadge } from 'mastodon/components/icon_with_badge';
import Search from 'mastodon/features/compose/containers/search_container';
import AnnouncementsContainer from 'mastodon/features/getting_started/containers/announcements_container';
import { trendsEnabled } from 'mastodon/initial_state';

import SearchResults from './results';
import Statuses from './statuses';
import Suggestions from './suggestions';
import Tags from './tags';

const messages = defineMessages({
  title: { id: 'explore.title', defaultMessage: 'Explore' },
  searchResults: { id: 'explore.search_results', defaultMessage: 'Search results' },
  show_announcements: { id: 'home.show_announcements', defaultMessage: 'Show announcements' },
  hide_announcements: { id: 'home.hide_announcements', defaultMessage: 'Hide announcements' },
});

const mapStateToProps = state => ({
  layout: state.getIn(['meta', 'layout']),
  isSearching: state.getIn(['search', 'submitted']) || !trendsEnabled,
  hasAnnouncements: !state.getIn(['announcements', 'items']).isEmpty(),
  unreadAnnouncements: state.getIn(['announcements', 'items']).count(item => !item.get('read')),
  showAnnouncements: state.getIn(['announcements', 'show']),
});

class Explore extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
    identity: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    multiColumn: PropTypes.bool,
    isSearching: PropTypes.bool,
    hasAnnouncements: PropTypes.bool,
    unreadAnnouncements: PropTypes.number,
    showAnnouncements: PropTypes.bool,
  };

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  componentDidMount () {
    setTimeout(() => this.props.dispatch(fetchAnnouncements()), 700);
  }

  componentDidUpdate (prevProps) {
    if (prevProps.unreadAnnouncements < this.props.unreadAnnouncements && !this.props.showAnnouncements) {
      this.props.dispatch(toggleShowAnnouncements());
    }
  }

  handleToggleAnnouncementsClick = (e) => {
    e.stopPropagation();
    this.props.dispatch(toggleShowAnnouncements());
  };

  setRef = c => {
    this.column = c;
  };

  render() {
    const { intl, multiColumn, isSearching, hasAnnouncements, showAnnouncements } = this.props;
    const { signedIn } = this.context.identity;

    let announcementsButton;

    if (hasAnnouncements) {
      announcementsButton = (
        <button
          type='button'
          className={classNames('column-header__button', { 'active': showAnnouncements })}
          title={intl.formatMessage(showAnnouncements ? messages.hide_announcements : messages.show_announcements)}
          aria-label={intl.formatMessage(showAnnouncements ? messages.hide_announcements : messages.show_announcements)}
          onClick={this.handleToggleAnnouncementsClick}
        >
          <IconWithBadge id='bullhorn' count={0} />
        </button>
      );
    }

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon={isSearching ? 'search' : 'hashtag'}
          title={intl.formatMessage(isSearching ? messages.searchResults : messages.title)}
          onClick={this.handleHeaderClick}
          multiColumn={multiColumn}
          extraButton={announcementsButton}
          appendContent={hasAnnouncements && showAnnouncements && <AnnouncementsContainer />}
        />

        <div className='explore__search-header'>
          <Search />
        </div>

        <div className='scrollable scrollable--flex' data-nosnippet>
          {isSearching ? (
            <SearchResults />
          ) : (
            <>
              <div className='account__section-headline'>
                <NavLink exact to='/explore'>
                  <FormattedMessage tagName='div' id='explore.trending_statuses' defaultMessage='Yowzas' />
                </NavLink>

                <NavLink exact to='/explore/tags'>
                  <FormattedMessage tagName='div' id='explore.trending_tags' defaultMessage='Hashtags' />
                </NavLink>

                {signedIn && (
                  <NavLink exact to='/explore/suggestions'>
                    <FormattedMessage tagName='div' id='explore.suggested_follows' defaultMessage='Yowzers' />
                  </NavLink>
                )}
              </div>

              <Switch>
                <Route path='/explore/tags' component={Tags} />
                <Route path='/explore/suggestions' component={Suggestions} />
                <Route exact path={['/explore', '/explore/posts', '/search']}>
                  <Statuses multiColumn={multiColumn} />
                </Route>
              </Switch>

              <Helmet>
                <title>{intl.formatMessage(messages.title)}</title>
                <meta name='robots' content={isSearching ? 'noindex' : 'all'} />
              </Helmet>
            </>
          )}
        </div>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(Explore));
