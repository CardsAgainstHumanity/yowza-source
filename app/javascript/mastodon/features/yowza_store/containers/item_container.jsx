import { connect } from 'react-redux';

import { changeStoreItemValue, toggleStoreItem, submitItemForPurchase } from 'mastodon/actions/yowza_store';

import { me } from '../../../initial_state';
import Item from '../components/item';

const mapStateToProps = (state, props) => {
  const immutableItem = state.getIn(['yowzaStore', 'items', `${props.itemId}`]);
  const selectOptions = state.getIn(['yowzaStore', 'selectOptions']);
  return {
    item: immutableItem.toJS(),
    selectOptions: selectOptions.toJS(),
    account: state.getIn(['accounts', me]),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onConfirmItem (itemId, value) {
    dispatch(submitItemForPurchase(itemId, value))
  },
  onToggleItem (itemId) {
    dispatch(toggleStoreItem(itemId));
  },
  onItemValueChange (itemId, value, valid) {
    dispatch(changeStoreItemValue(itemId, value, valid));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Item);

