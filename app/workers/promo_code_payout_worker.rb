# frozen_string_literal: true

class PromoCodePayoutWorker
  include Sidekiq::Worker

  def perform(user_id)
    referee = User.find(user_id)
    return true if referee.paid_as_referee?

    promo = PromoCode.unused.order('RANDOM()').limit(1).update(user: referee, used: true).first
    UserMailer.promo_code_payout(referee, promo).deliver_later!
    referee.update(paid_as_referee: true)
  end
end
