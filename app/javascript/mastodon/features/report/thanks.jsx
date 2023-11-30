import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { FormattedMessage } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import {
  unfollowAccount,
  muteAccount,
  blockAccount,
} from 'mastodon/actions/accounts';

const mapStateToProps = () => ({});

class Thanks extends PureComponent {

  static propTypes = {
    submitted: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  handleCloseClick = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleUnfollowClick = () => {
    const { dispatch, account, onClose } = this.props;
    dispatch(unfollowAccount(account.get('id')));
    onClose();
  };

  handleMuteClick = () => {
    const { dispatch, account, onClose } = this.props;
    dispatch(muteAccount(account.get('id')));
    onClose();
  };

  handleBlockClick = () => {
    const { dispatch, account, onClose } = this.props;
    dispatch(blockAccount(account.get('id')));
    onClose();
  };

  render () {
    const { submitted } = this.props;

    return (
      <h3 className='report-dialog-modal__title'>{submitted ? <FormattedMessage id='report.thanks.title_actionable' defaultMessage="Thanks for reporting, we'll look into this." /> : <FormattedMessage id='report.thanks.title' defaultMessage="Don't want to see this?" />}</h3>
    );
  }

}

export default connect(mapStateToProps)(Thanks);
