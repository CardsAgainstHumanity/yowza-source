import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { connect } from 'react-redux';

import { closeModal } from 'mastodon/actions/modal';

class BuyYowzaModal extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

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
          <div className='pre-payment-modal__header' />
          <div className='pre-payment-modal__content'>
            Ask your banker to contact us at mail@cardsagainsthumanity.com. Serious inquiries only.
          </div>
          <div className='pre-payment-modal__footer'>
            <button onClick={this.handleClick} className='button'>Return to Yowza</button>
          </div>
        </div>
      </div>
    );
  };
};

export default connect()(BuyYowzaModal);
