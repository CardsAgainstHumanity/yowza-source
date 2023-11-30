import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import classNames from 'classnames';

import { connect } from 'react-redux';

import { Markup } from 'react-render-markup';

import { openModal, closeModal } from '../../../actions/modal';

class YowzaBlackButton extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    buttonText: PropTypes.string.isRequired,
    extraClasses: PropTypes.object,
  };


  handleClick = () => {
    this.props.dispatch(closeModal({
        modalType: undefined,
        ignoreFocus: false,
      }));
    this.props.dispatch(openModal({ modalType: 'INTERSTITIAL_PAYMENT', modalProps: { prepayment: true } }));
  };

  render () {
    return (
      <button onClick={this.handleClick} className={classNames('black-button', this.props.extraClasses)}>
        <Markup markup={this.props.buttonText} />
      </button>
    );
  }
}


export default connect()(YowzaBlackButton);
