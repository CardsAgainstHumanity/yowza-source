import PropTypes from 'prop-types';
import React from 'react';

import { FormattedMessage } from 'react-intl';

import { connect } from 'react-redux';

import { openModal, closeModal } from 'mastodon/actions/modal';
import { registrationsOpen, sso_redirect } from 'mastodon/initial_state';

const mapStateToProps = (state, { accountId }) => ({
  displayNameHtml: state.getIn(['accounts', accountId, 'display_name_html']),
  signupUrl: state.getIn(['server', 'server', 'registrations', 'url'], null) || '/auth/sign_up',
});

const mapDispatchToProps = (dispatch) => ({
  onSignupClick() {
    dispatch(closeModal({
        modalType: undefined,
        ignoreFocus: false,
      }));
    dispatch(openModal({ modalType: 'CLOSED_REGISTRATIONS' }));
  },
});

class InteractionModal extends React.PureComponent {

  static propTypes = {
    onSignupClick: PropTypes.func.isRequired,
    signupUrl: PropTypes.string.isRequired,
  };

  handleSignupClick = () => {
    this.props.onSignupClick();
  };

  render () {
    const { signupUrl } = this.props;

    let signupButton;

    if (sso_redirect) {
      signupButton = (
        <a href={sso_redirect} data-method='post' className='button'>
          <FormattedMessage id='sign_in_banner.create_account' defaultMessage='Create account' />
        </a>
      );
    } else if (registrationsOpen) {
      signupButton = (
        <a href={signupUrl} className='button'>
          <FormattedMessage id='sign_in_banner.create_account' defaultMessage='Create account' />
        </a>
      );
    } else {
      signupButton = (
        <button className='button' onClick={this.handleSignupClick}>
          <FormattedMessage id='sign_in_banner.create_account' defaultMessage='Create account' />
        </button>
      );
    }

    return (
      <div className='modal-root__modal interaction-modal join-prompt-modal'>
        <div className='interaction-modal__lead'>
          <h1>Join Yowza to like, reply, reyowza, and more! You might even win $69,420.</h1>
        </div>
        <div>{signupButton}</div>
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(InteractionModal);
