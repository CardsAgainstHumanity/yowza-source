import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import ImmutablePureComponent from 'react-immutable-pure-component';

import spring from 'react-motion/lib/spring';

import { Icon }  from 'mastodon/components/icon';

import Motion from '../../ui/util/optional_motion';

export default class Upload extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    fileUpload: PropTypes.string,
    onUndo: PropTypes.func.isRequired,
  };

  handleUndoClick = e => {
    e.stopPropagation();
    this.props.onUndo();
  };

  render () {
    const { fileUpload } = this.props;

    if (!fileUpload) {
      return null;
    }

    return (
      <div className='compose-form__upload'>
        <Motion defaultStyle={{ scale: 0.8 }} style={{ scale: spring(1, { stiffness: 180, damping: 12 }) }}>
          {({ scale }) => (
            <div className='compose-form__upload-thumbnail' style={{ transform: `scale(${scale})`, backgroundImage: `url(${fileUpload})` }}>
              <div className='compose-form__upload__actions'>
                <button type='button' className='icon-button' onClick={this.handleUndoClick}><Icon id='times' /> <FormattedMessage id='upload_form.undo' defaultMessage='Delete' /></button>
              </div>
            </div>
          )}
        </Motion>
      </div>
    );
  }

}
