import { connect } from 'react-redux';

import { undoUploadCompose, submitCompose } from '../../../actions/compose';
import Upload from '../components/upload';

const mapDispatchToProps = dispatch => ({

  onUndo: () => {
    dispatch(undoUploadCompose());
  },

  onSubmit (router) {
    dispatch(submitCompose(router));
  },

});

export default connect(null, mapDispatchToProps)(Upload);
