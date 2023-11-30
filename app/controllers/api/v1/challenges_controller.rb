# frozen_string_literal: true

class Api::V1::ChallengesController < Api::BaseController
  include Authorization

  skip_before_action :require_authenticated_user!

  def index
    results = Rails.cache.fetch('challenge_results', expires_in: 2.weeks) do
      ChallengeResult.results
    end
    render json: results
  end
end
