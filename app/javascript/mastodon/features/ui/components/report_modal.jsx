import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import { OrderedSet } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { submitReport } from 'mastodon/actions/reports';
import { fetchServer } from 'mastodon/actions/server';
import { expandAccountTimeline } from 'mastodon/actions/timelines';
import { IconButton } from 'mastodon/components/icon_button';
import Thanks from 'mastodon/features/report/thanks';
import { makeGetAccount } from 'mastodon/selectors';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId }) => ({
    account: getAccount(state, accountId),
  });

  return mapStateToProps;
};

class ReportModal extends ImmutablePureComponent {

  static propTypes = {
    accountId: PropTypes.string.isRequired,
    statusId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
  };

  state = {
    step: 'category',
    selectedStatusIds: OrderedSet(this.props.statusId ? [this.props.statusId] : []),
    selectedDomains: OrderedSet(),
    comment: '',
    category: null,
    selectedRuleIds: OrderedSet(),
    isSubmitting: false,
    isSubmitted: true,
  };

  componentDidMount () {
    const { dispatch, accountId } = this.props;

    dispatch(expandAccountTimeline(accountId, { withReplies: true }));
    dispatch(fetchServer());
    dispatch(submitReport({
      account_id: accountId,
      status_ids: [],
      selected_domains: [],
      comment: null,
      forward: false,
      category: "other",
      rule_ids: [],
    }));
  }

  render () {
    const {
      account,
      intl,
      onClose,
    } = this.props;

    if (!account) {
      return null;
    }

    const {
      isSubmitted,
    } = this.state;


    const stepComponent = (
      <Thanks
        submitted={isSubmitted}
        account={account}
        onClose={onClose}
      />
    );

    return (
      <div className='modal-root__modal report-dialog-modal'>
        <div className='report-modal__target'>
          <IconButton className='report-modal__close' title={intl.formatMessage(messages.close)} icon='times' onClick={onClose} size={20} />
        </div>

        <div className='report-dialog-modal__container'>
          {stepComponent}
        </div>
      </div>
    );
  }

}

export default connect(makeMapStateToProps)(injectIntl(ReportModal));
