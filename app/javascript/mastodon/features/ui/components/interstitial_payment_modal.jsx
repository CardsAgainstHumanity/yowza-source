import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { injectIntl } from 'react-intl';

import { connect } from 'react-redux';

import { Markup } from 'react-render-markup';

import { closeModal } from 'mastodon/actions/modal';
import PrePaymentContinueButton from 'mastodon/features/yowza_black/components/pre_payment_continue_button';
import { cybs } from 'mastodon/initial_state';

const prePaymentModalContent = cybs == null ?
  {
    header: `Upgrade to Yowza Black<sup>®</sup>`,
    content: `Elevate your social media experience with Yowza Black<sup>®</sup>! For just $0.99, you'll get an exclusive black check by your name and the ability to post a new word: “awooga.”`,
  } :
  {
    header: "Upgrade to Yowza Blacker<sup>®</sup>",
    content: `Yowza Black<sup>®</sup> is an exclusive club, but did you know there’s an even more exclusive club inside that club? Sign up now for Yowza Blacker<sup>®</sup> and get a second, better black check for just $1.99.`,
  };

const postPaymentModalContent = {
  header: "Yowza! Thanks!",
  content: `We'll email you a receipt shortly. If you bought an account upgrade like Yowza Black<sup>®</sup>, please allow 10 minutes for it to take effect.`
};

class InterstitialPaymentModal extends PureComponent {

  static propTypes = {
    prepayment: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props)
  };

  handleClick = () => {
    this.props.dispatch(closeModal({
      modalType: undefined,
      ignoreFocus: false,
    }));
  }

  render () {
    return (
      <div className='modal-root__modal pre-payment-modal'>
        <div className='pre-payment-modal__container'>
          <div className='pre-payment-modal__header'>
            {this.props.prepayment ?
              (<Markup markup={this.props.prepayment && prePaymentModalContent.header} />)
              : (postPaymentModalContent.header)
            }
          </div>
          <div className='pre-payment-modal__content'>
            <Markup markup={this.props.prepayment ? prePaymentModalContent.content : postPaymentModalContent.content} />
          </div>
          <div className='pre-payment-modal__footer'>
            {this.props.prepayment && <PrePaymentContinueButton buttonText='Upgrade Now' />}
            {!this.props.prepayment && <button onClick={this.handleClick} className='button'>Return to Yowza</button>}
          </div>
        </div>
      </div>
    );
  };
};

export default connect()(injectIntl(InterstitialPaymentModal));
