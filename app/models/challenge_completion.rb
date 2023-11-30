# frozen_string_literal: true

# == Schema Information
#
# Table name: challenge_completions
#
#  id             :bigint(8)        not null, primary key
#  completion_for :string
#  processed      :boolean          default(FALSE), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
class ChallengeCompletion < ApplicationRecord
end
