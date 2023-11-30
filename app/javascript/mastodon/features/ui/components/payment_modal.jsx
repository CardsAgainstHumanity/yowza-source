import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { injectIntl } from 'react-intl';

import { connect } from 'react-redux';

import { loadStripe } from '@stripe/stripe-js';

// import {
//   EmbeddedCheckoutProvider,
//   EmbeddedCheckout
// } from '@stripe/react-stripe-js';
import { createCheckoutSession, clearStripeCheckoutSession } from 'mastodon/actions/payment';
import { stripePublicKey } from 'mastodon/initial_state';

const mapStateToProps = state => ({
  stripeSessionId: state.getIn(['payment', 'sessionId']),
});

const stripePromise = loadStripe(stripePublicKey);

class PaymentModal extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    stripeSessionId: PropTypes.string.isRequired,
    itemId: PropTypes.string,
    itemValue: PropTypes.string,
  };

  constructor(props) {
    super(props)
    this.state = {
      checkout: null
    };
  }

  async componentWillReceiveProps(nextProps) {
    if(!this.props.stripeSessionId && nextProps.stripeSessionId !== this.props.stripeSessionId) {
      this.mountStripe();
    }
  }

  async componentDidMount() {
    if(this.props.stripeSessionId) {
      this.mountStripe();
    } else {
      this.props.dispatch(createCheckoutSession(this.props.itemId, this.props.itemValue));
    }
  }

  async mountStripe() {
    const stripe = await stripePromise;
    const checkout = await stripe.initEmbeddedCheckout({ clientSecret: this.props.stripeSessionId, });
    this.setState({
      checkout: checkout
    });
    checkout.mount("#checkout");
  }

  componentWillUnmount() {
    this.props.dispatch(clearStripeCheckoutSession());
    if(this.state.checkout) {
      this.state.checkout.destroy();
    }
  }

  render () {
    return (
      <div className='modal-root__modal payment-modal'>
        <div className='payment-modal__container'>
          <div id='checkout'>
            {/* {this.state.stripeSessionId && <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={this.state.stripeSessionId}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>} */}

          </div>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(PaymentModal));
