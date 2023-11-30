# frozen_string_literal: true

class OneMillionLikesMailerWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull'

  def perform(user_id, status_id)
    user = User.find(user_id)
    status = Status.find(status_id)

    UserMailer.one_million_likes_receipt(user: user, status: status).deliver_later!
  end
end
