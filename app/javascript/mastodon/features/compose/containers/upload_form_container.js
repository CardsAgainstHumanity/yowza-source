import { connect } from 'react-redux';

import UploadForm from '../components/upload_form';

const mapStateToProps = state => ({
  fileUpload: state.getIn(['compose', 'file_upload']),
});

export default connect(mapStateToProps)(UploadForm);
