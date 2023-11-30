# frozen_string_literal: true

# == Schema Information
#
# Table name: feature_releases
#
#  id               :bigint(8)        not null, primary key
#  current_features :integer          default(0), not null
#  singleton_guard  :integer          not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
class FeatureRelease < ApplicationRecord
  include Redisable

  YOWZA_IMAGES = 1
  YOWZA_BLACK = 2
  YOWZA_STORE = 4
  REFERRALS = 8
  CHALLENGES = 16

  def self.instance
    first_or_create(singleton_guard: 0)
  end

  # ENABLE FEATURES
  def self.enable_yowza_images
    return true if yowza_images_enabled?(skip_cache: true)

    instance.update(current_features: instance.current_features + YOWZA_IMAGES)
  end

  def self.enable_yowza_black
    return true if yowza_black_enabled?(skip_cache: true)

    instance.update(current_features: instance.current_features + YOWZA_BLACK)
  end

  def self.enable_yowza_store
    return true if yowza_store_enabled?(skip_cache: true)

    instance.update(current_features: instance.current_features + YOWZA_STORE)
  end

  def self.enable_referrals
    return true if referrals_enabled?(skip_cache: true)

    instance.update(current_features: instance.current_features + REFERRALS)
  end

  def self.enable_challenges
    return true if challenges_enabled?(skip_cache: true)

    instance.update(current_features: instance.current_features + CHALLENGES)
  end

  # DISABLE FEATURES
  def self.disable_referrals
    return true unless referrals_enabled?(skip_cache: true)

    instance.update(current_features: instance.current_features - REFERRALS)
  end

  # CHECK ENABLED FEATURES
  def self.yowza_images_enabled?(skip_cache: false)
    return instance.current_features & YOWZA_IMAGES != 0 if skip_cache

    Rails.cache.fetch('yowza_images_enabled', expires_in: 1.minute) do
      instance.current_features & YOWZA_IMAGES != 0
    end
  end

  def self.yowza_black_enabled?(skip_cache: false)
    return instance.current_features & YOWZA_BLACK != 0 if skip_cache

    Rails.cache.fetch('yowza_black_enabled', expires_in: 1.minute) do
      instance.current_features & YOWZA_BLACK != 0
    end
  end

  def self.yowza_store_enabled?(skip_cache: false)
    return instance.current_features & YOWZA_STORE != 0 if skip_cache

    Rails.cache.fetch('yowza_store_enabled', expires_in: 1.minute) do
      instance.current_features & YOWZA_STORE != 0
    end
  end

  def self.referrals_enabled?(skip_cache: false)
    return instance.current_features & REFERRALS != 0 if skip_cache

    Rails.cache.fetch('referrals_enabled', expires_in: 1.minute) do
      instance.current_features & REFERRALS != 0
    end
  end

  def self.challenges_enabled?(skip_cache: false)
    return instance.current_features & CHALLENGES != 0 if skip_cache

    Rails.cache.fetch('challenges_enabled', expires_in: 1.minute) do
      instance.current_features & CHALLENGES != 0
    end
  end
end
