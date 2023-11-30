# frozen_string_literal: true

class Scheduler::BotActivityScheduler
  include Sidekiq::Worker

  sidekiq_options retry: 0

  def perform
    return true unless FeatureRelease.yowza_store_enabled? && Rails.env.production?

    Account.bots.without_instance_actor.each do |bot|
      BotActivityWorker.perform_in(rand(1..5400).seconds, bot.id)
    end
  end
end
