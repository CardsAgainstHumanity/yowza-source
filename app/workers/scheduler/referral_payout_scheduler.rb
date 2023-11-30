# frozen_string_literal: true

class Scheduler::ReferralPayoutScheduler
  include Sidekiq::Worker

  sidekiq_options retry: 0

  def perform
    Invite.payable.each do |invite|
      PaypalPayoutWorker.perform_async(invite.id)
    end
  end
end
