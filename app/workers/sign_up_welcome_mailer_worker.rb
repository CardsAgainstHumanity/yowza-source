# frozen_string_literal: true

class SignUpWelcomeMailerWorker
  include Sidekiq::Worker

  def perform(user_id)
    user = User.find(user_id)

    UserMailer.sign_up_welcome(user).deliver_later!
  end
end
