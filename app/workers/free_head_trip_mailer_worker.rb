# frozen_string_literal: true

class FreeHeadTripMailerWorker
  include Sidekiq::Worker

  def perform(user_id)
    user = User.find(user_id)

    UserMailer.free_head_trip(user).deliver_later!
  end
end
