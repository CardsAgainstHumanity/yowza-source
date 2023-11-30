# frozen_string_literal: true

# == Schema Information
#
# Table name: invites
#
#  id         :bigint(8)        not null, primary key
#  user_id    :bigint(8)        not null
#  code       :string           default(""), not null
#  expires_at :datetime
#  max_uses   :integer
#  uses       :integer          default(0), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  autofollow :boolean          default(FALSE), not null
#  comment    :text
#  referrals  :integer          default(0)
#

class Invite < ApplicationRecord
  include Expireable

  belongs_to :user, inverse_of: :invites
  has_many :users, inverse_of: :invite

  scope :available, -> { where(expires_at: nil).or(where('expires_at >= ?', Time.now.utc)) }
  # This is a doozy but basically any invite that hasn't paid out where one of
  # its invitees has posted once and followed two other people
  scope :payable, -> { includes(users: { account: :account_stat }).includes(:user).where(user: { paid_for_referral: false }).where(users: { account: { account_stats: { statuses_count: 1.. } } }) }
  # Ordered invites for users either without a role or with a default role (i.e.
  # normies)
  scope :for_referral_contest, -> { joins(user: :account).order(referrals: :desc).where.not(user: { account_id: Account.bots.without_instance_actor.pluck(:id) }).where(user: { role_id: [nil, -99] }) }

  validates :comment, length: { maximum: 420 }

  before_validation :set_code

  def valid_for_use?
    (max_uses.nil? || uses < max_uses) && !expired? && user&.functional?
  end

  def self.top_referrers
    Rails.cache.fetch('top_referrers', expires_in: 10.minutes) do
      for_referral_contest.first(10).map do |invite|
        {
          uses: invite.referrals,
          username: invite.user.account.username,
          code: invite.code, id: invite.user.account.id,
          total_checks: invite.user.account.total_checks,
          badge_class: invite.user.account.badge_class
        }
      end
    end
  end

  def code_parts
    @code_parts ||= YAML.load_file(Rails.root.join('config', 'referral_code_parts.yml'))
  end

  private

  def set_code
    loop do
      self.code = "#{code_parts['part_one'].sample}-#{code_parts['part_two'].sample}-#{code_parts['part_three'].sample}"
      break if Invite.find_by(code: code).nil?
    end
  end
end
