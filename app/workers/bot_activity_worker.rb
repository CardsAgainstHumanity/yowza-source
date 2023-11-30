# frozen_string_literal: true

class BotActivityWorker
  include Sidekiq::Worker

  sidekiq_options retry: 0, queue: 'scheduler'

  def perform(account_id)
    Account.find(account_id).do_a_bot_thing
  end
end
