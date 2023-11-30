import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import { Helmet } from 'react-helmet';

import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';


import { initializeStore, resetStore } from 'mastodon/actions/yowza_store';

import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';


import ItemList from './components/item_list';

const messages = defineMessages({
  storeTitle: { id: 'column.store', defaultMessage: 'Yowza Store' },
  header: { id: 'yowza_store.header', defaultMessage: 'Welcome to the official Yowza Store, where you can get everything you need to turn your Yowza experience UP TO ELEVEN!' },
});

const mapStateToProps = state => ({
  itemIds: state.getIn(['yowzaStore', 'itemIds'])
});

class YowzaStore extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    itemIds: ImmutablePropTypes.list.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(initializeStore());
  }

  componentWillUnmount() {
    this.props.dispatch(resetStore());
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setColumnRef = c => {
    this.column = c;
  };

  render () {
    return (
      <Column bindToDocument ref={this.setColumnRef} label={this.props.intl.formatMessage(messages.storeTitle)}>
        <div className='yowza-store'>
          <ColumnHeader
            icon='store'
            active={false}
            title={this.props.intl.formatMessage(messages.storeTitle)}
            onClick={this.handleHeaderClick}
            multiColumn={false}
          />

          <div className='copy-box'>
            <h1>{this.props.intl.formatMessage(messages.storeTitle)}</h1>
            <p>Welcome to the <strong>Official Yowza Store,</strong> where you can spend money to become the social media influencer you were born to be. 😎</p>
          </div>

          <ItemList
          itemIds={this.props.itemIds}
          />


          <Helmet>
            <title>{this.props.intl.formatMessage(messages.storeTitle)}</title>
            <meta name='robots' content='noindex' />
          </Helmet>
        </div>
      </Column>
    );
  }
}

export default connect(mapStateToProps)(injectIntl(YowzaStore));
