import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { FormattedMessage, injectIntl } from 'react-intl';

import { connect } from 'react-redux';

import { closeModal, openModal } from 'mastodon/actions/modal';
import { referralCode, referralRank, numberOfUses } from 'mastodon/initial_state';
import { PERMISSION_INVITE_USERS } from 'mastodon/permissions';

class ReferralCodeTout extends PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  onClickReferralButton = () => {
    this.props.dispatch(closeModal({ modalType: undefined, ignoreFocus: false }));
    this.props.dispatch(openModal({ modalType: 'REFERRAL' }));
  };

  render () {
    const { signedIn, permissions } = this.context.identity;
    const canInvite = signedIn && ((permissions & PERMISSION_INVITE_USERS) === PERMISSION_INVITE_USERS);

    return (
      <div>
        {canInvite && referralCode && (
          <div className='referral-tout'>
            <strong><FormattedMessage id='your_referral_code' defaultMessage='Your referral code:' /></strong><span>{referralCode}</span>
            {/* <strong><FormattedMessage id='your_referral_count' defaultMessage='Your referral count:' /></strong><span>{numberOfUses}</span> */}
            { referralRank && referralRank <= 2921 && (<><strong><FormattedMessage id='your_referral_rank' defaultMessage='Your referral rank' /></strong><span className='referral-rank'><a href='/leaderboard'>{referralRank}</a></span></>)}
            <button type='button' onClick={this.onClickReferralButton}>SHARE YOUR REFERRAL CODE</button>
          </div>
        )}
      </div>
    );
  }

}

export default injectIntl(connect()(ReferralCodeTout));
