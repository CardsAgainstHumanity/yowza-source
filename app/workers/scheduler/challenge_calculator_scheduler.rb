# frozen_string_literal: true

class Scheduler::ChallengeCalculatorScheduler
  include Sidekiq::Worker

  sidekiq_options retry: 0

  def perform
    ChallengeCalculatorService.new.call
  end
end
