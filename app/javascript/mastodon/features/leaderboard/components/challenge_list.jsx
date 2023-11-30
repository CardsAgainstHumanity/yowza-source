import { PureComponent } from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';

import ChallengeContainer from 'mastodon/features/leaderboard/containers/challenge_container';

export class ChallengeList extends PureComponent {
  static propTypes = {
    challengeIds: ImmutablePropTypes.list.isRequired,
  };

  render () {
    const { challengeIds } = this.props;

    return (
      <div className='challenge-list'>
        {challengeIds.toArray().map((id, index) => {
          return (<ChallengeContainer
                  key={`${id}-${index}`}
                  challengeId={id}
                />)
        })}
      </div>
    );
  }
}

