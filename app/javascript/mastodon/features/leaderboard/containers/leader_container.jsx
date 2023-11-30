import { connect } from 'react-redux';

import Leader from 'mastodon/features/leaderboard/components/leader';

const mapStateToProps = (state, props) => {
  const immutableLeader = state.getIn(['leaderboard', 'leaders', `${props.leaderId}`]);
  return {
    leader: {
      code: immutableLeader.get('code'),
      username: immutableLeader.get('username'),
      uses: immutableLeader.get('uses'),
      total_checks: immutableLeader.get('total_checks'),
      badge_class: immutableLeader.get('badge_class')
    },
    position: props.position
  };
};

export default connect(mapStateToProps)(Leader);

