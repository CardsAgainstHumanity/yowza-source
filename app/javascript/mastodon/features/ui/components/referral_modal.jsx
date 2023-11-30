import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { injectIntl, defineMessages } from 'react-intl';

import { Icon }  from 'mastodon/components/icon';
import { referralCode } from 'mastodon/initial_state';

const messages = defineMessages({
  header: { id: 'referral_modal.header', defaultMessage: 'This challenge<br /> begins in {timeUntilStart}' },
  instructions: { id: 'referral_modal.instructions', defaultMessage: '{timeRemaining} remaining!' },
  copy: { id: 'referral_modal.copy', defaultMessage: 'Winner:' },
});


class ReferralModal extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  copyTextToClipboard = async () => {
    const text = `${this.props.intl.formatMessage(messages.copy, { code: referralCode })} ${window.location.origin}/auth/sign_up?r=${referralCode}`
    await navigator.clipboard.writeText(text);
    alert('Copied!');
  };

  render () {
    return (
      <div className='modal-root__modal referral-modal'>
        <div className='referral-modal__container'>
          <h1>{this.props.intl.formatMessage(messages.header)}</h1>
          <p>{this.props.intl.formatMessage(messages.instructions)}</p>
          <div>
            {this.props.intl.formatMessage(messages.copy, { code: referralCode.toUpperCase() })}&nbsp;
            <a href={`${window.location.origin}/auth/sign_up?r=${referralCode}`}>{window.location.origin}/auth/sign_up?r={referralCode}</a>
            <Icon onClick={this.copyTextToClipboard} id='copy' />
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(ReferralModal);
