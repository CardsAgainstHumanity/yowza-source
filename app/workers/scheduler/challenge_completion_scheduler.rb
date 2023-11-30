# frozen_string_literal: true

class Scheduler::ChallengeCompletionScheduler
  include Sidekiq::Worker

  sidekiq_options retry: 0

  def perform
    ChallengeCompletionService.new.call
  end
end
