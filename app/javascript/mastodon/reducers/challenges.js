import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import {
  FETCH_CHALLENGE_REQUEST,
  FETCH_CHALLENGE_SUCCESS,
  FETCH_CHALLENGE_FAIL,
  RESET_CHALLENGES,
  TOGGLE_CHALLENGE_RESULTS,
} from '../actions/challenges';

const initialState = ImmutableMap({
  challengeIds: ImmutableList(),
  challenges: ImmutableMap(),
  toggledChallenges: ImmutableMap(),
  loading: false,
});

export default function challenges(state = initialState, action) {
  switch(action.type) {
  case FETCH_CHALLENGE_REQUEST:
    return state.set('loading', true);
  case FETCH_CHALLENGE_SUCCESS:
    return state.withMutations((map) => {
      const challenges = {};
      const challengeIds = action.challenges.map((c) => {
        challenges[c.id] = fromJS(c);
        return c.id;
      })

      map.set('challengeIds', ImmutableList(challengeIds));
      map.set('challenges', ImmutableMap(challenges));
      map.set('loading', false);
    });
  case FETCH_CHALLENGE_FAIL:
    return state.set('loading', false);
  case RESET_CHALLENGES:
    return initialState;
  case TOGGLE_CHALLENGE_RESULTS:
    return state.setIn(['toggledChallenges', action.challengeId], action.newToggleState);
  default:
    return state;
  }
}
