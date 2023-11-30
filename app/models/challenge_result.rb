# frozen_string_literal: true

# == Schema Information
#
# Table name: challenge_results
#
#  id         :bigint(8)        not null, primary key
#  result_for :string
#  result     :text             default([]), is an Array
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class ChallengeResult < ApplicationRecord
  CHALLENGES = [
    MOST_LIKES = 'most_likes',
    MOST_NEW_FOLLOWERS = 'most_new_followers',
    MOST_REBLOGGED = 'most_reblogged',
    MOST_REFERRALS = 'most_referrals',
    MOST_LIKED_AWOOGA = 'most_liked_awooga',
    MOST_ACTIVE_POLL = 'most_active_poll',
    MOST_REBLOGGED_AWOOGA = 'most_reblogged_awooga',
    MOST_MENTIONS = 'most_mentions',
  ].freeze

  def self.day_today
    Time.now.in_time_zone('Pacific Time (US & Canada)').day
  end

  def self.challenges
    {
      MOST_LIKES => {
        start_time: DateTime.new(2023, 11, day_today, 11, 0, 0, '-8'),
        end_time: DateTime.new(2023, 11, day_today, 11, 59, 59, '-8'),
        title: I18n.t('challenges.most_likes.title'),
        description: I18n.t('challenges.most_likes.description'),
        result_descriptor: I18n.t('challenges.most_likes.result_descriptor'),
      },
      MOST_NEW_FOLLOWERS => {
        start_time: DateTime.new(2023, 11, day_today, 12, 0, 0, '-8'),
        end_time: DateTime.new(2023, 11, day_today, 12, 59, 59, '-8'),
        title: I18n.t('challenges.most_new_followers.title'),
        description: I18n.t('challenges.most_new_followers.description'),
        result_descriptor: I18n.t('challenges.most_new_followers.result_descriptor'),
      },
      MOST_REBLOGGED => {
        start_time: DateTime.new(2023, 11, day_today, 13, 0, 0, '-8'),
        end_time: DateTime.new(2023, 11, day_today, 13, 59, 59, '-8'),
        title: I18n.t('challenges.most_reblogged.title'),
        description: I18n.t('challenges.most_reblogged.description'),
        result_descriptor: I18n.t('challenges.most_reblogged.result_descriptor'),
      },
      MOST_REFERRALS => {
        start_time: DateTime.new(2023, 11, day_today, 14, 0, 0, '-8'),
        end_time: DateTime.new(2023, 11, day_today, 14, 59, 59, '-8'),
        title: I18n.t('challenges.most_referrals.title'),
        description: I18n.t('challenges.most_referrals.description'),
        result_descriptor: I18n.t('challenges.most_referrals.result_descriptor'),
      },
      MOST_LIKED_AWOOGA => {
        start_time: DateTime.new(2023, 11, day_today, 15, 0, 0, '-8'),
        end_time: DateTime.new(2023, 11, day_today, 15, 59, 59, '-8'),
        title: I18n.t('challenges.most_liked_awooga.title'),
        description: I18n.t('challenges.most_liked_awooga.description'),
        result_descriptor: I18n.t('challenges.most_liked_awooga.result_descriptor'),
      },
      MOST_ACTIVE_POLL => {
        start_time: DateTime.new(2023, 11, day_today, 16, 0, 0, '-8'),
        end_time: DateTime.new(2023, 11, day_today, 16, 59, 59, '-8'),
        title: I18n.t('challenges.most_active_poll.title'),
        description: I18n.t('challenges.most_active_poll.description'),
        result_descriptor: I18n.t('challenges.most_active_poll.result_descriptor'),
      },
      MOST_REBLOGGED_AWOOGA => {
        start_time: DateTime.new(2023, 11, day_today, 17, 0, 0, '-8'),
        end_time: DateTime.new(2023, 11, day_today, 17, 59, 59, '-8'),
        title: I18n.t('challenges.most_reblogged_awooga.title'),
        description: I18n.t('challenges.most_reblogged_awooga.description'),
        result_descriptor: I18n.t('challenges.most_reblogged_awooga.result_descriptor'),
      },
      MOST_MENTIONS => {
        start_time: DateTime.new(2023, 11, day_today, 18, 0, 0, '-8'),
        end_time: DateTime.new(2023, 11, day_today, 18, 59, 59, '-8'),
        title: I18n.t('challenges.most_mentions.title'),
        description: I18n.t('challenges.most_mentions.description'),
        result_descriptor: I18n.t('challenges.most_mentions.result_descriptor'),
      },
    }.freeze
  end

  def self.results
    CHALLENGES.map.with_index do |key, index|
      challenge = challenges[key]
      challenge_result = Rails.cache.read(key) || ChallengeResult.where(result_for: key).order(created_at: :asc).last&.result
      if challenge_result.nil?
        first_challenge = index.zero?
        next {
          id: key,
          title: first_challenge ? challenge[:title] : I18n.t('challenges.pending.title'),
          description: first_challenge ? challenge[:description] : I18n.t('challenges.pending.description'),
          starts_at: challenge[:start_time].to_s,
          ends_at: challenge[:end_time].to_s,
          started: false,
          finished: false,
          results: [],
        }
      end

      challenge_hash = {
        id: key,
        title: challenge[:title],
        description: challenge[:description],
        result_descriptor: challenge[:result_descriptor],
        starts_at: challenge[:start_time].to_s,
        ends_at: challenge[:end_time].to_s,
        started: DateTime.now > challenge[:start_time],
        finished: ChallengeCompletion.find_by(completion_for: key, processed: true).present? && challenge_result.present?,
        results: challenge_result || [],
      }
      challenge_hash
    end
  end
end
