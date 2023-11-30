import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';

import ScrollableList from 'mastodon/components/scrollable_list';
import LeaderContainer from 'mastodon/features/leaderboard/containers/leader_container';

export class LeaderboardList extends PureComponent {
  static propTypes = {
    hasMore: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    leaderIds: ImmutablePropTypes.list.isRequired,
    onLoadMore: PropTypes.func
  };

  render () {
    const { hasMore, isLoading, leaderIds, onLoadMore } = this.props;

    const scrollableContent = leaderIds.toArray().map((id, index) => {
      return (<LeaderContainer
                key={`${id}-${index}`}
                leaderId={id}
                position={index + 1}
              />)
    });

    return (
      <div className='leaderboard-list'>
        <ScrollableList
          showLoading={isLoading && leaderIds.size === 0}
          onLoadMore={onLoadMore}
          scrollKey={'leaderboard'}
          hasMore={hasMore}
          bindToDocument
          trackScroll
        >
            {scrollableContent}
        </ScrollableList>
      </div>
    );
  }
}

