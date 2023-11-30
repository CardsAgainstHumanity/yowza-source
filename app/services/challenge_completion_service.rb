# frozen_string_literal: true

class ChallengeCompletionService < BaseService
  def call
    ::ChallengeResult::CHALLENGES.each do |result_set|
      process_results(result_set)
    end
  end

  def process_results(result_set)
    return unless Time.now.utc > ::ChallengeResult.challenges[result_set][:end_time] + 1.minute && ChallengeCompletion.where(completion_for: result_set, processed: true).empty?

    challenge_result = ChallengeResult.order(:created_at).where(result_for: result_set).last
    return if challenge_result&.result&.empty?

    begin
      Account.find_by(username: challenge_result.result[0]).update(winner: true)
    rescue => e
      Rails.logger.error("Winner assignment error: #{e}")
    end

    ChallengeCompletion.create(completion_for: result_set, processed: true)
    # email winner CSV ops or Nick or whomever
  end
end
