# frozen_string_literal: true

class Scheduler::SiteFeatureScheduler
  include Sidekiq::Worker

  sidekiq_options retry: 0

  def perform
    return true unless Rails.env.production? && DateTime.now < DateTime.new(2023, 11, 25, 0, 0, 0, '-8')

    enable_referrals_and_challenges
    enable_images
    enable_yowza_black
    enable_store
    disable_referrals
  end

  def enable_referrals_and_challenges
    start_time = DateTime.new(2023, 11, day_today, 6, 0, 0, '-8')
    end_time = start_time + 5.minutes
    return true unless Time.now.utc.between?(start_time, end_time)

    FeatureRelease.enable_referrals
    FeatureRelease.enable_challenges
  end

  def enable_images
    start_time = DateTime.new(2023, 11, day_today, 10, 30, 0, '-8')
    return true unless Time.now.utc > start_time

    FeatureRelease.enable_yowza_images
  end

  def enable_yowza_black
    start_time = DateTime.new(2023, 11, day_today, 12, 0, 0, '-8')
    return true unless Time.now.utc > start_time

    FeatureRelease.enable_yowza_black
  end

  def enable_store
    start_time = DateTime.new(2023, 11, day_today, 16, 1, 0, '-8')
    return true unless Time.now.utc > start_time

    FeatureRelease.enable_yowza_store
  end

  def disable_referrals
    start_time = DateTime.new(2023, 11, day_today, 19, 30, 0, '-8')
    return true unless Time.now.utc > start_time

    FeatureRelease.disable_referrals
  end

  def day_today
    Time.now.in_time_zone('Pacific Time (US & Canada)').day
  end
end
