# frozen_string_literal: true

class Api::V1::LeaderboardController < Api::BaseController
  include Authorization

  skip_before_action :require_authenticated_user!

  DEFAULT_PAGE_SIZE = 250
  LIMIT = 2921

  def index
    @leaderboard = Rails.cache.fetch('leaderboard_top_50', expires_in: 2.weeks) do
      fetch_leaderboard.map do |inv|
        {
          username: inv.user.account.username,
          uses: inv.referrals,
          id: inv.user.account.id,
          total_checks: inv.user.account.total_checks,
          badge_class: inv.user.account.badge_class,
        }
      end
    end

    render json: @leaderboard
  end

  def paid_referrals_remaining
    render json: { remaining_payable_referrals: 0 }
  end

  private

  def fetch_leaderboard
    Invite.for_referral_contest.joins(user: :account).limit(50)
  end

  def pagination_params
    params.permit(:page, :page_size)
  end
end
