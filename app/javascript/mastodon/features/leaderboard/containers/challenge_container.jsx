import { connect } from 'react-redux';

import { toggleChallengeResults } from 'mastodon/actions/challenges';
import Challenge from 'mastodon/features/leaderboard/components/challenge';

const mapStateToProps = (state, props) => {
  const immutableChallenge = state.getIn(['challenges', 'challenges', `${props.challengeId}`]);
  return {
    challenge: immutableChallenge.toJS(),
    resultsToggled: state.getIn(['challenges', 'toggledChallenges', `${props.challengeId}`]) || false,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onToggleResultsClick (challengeId) {
    dispatch(toggleChallengeResults(challengeId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);

