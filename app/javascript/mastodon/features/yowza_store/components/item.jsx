import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';

import { YBB } from 'mastodon/features/yowza_black';
import { cybs, shzm } from 'mastodon/initial_state';

const messages = defineMessages({
  confirm: { id: 'yowza_store.confirm', defaultMessage: 'Confirm' },
  placeholderEmail: { id: "yowza_store.placeholder.email", defaultMessage: "Email Address"},
  placeholderHandle: { id: "yowza_store.placeholder.handler", defaultMessage: "Yowza Handle"},
  placeholderURL: { id: "yowza_store.placeholder.url", defaultMessage: "Yowza URL"},
  followers: { id: "yowza_store.item.followers", defaultMessage: " " },
  likes: { id: "yowza_store.item.likes", defaultMessage: " " },
  bot_follow: { id: "yowza_store.item.bot_follow", defaultMessage: " " },
  black_check: { id: "yowza_store.item.black_check", defaultMessage: " " },
  ringtone: { id: "yowza_store.item.ringtone", defaultMessage: " " },
  yowzacoin: { id: "yowza_store.item.yowzacoin", defaultMessage: " " },
  shazam: { id: "yowza_store.item.shazam", defaultMessage: " " },
  // yowzaBlackerRequired: { id: "yowza_store.item.black_check.yowza_black_required", defaultMessage: },
  allTheChecks: { id: "yowza_store.item.black_check.all_the_checks", defaultMessage: "You now have all the checks." },
  itemPrice: { id: "yowza_store.item_price", defaultMessage: "${price}" },
});

const validators = {
  validHandle: (text) => { return !!text && text.startsWith('@') && text.length > 1 },
  validStatus: (text) =>{ return !!text && new RegExp(`^${window.location.origin}/@[A-Za-z0-9]+/(\\d+)$`).test(text) },
  validEmail: (text) => { return !!text && new RegExp(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/).test(text) },
  validSelection: (selection, props) => {
    const options = props.selectOptions[props.item.dropdownValuesKey];
    return !!selection && options.length > 0 && options.some(o => o[0] === selection)
  },
};

class Item extends PureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    item: PropTypes.object.isRequired,
    selectOptions: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    onConfirmItem: PropTypes.func.isRequired,
    onItemValueChange: PropTypes.func.isRequired,
    onToggleItem: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleCloseItemClick = this.handleCloseItemClick.bind(this);
    this.handleItemValueUpdate = this.handleItemValueUpdate.bind(this);
    this.initializePurchase = this.initializePurchase.bind(this);
  }

  handleItemClick() {
    if (this.props.item.toggleable && !this.props.item.toggled) {
      this.toggleItem()
    } else {
      this.initializePurchase();
    }
  }

  handleCloseItemClick() {
    this.toggleItem()
  }

  handleItemValueUpdate(e) {
    const newValue = e.target.value;
    const validator = validators[this.props.item.validator]

    const valid = validator ? validator(newValue, this.props) : true

    this.props.onItemValueChange(this.props.item.id, newValue, valid)
  }

  initializePurchase() {
    if(this.props.item.valid) {
      this.props.onConfirmItem(this.props.item.id, this.props.item.value);
    }
  }

  toggleItem() {
    this.props.onToggleItem(this.props.item.id);
  }

  render() {
    const buttonDisabled = (
      (this.props.item.id === 'black_check' && (cybs !== YBB || (this.props.account?.get('total_checks') || 0) >= 5)) ||
      (this.props.item.id === 'shazam' && (shzm))
    );

    let buttonDisabledContent = null;
    switch(this.props.item.id) {
      case 'black_check':
        buttonDisabledContent = cybs !== YBB ?
        (<span>First you need<br />Yowza Black &<br />Yowza Blacker</span>) :
        (<span>You now have<br />all the checks.</span>);
        break;
      case 'shazam':
        buttonDisabledContent = (<span>You can shazam.</span>);
        break;
    }

    return (
      <div className={`item ${this.props.item.id}`}>
        {this.props.item.toggled && (
          <>
            <button onClick={this.handleCloseItemClick} className='button-close'>
              <svg width='20' height='19' viewBox='0 0 20 19' fill='none'>
                <path fill-rule='evenodd' clip-rule='evenodd' d='M11.9222 9.58599L16.7392 4.76883L14.9995 3.02905L10.1826 7.84622L5.36563 3.02905L3.62595 4.76883L8.44287 9.58599L3.625 14.4041L5.36468 16.1439L10.1826 11.3258L15.0004 16.1439L16.7401 14.4041L11.9222 9.58599Z' fill='black' />
              </svg>
            </button>
            <div className='item__inputs'>
              {this.props.item.type === 'input' && (
                <input
                  placeholder={this.props.intl.formatMessage(messages[this.props.item.placeholder])}
                  value={this.props.item.value}
                  onChange={this.handleItemValueUpdate}
                />
              )}

              {this.props.item.type === 'select' && (
                <select
                  value={this.props.item.value}
                  onChange={this.handleItemValueUpdate}
                >
                  <option value='' />
                  {this.props.selectOptions[this.props.item.dropdownValuesKey].map((valsArray) => {
                    return (<option
                      key={valsArray[0]}

                      value={valsArray[0]}
                      >{valsArray[1]}</option>)
                  })}
                </select>
              )}

              <button
                type='button'
                disabled={!this.props.item.valid}
                onClick={this.initializePurchase}
              >
                {this.props.intl.formatMessage(messages.confirm)}
              </button>
            </div>
          </>
        )}

        {!this.props.item.toggled && (
          <button disabled={buttonDisabled} onClick={this.handleItemClick} className='button-select'>
            <div className='button-select__title'>{ this.props.intl.formatMessage(messages[this.props.item.id])}</div>
            <div className='button-select__tag'>
              { buttonDisabled && <span className='button-select__tag-message'>{buttonDisabledContent}</span> }
              { !buttonDisabled && <span className='button-select__tag-price'>{ this.props.intl.formatMessage(messages.itemPrice, { price: this.props.item.price }) }</span> }
              { !buttonDisabled && !this.props.item.singlePrice && <span className='button-select__tag-price-up'>&amp;<br />up</span> }
            </div>
          </button>
        )}
      </div>
    );
  }
}

export default injectIntl(Item);
