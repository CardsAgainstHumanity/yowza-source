import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import ItemContainer from 'mastodon/features/yowza_store/containers/item_container'

import { openModal, closeModal } from '../../../actions/modal';

class ItemList extends PureComponent {
  static propTypes = {
    itemIds: ImmutablePropTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  onClick = () => {
    this.props.dispatch(closeModal({
        modalType: undefined,
        ignoreFocus: false,
      }));
    this.props.dispatch(openModal({ modalType: 'BUY_YOWZA' }));
  }


  render () {
    const { itemIds } = this.props;


    return (
      <div className='yowza-store-items'>
        {itemIds.toArray().map((id, index) => {
          return (<ItemContainer
                  key={`${id}-${index}`}
                  itemId={id}
                  />)
        })}
        { !!itemIds && !!itemIds.size && (<div className='item'>
          <button className='button-select' onClick={this.onClick}>
            <div className='button-select__title'>Buy Yowza</div>
            <div className='button-select__tag'>
              <span className='button-select__tag-price' >$44,000,000,000</span>
            </div>
          </button>
        </div>)}
      </div>
    );
  }
}

export default connect()(ItemList);
