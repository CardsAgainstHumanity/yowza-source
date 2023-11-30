import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { connect } from 'react-redux';

import { changeComposing, mountCompose, unmountCompose } from 'mastodon/actions/compose';
import ComposeFormContainer from 'mastodon/features/compose/containers/compose_form_container';
import NavigationContainer from 'mastodon/features/compose/containers/navigation_container';
import SearchContainer from 'mastodon/features/compose/containers/search_container';
import LeaderboardPanel from 'mastodon/features/leaderboard/components/leaderboard_panel';
import YowzaBlack from 'mastodon/features/yowza_black';
import { eyb, referralsEnabled } from 'mastodon/initial_state';

import LinkFooter from './link_footer';
import ReferralCodeTout from './referral_code_tout';

class ComposePanel extends PureComponent {

  static contextTypes = {
    identity: PropTypes.object.isRequired,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  onFocus = () => {
    const { dispatch } = this.props;
    dispatch(changeComposing(true));
  };

  onBlur = () => {
    const { dispatch } = this.props;
    dispatch(changeComposing(false));
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(mountCompose());
  }

  componentWillUnmount () {
    const { dispatch } = this.props;
    dispatch(unmountCompose());
  }

  render() {
    const { signedIn } = this.context.identity;

    return (
      <div className='compose-panel' onFocus={this.onFocus}>
        {signedIn && eyb && <YowzaBlack />}
        <SearchContainer openInRoute />
        {signedIn && (
          <>
            <div className='account-bar'>
              <NavigationContainer onClose={this.onBlur} />
              {referralsEnabled && <ReferralCodeTout />}
            </div>
            <ComposeFormContainer singleColumn />
          </>
        )}

        <LeaderboardPanel />
        <LinkFooter />
      </div>
    );
  }

}

export default connect()(ComposePanel);
