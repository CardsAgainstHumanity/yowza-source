import PropTypes from 'prop-types';

import ImmutablePureComponent from 'react-immutable-pure-component';

import UploadContainer from '../containers/upload_container';
import UploadProgressContainer from '../containers/upload_progress_container';

export default class UploadForm extends ImmutablePureComponent {

  static propTypes = {
    fileUpload: PropTypes.string,
  };

  render () {
    const { fileUpload } = this.props;

    return (
      <div className='compose-form__upload-wrapper'>
        <UploadProgressContainer />

        <div className='compose-form__uploads-wrapper'>
          <UploadContainer fileUpload={fileUpload} />
        </div>
      </div>
    );
  }

}
