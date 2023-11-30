import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { connect } from 'react-redux';

import { openModal, closeModal } from '../../../actions/modal';

class PrePaymentContinueButton extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    buttonText: PropTypes.string.isRequired
  };


  handleClick = () => {
    this.props.dispatch(closeModal({
        modalType: undefined,
        ignoreFocus: false,
      }));
    this.props.dispatch(openModal({ modalType: 'PAYMENT' }));
  };

  render () {
    return (
      <button onClick={this.handleClick} className='button'>
        {this.props.buttonText}
      </button>
    );
  }
}


export default connect()(PrePaymentContinueButton);
