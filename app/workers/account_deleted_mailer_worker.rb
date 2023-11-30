# frozen_string_literal: true

class AccountDeletedMailerWorker
  include Sidekiq::Worker

  def perform(user_id)
    user = User.find(user_id)

    UserMailer.account_deleted(user).deliver_later!
  end
end
