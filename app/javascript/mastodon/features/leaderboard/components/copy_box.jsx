import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { Markup } from 'react-render-markup';

export class CopyBox extends PureComponent {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    paidReferralsRemaining: PropTypes.number,
  };

  render () {
    const { activeTab, paidReferralsRemaining } = this.props;

    let slotsText = '...';
    let slotsClass = 'prizes__counter';
    if (paidReferralsRemaining !== null) {
      slotsText = paidReferralsRemaining > 0 ? paidReferralsRemaining.toLocaleString() : 'NO';
      if (paidReferralsRemaining === 0) {
        slotsClass = 'prizes__counter--empty';
      }
    }

    const referralsMarkup = `
      <div>
        <h1>Referral Leaderboard</h1>
        <p>With your help, Yowza is poised to become the world’s #1 social media platform. All we need is millions of users, and we’re not afraid to pay for them: we’re offering up to <strong>$69,420</strong> to refer new people by <strong>7:30 PM PT tonight.</strong></p>
        <p>Here’s how it works. When you signed up, we emailed you a referral code, like DUMPY-YACHT-GORGE. It’s also on your profile. Get people to enter your referral code when they sign up for Yowza, and you’ll rise through this table. For a referral to count, the new yowzer needs to post a yowza.</p>
      </div>

      <ul class="prizes prizes--referrals">
        <li>
          <div class="prizes__small">Top referrer earns</div>
          <div class="prizes__large">$69,420!</div>
        </li>
        <li>
          <div class="prizes__small">Next 420 earn</div>
          <div class="prizes__large">$69!</div>
        </li>
        <li>
          <div class="prizes__small">Next 2,500 earn</div>
          <div class="prizes__med">A FREE COPY OF <a href="https://www.HeadTrip.game" target="_blank">HEAD TRIP!</a></div>
        </li>
        <li>
          <div class="prizes__small">First 10,000 to refer anyone earn <strong>$4.20!</strong></div>
          <div class="prizes__counter ${slotsClass}">${slotsText} SLOTS LEFT</div>
        </li>
      </ul>
    `;

    const challengesMarkup = `
      <div>
        <h1>Yowza Challenges</h1>
        <p>Addicted to the dopamine hit of every like and follow? On Yowza, you can turn that dopamine into <b>cold hard cash!</b> Introducing <strong>Yowza Challenges,</strong> the ultimate way for us to capture 100% of your monetizable attention. 👀</p>
        <p>Here’s how it works. Each hour, we’ll post a new 60-minute challenge, like “get the most likes on a new yowza.” Challenges start at 11 PT, and we’ll reveal a new one every hour. Each Challenge winner gets <strong>$1,000.</strong> 🤑 YOWZA!</p>
      </div>

      <ul class="prizes prizes--challenges">
        <li>
          <div class="prizes__small">The top yowzer in each challenge gets</div>
          <div class="prizes__large">$1,000!</div>
        </li>
        <li>
          <div class="prizes__small">Next 100 yowzers in each challenge get</div>
          <div class="prizes__large">$50!</div>
        </li>
        <li>
          <div class="prizes__small">The eighth and final challenge winner gets</div>
          <div class="prizes__large">$5,000!</div>
        </li>
      </ul>
    `;

    return (
      <div className='copy-box leaderboardIntro'>
        {activeTab === 'referrals' && <Markup markup={referralsMarkup} />}
        {activeTab === 'challenges' && <Markup markup={challengesMarkup} />}
      </div>
    );
  }
}
