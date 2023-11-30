import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import {
  CHANGE_STORE_ITEM_VALUE,
  POPULATE_INITIAL_STORE,
  RESET_STORE,
  TOGGLE_STORE_ITEM
} from '../actions/yowza_store';

const initialState = ImmutableMap({
  itemIds: ImmutableList(),
  items: ImmutableMap(),
  selectOptions: ImmutableMap(),
});

const totalCheckPrices = {
  2: 2.99,
  3: 4.99,
  4: 9.99,
}

export default function yowzaStore(state = initialState, action) {
  switch(action.type) {
  case POPULATE_INITIAL_STORE:
    return state.withMutations((map) => {
      let itemIds = [
        'followers',
        'likes',
        'bot_follow',
        'black_check',
        'ringtone',
        'yowzacoin',
        'shazam',
      ];

      let items = {
        followers: {
          id: 'followers',
          placeholder: 'placeholderHandle',
          toggleable: true,
          toggled: false,
          type: 'input',
          value: '',
          valid: false,
          validator: 'validHandle',
          price: 0.99,
          singlePrice: true,
        },
        likes: {
          id: 'likes',
          placeholder: 'placeholderURL',
          toggleable: true,
          toggled: false,
          type: 'input',
          value: '',
          valid: false,
          validator: 'validStatus',
          price: 0.99,
          singlePrice: true,
        },
        bot_follow: {
          id: 'bot_follow',
          toggleable: true,
          toggled: false,
          type: 'select',
          dropdownValuesKey: 'bots',
          value: '',
          valid: false,
          validator: 'validSelection',
          price: 0.99,
          singlePrice: false,
        },
        black_check: {
          id: 'black_check',
          toggleable: false,
          toggled: false,
          type: 'none',
          value: null,
          valid: true,
          validator: null,
          price: totalCheckPrices[action.totalChecks] || 2.99,
          singlePrice: true,
        },
        ringtone: {
          id: 'ringtone',
          placeholder: 'placeholderEmail',
          toggleable: true,
          toggled: false,
          type: 'input',
          value: '',
          valid: false,
          validator: 'validEmail',
          price: 0.99,
          singlePrice: true,
        },
        yowzacoin: {
          id: 'yowzacoin',
          placeholder: 'placeholderEmail',
          toggleable: true,
          toggled: false,
          type: 'input',
          value: '',
          valid: false,
          validator: 'validEmail',
          price: 0.99,
          singlePrice: true,
        },
        shazam: {
          id: 'shazam',
          toggleable: false,
          toggled: false,
          type: 'none',
          valid: true,
          value: null,
          validator: null,
          price: 29.99,
          singlePrice: true,
        },
      };

      const bots = action.data.bots.map((bot) => {
        return [bot.username, `${bot.display_name} (@${bot.username}) ${bot.price}`];
      })

      map.setIn(['selectOptions', 'bots'], fromJS(bots));
      map.set('itemIds', fromJS(itemIds));
      map.set('items', fromJS(items));
    });
  case CHANGE_STORE_ITEM_VALUE:
    return state.withMutations((map) => {
      map.setIn(['items', action.itemId, 'value'], action.value);
      map.setIn(['items', action.itemId, 'valid'], action.valid);
    });
  case TOGGLE_STORE_ITEM:
    return state.setIn(['items', action.itemId, 'toggled'], action.newToggleState);
  case RESET_STORE:
    return initialState;
  default:
    return state;
  }
}
