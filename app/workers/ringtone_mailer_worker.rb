# frozen_string_literal: true

class RingtoneMailerWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull'

  def perform(user_id)
    user = User.find(user_id)

    UserMailer.ringtone(user: user).deliver_later!
  end
end
