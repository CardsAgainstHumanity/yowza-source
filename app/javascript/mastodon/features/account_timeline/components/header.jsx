import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { NavLink } from 'react-router-dom';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import InnerHeader from '../../account/components/header';

import MemorialNote from './memorial_note';
import MovedNote from './moved_note';

export default class Header extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    onFollow: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired,
    onMention: PropTypes.func.isRequired,
    onDirect: PropTypes.func.isRequired,
    onReblogToggle: PropTypes.func.isRequired,
    onReport: PropTypes.func.isRequired,
    onMute: PropTypes.func.isRequired,
    onEndorseToggle: PropTypes.func.isRequired,
    onAddToList: PropTypes.func.isRequired,
    onChangeLanguages: PropTypes.func.isRequired,
    onInteractionModal: PropTypes.func.isRequired,
    onOpenAvatar: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    hideTabs: PropTypes.bool,
    domain: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  handleFollow = () => {
    this.props.onFollow(this.props.account);
  };

  handleBlock = () => {
    this.props.onBlock(this.props.account);
  };

  handleMention = () => {
    this.props.onMention(this.props.account, this.context.router.history);
  };

  handleDirect = () => {
    this.props.onDirect(this.props.account, this.context.router.history);
  };

  handleReport = () => {
    this.props.onReport(this.props.account);
  };

  handleReblogToggle = () => {
    this.props.onReblogToggle(this.props.account);
  };

  handleNotifyToggle = () => {
    this.props.onNotifyToggle(this.props.account);
  };

  handleMute = () => {
    this.props.onMute(this.props.account);
  };

  handleEndorseToggle = () => {
    this.props.onEndorseToggle(this.props.account);
  };

  handleAddToList = () => {
    this.props.onAddToList(this.props.account);
  };

  handleEditAccountNote = () => {
    this.props.onEditAccountNote(this.props.account);
  };

  handleChangeLanguages = () => {
    this.props.onChangeLanguages(this.props.account);
  };

  handleInteractionModal = () => {
    this.props.onInteractionModal(this.props.account);
  };

  handleOpenAvatar = () => {
    this.props.onOpenAvatar(this.props.account);
  };

  render () {
    const { account, hidden, hideTabs } = this.props;

    if (account === null) {
      return null;
    }

    return (
      <div className='account-timeline__header'>
        {(!hidden && account.get('memorial')) && <MemorialNote />}
        {(!hidden && account.get('moved')) && <MovedNote from={account} to={account.get('moved')} />}

        <InnerHeader
          account={account}
          onFollow={this.handleFollow}
          onBlock={this.handleBlock}
          onMention={this.handleMention}
          onDirect={this.handleDirect}
          onReblogToggle={this.handleReblogToggle}
          onNotifyToggle={this.handleNotifyToggle}
          onReport={this.handleReport}
          onMute={this.handleMute}
          onEndorseToggle={this.handleEndorseToggle}
          onAddToList={this.handleAddToList}
          onEditAccountNote={this.handleEditAccountNote}
          onChangeLanguages={this.handleChangeLanguages}
          onInteractionModal={this.handleInteractionModal}
          onOpenAvatar={this.handleOpenAvatar}
          onOpenURL={this.props.onOpenURL}
          domain={this.props.domain}
          hidden={hidden}
        />

        {!(hideTabs || hidden) && (
          <div className='account__section-headline'>
            <NavLink exact to={`/@${account.get('acct')}`}><FormattedMessage id='account.posts' defaultMessage='Yowzas' /></NavLink>
            <NavLink exact to={`/@${account.get('acct')}/with_replies`}><FormattedMessage id='account.posts_with_replies' defaultMessage='Yowzas and replies' /></NavLink>
          </div>
        )}
      </div>
    );
  }

}
