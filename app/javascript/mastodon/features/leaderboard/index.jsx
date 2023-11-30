import PropTypes from 'prop-types';
import { PureComponent } from 'react';


import { defineMessages, injectIntl } from 'react-intl';

import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { fetchChallenges, resetChallenges } from 'mastodon/actions/challenges';
import { fetchLeaderboard, resetLeaderboard, fetchReferrals } from 'mastodon/actions/leaderboard';
import { CopyBox } from 'mastodon/features/leaderboard/components/copy_box';
import { LeaderboardList } from 'mastodon/features/leaderboard/components/leaderboard_list';
import { ec } from 'mastodon/initial_state';

import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';

import { ChallengeList } from './components/challenge_list';

const messages = defineMessages({
  leaderboardTitle: { id: 'column.leaderboard', defaultMessage: 'Leaderboard' },
  referralsTitle: { id: 'column.leaderboard_referrals', defaultMessage: 'Referrals' },
  challengesTitle: { id: 'column.challenges', defaultMessage: 'Challenges' },
});

const mapStateToProps = (state, { showChallenges = false }) => {
  return {
  challengeIds: state.getIn(['challenges', 'challengeIds']),
  hasMore: state.getIn(['leaderboard', 'hasMore']),
  page: state.getIn(['leaderboard', 'page']),
  pageSize: state.getIn(['leaderboard', 'pageSize']),
  paidReferralsRemaining: state.getIn(['leaderboard', 'paidReferralsRemaining']),
  leaderIds: state.getIn(['leaderboard', 'leadersList']),
  loading: state.getIn(['leaderboard', 'loading']),
  showChallenges: showChallenges,
};
}

class Leaderboard extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    paidReferralsRemaining: PropTypes.number,
    leaderIds: ImmutablePropTypes.list.isRequired,
    loading: PropTypes.bool.isRequired,
    showChallenges: PropTypes.bool.isRequired,
    challengeIds: ImmutablePropTypes.list.isRequired,
  };


  handleLoadMore = () => {
    if(this.props.hasMore) {
      this.props.dispatch(fetchLeaderboard(this.props.page + 1, this.props.pageSize));
    }
  };

  componentDidMount () {
    this.props.dispatch(fetchLeaderboard(1, this.props.pageSize));
    this.props.dispatch(fetchReferrals());

    if(this.props.showChallenges) {
      this.props.dispatch(fetchChallenges());
      this.challengesInterval = setInterval(() => {
        this.props.dispatch(fetchChallenges());
      }, 300000); // refresh every 5 mins
    }
  }

  componentWillUnmount () {
    this.props.dispatch(resetLeaderboard());

    if(this.challengesInterval) {
      clearInterval(this.challengesInterval);
      this.props.dispatch(resetChallenges());
    }
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setColumnRef = c => {
    this.column = c;
  };

  render () {
    return (
      <Column bindToDocument ref={this.setColumnRef} label={this.props.intl.formatMessage(messages.leaderboardTitle)}>
          <ColumnHeader
            icon='leaderboard'
            active={false}
            title={this.props.intl.formatMessage(messages.leaderboardTitle)}
            onClick={this.handleHeaderClick}
            multiColumn={false}
           />

          <div className='account__section-headline leaderboard__section-headline'>
            <NavLink exact to='/leaderboard'>{ this.props.intl.formatMessage(messages.referralsTitle) }</NavLink>
            { ec && <NavLink exact to='/leaderboard/challenges'>{ this.props.intl.formatMessage(messages.challengesTitle) }</NavLink> }
          </div>

          {!this.props.showChallenges && (
            <>
              <CopyBox
                activeTab='referrals'
                paidReferralsRemaining={this.props.paidReferralsRemaining}
              />
              <LeaderboardList
                hasMore={this.props.hasMore}
                isLoading={this.props.loading}
                leaderIds={this.props.leaderIds}
                onLoadMore={this.handleLoadMore}
              />
            </>
          )}
          {this.props.showChallenges && (
            <>
              <CopyBox
                activeTab='challenges'
              />
              <ChallengeList
                challengeIds={this.props.challengeIds}
              />
            </>
          )}

          <Helmet>
            <title>{this.props.intl.formatMessage(messages.leaderboardTitle)}</title>
            <meta name='robots' content='noindex' />
          </Helmet>
        </Column>
    );
  }
}

export default connect(mapStateToProps)(injectIntl(Leaderboard));
