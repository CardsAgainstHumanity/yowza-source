# frozen_string_literal: true

class Api::V1::YowzaStoreController < Api::BaseController
  include Authorization
  include ActionView::Helpers::NumberHelper

  def index
    bots = Rails.cache.fetch('bot_accounts', expires_in: 10.minutes) do
      Account.bots.without_instance_actor.map do |bot|
        next {
          username: bot.username,
          display_name: bot.display_name,
          price: number_to_currency(bot.price.to_f / 100),
        }
      end
    end
    render json: { bots: bots }
  end
end
