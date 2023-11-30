# frozen_string_literal: true

class TriggerWebhookWorker
  include Sidekiq::Worker

  def perform(_event, _class_name, _id)
    true
  end
end
