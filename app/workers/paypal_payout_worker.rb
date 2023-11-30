# frozen_string_literal: true

class PaypalPayoutWorker
  include Sidekiq::Worker

  def perform(invite_id)
    invite = Invite.find(invite_id)
    referrer = invite.user
    return true if referrer.paid_for_referral?

    uri = URI(ENV.fetch('PAYOUT_API_ENDPOINT', nil))
    Net::HTTP.post_form(uri, email: invite.user.email, phone: invite.user.phone, api_key: ENV.fetch('PAYOUT_API_KEY', nil))
    referrer.update(paid_for_referral: true)
  end
end
