import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { injectIntl } from 'react-intl';

import { NavLink } from 'react-router-dom';

import VerifiedYowzaBadge from '../../../components/verified_yowza_badge';

class Leader extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    leader: PropTypes.object.isRequired,
    position: PropTypes.number.isRequired,
  };

  render() {
    const leader = this.props.leader
    const username = `@${leader.username}`
    const userLink= `/${username}`
    const badgeClass = leader.badge_class
    const badgeCount = leader.total_checks
    return (
      <div className='leader'>
          <div className='position'>{this.props.position}</div>
          <div className='user'>
            <div className='username'>
              <NavLink exact to={userLink}>{username}</NavLink>
              <VerifiedYowzaBadge badgeCount={badgeCount} badgeClass={badgeClass} />
            </div>
            <div className='referral-code'>{leader.code}</div>
          </div>
          <div className='number'>{this.props.intl.formatNumber(leader.uses)}</div>
        </div>
    );
  }
}

export default injectIntl(Leader);
