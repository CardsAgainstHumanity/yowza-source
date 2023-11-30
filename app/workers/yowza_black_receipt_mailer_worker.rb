# frozen_string_literal: true

class YowzaBlackReceiptMailerWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull'

  def perform(user_id, yb_level)
    user = User.find(user_id)

    UserMailer.yowza_black_receipt(user, yb_level).deliver_later!
  end
end
