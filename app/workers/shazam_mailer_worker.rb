# frozen_string_literal: true

class ShazamMailerWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull'

  def perform(user_id)
    user = User.find(user_id)

    UserMailer.shazam(user: user).deliver_later!
  end
end
