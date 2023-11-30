# frozen_string_literal: true

class NthCheckMailerWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull'

  def perform(user_id, checks_count)
    user = User.find(user_id)

    UserMailer.nth_black_check(
      user: user,
      checks_count: checks_count
    ).deliver_later!
  end
end
