# frozen_string_literal: true

class PasswordResetMailerWorker
  include Sidekiq::Worker

  def perform(user_id)
    user = User.find(user_id)

    UserMailer.password_reset(user).deliver_later!
  end
end
