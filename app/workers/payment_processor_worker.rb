# frozen_string_literal: true

class PaymentProcessorWorker
  include Sidekiq::Worker

  sidekiq_options retry: 0, queue: 'pull'

  def perform(account_id, purchase_type, purchase_target, payment_intent)
    PaymentProcessorService.new.call(account_id, purchase_type, purchase_target, payment_intent)
  end
end
