import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import { cybs } from 'mastodon/initial_state'

import YowzaBlackButton from './components/yowza_black_button';

export const YB  = 'yb';
export const YBB = 'ybb';

export const messages = defineMessages({
  yowzaBlack: { id: 'yowza_black_button.label', defaultMessage: 'Get Yowza Black for 99¢' },
  yowzaBlacker: { id: 'yowza_blacker_button.label', defaultMessage: 'Get Yowza Blacker for $1.99' }
});

class YowzaBlack extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    extraClasses: PropTypes.object,
  };

  render () {
    if (cybs === YBB) {
      return null;
    }

    const buttonText = cybs === YB ? this.props.intl.formatMessage(messages.yowzaBlacker) : this.props.intl.formatMessage(messages.yowzaBlack);
    return (
      <div className='yowza-black'>
        <YowzaBlackButton buttonText={buttonText} extraClasses={this.props.extraClasses} />
      </div>
    );
  }
}

export default injectIntl(YowzaBlack)
