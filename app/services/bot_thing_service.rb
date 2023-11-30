# frozen_string_literal: true

class BotThingService < BaseService
  include YowzafyHelper

  RANDOM_ACTIVITIES = [
    :post,
    :reyowza,
    :reply,
    :like,
  ].freeze

  def call(account)
    case RANDOM_ACTIVITIES.sample
    when :post
      post_contents = []
      post_contents << yowzafy_string('a', allowed_words: account.allowed_words)
      post_contents << "##{yowzafy_string('', allowed_words: account.allowed_words, include_punctuation: false)}" if rand * 100 <= 33
      if rand * 100 <= 33
        random_user = Account.without_instance_actor.discoverable.order('RANDOM()').limit(1).first
        post_contents << "@#{random_user.username}"
      end
      post_contents << 'google.com' if rand * 100 <= 5
      post_contents = post_contents.shuffle.join(' ')
      post_params = {
        text: post_contents,
      }
      post_params[:include_file] = true if rand * 100 <= 2

      PostStatusService.new.call(
        account,
        post_params
      )
    when :reyowza
      reblog_status = Status.order('RANDOM()').limit(1).first
      ReblogService.new.call(account, reblog_status)
    when :reply
      reply_status = Status.order('RANDOM()').limit(1).first
      PostStatusService.new.call(
        account,
        text: "@#{reply_status.account.username} Yowza! #{Time.now.to_i}",
        in_reply_to_id: reply_status.id
      )
    when :like
      like_statuses = Status.order('RANDOM()').limit(10)
      like_statuses.each do |like_status|
        begin
          FavouriteService.new.call(account, like_status)
        rescue
          next
        end
      end
    end
  end
end
