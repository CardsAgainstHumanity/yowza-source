import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { assetHost } from 'mastodon/utils/config';

export default class VerifiedYowzaBadge extends PureComponent {
  static propTypes = {
    badgeClass: PropTypes.string,
    badgeCount: PropTypes.number,
  };

  render () {
    const { badgeClass, badgeCount } = this.props;
    const url = `${assetHost}/${badgeClass ? badgeClass : 'black-verified-badge'}.svg`;

    return (
      <span className={`yb-badges-wrapper ${badgeClass ? badgeClass : ''}`}>
        {[...Array(badgeCount)].map((_, index) => (
          <span key={index} className='yb-badge-aligner'>
            <img src={url} alt='yowza black badge' />
          </span>
        ))}
      </span>
    );
  };
};
