# frozen_string_literal: true

class OneHundredKFollowersReceiptMailerWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull'

  def perform(user_id)
    user = User.find(user_id)

    UserMailer.one_hundred_k_followers_receipt(user).deliver_later!
  end
end
