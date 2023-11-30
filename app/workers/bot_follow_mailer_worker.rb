# frozen_string_literal: true

class BotFollowMailerWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull'

  def perform(user_id, purchased_follower_id)
    user = User.find(user_id)
    purchased_follower = User.find(purchased_follower_id)

    UserMailer.celeb_follow(user: user, purchased_follower: purchased_follower).deliver_later!
  end
end
