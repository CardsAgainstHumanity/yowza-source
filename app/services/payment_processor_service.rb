# frozen_string_literal: true

class PaymentProcessorService < BaseService
  PURCHASE_TYPES_TO_PROCESSING_CLASS = {
    'yb' => 'YowzaBlackProcessor',
    'ybb' => 'YowzaBlackerProcessor',
    'followers' => 'FollowersProcessor',
    'likes' => 'LikesProcessor',
    'bot_follow' => 'BotFollowProcessor',
    'black_check' => 'BlackCheckProcessor',
    'ringtone' => 'RingtoneProcessor',
    'yowzacoin' => 'YowzacoinProcessor',
    'shazam' => 'ShazamProcessor',
  }.freeze

  def call(account_id, purchase_type, purchase_target, _payment_intent)
    account = Account.find(account_id)
    processor_class = "PaymentProcessorService::#{PURCHASE_TYPES_TO_PROCESSING_CLASS[purchase_type]}".constantize
    processor_class.process!(account, purchase_target)
  end

  class YowzaBlackProcessor
    def self.process!(account, _purchase_target)
      account.update(yowza_black_status: 'yb')

      YowzaBlackReceiptMailerWorker.perform_async(account.user.id, 'Black') if account.user
    end
  end

  class YowzaBlackerProcessor
    def self.process!(account, _purchase_target)
      account.update(yowza_black_status: 'ybb')

      YowzaBlackReceiptMailerWorker.perform_async(account.user.id, 'Blacker') if account.user
    end
  end

  class FollowersProcessor
    def self.process!(account, _purchase_target)
      account.increment_cosmetic_followers_count!

      OneHundredKFollowersReceiptMailerWorker.perform_async(account.user.id) if account.user
    end
  end

  class LikesProcessor
    def self.process!(account, purchase_target)
      status_id = purchase_target.split('/').last
      Status.find(status_id).increment_cosmetic_favourites_count!

      return unless account.user

      OneMillionLikesMailerWorker.perform_async(
        account.user.id,
        status_id
      )
    end
  end

  class BotFollowProcessor
    def self.process!(account, purchase_target)
      source_account = Account.find_by(username: purchase_target.split('@').last)
      FollowService.new.call(source_account, account)

      return unless account.user && source_account.user

      BotFollowMailerWorker.perform_async(
        account.user.id,
        source_account.user.id
      )
    end
  end

  class BlackCheckProcessor
    def self.process!(account, _purchase_target)
      account.increment_purchased_checks!

      return unless account.user

      NthCheckMailerWorker.perform_async(
        account.user.id,
        account.purchased_checks
      )
    end
  end

  class RingtoneProcessor
    def self.process!(account, _purchase_target)
      RingtoneMailerWorker.perform_async(account.user.id) if account.user
    end
  end

  class YowzacoinProcessor
    def self.process!(account, _purchase_target)
      YowzaCoinMailerWorker.perform_async(account.user.id) if account.user
    end
  end

  class ShazamProcessor
    def self.process!(account, _purchase_target)
      account.update(shazam: true)

      ShazamMailerWorker.perform_async(account.user.id) if account.user
    end
  end
end
