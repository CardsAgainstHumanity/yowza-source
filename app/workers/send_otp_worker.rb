# frozen_string_literal: true

class SendOtpWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0, dead: false

  def perform(user_id)
    return unless Rails.env.production?

    user = User.find(user_id)
    return if user.account.bot_or_fauxbot?

    user.send_otp
  end
end
