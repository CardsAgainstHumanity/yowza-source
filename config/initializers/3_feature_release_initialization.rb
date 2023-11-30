# frozen_string_literal: true

Rails.application.reloader.to_prepare do
  FeatureRelease.instance if ActiveRecord::Base.connection.data_source_exists? 'feature_releases'
end
