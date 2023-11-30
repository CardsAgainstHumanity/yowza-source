# frozen_string_literal: true

class CheckoutSessionBuilderService < BaseService
  PURCHASE_TYPES_TO_PARAMS = {
    'yb' => { price: 99, desc: 'Upgrade to Yowza Black®' },
    'ybb' => { price: 199, desc: 'Upgrade to Yowza Blacker®' },
    'followers' => { price: 99, desc: 'Buy 100,000 Yowza Followers' },
    'likes' => { price: 99, desc: 'Buy 1 Million Yowza Likes' },
    'bot_follow' => { desc: 'Pay for Celeb to Follow You' },
    'black_check' => { desc: 'Buy Another Black Check' },
    'ringtone' => { price: 99, desc: 'Official Yowza Ringtone' },
    'yowzacoin' => { price: 99, desc: 'Buy One Official YowzaCoin' },
    'shazam' => { price: 2999, desc: 'Upgrade to SHAZAM Status' },
  }.freeze

  def call(user, purchase_type, purchase_target)
    @user = user

    purchase_info = PURCHASE_TYPES_TO_PARAMS[purchase_type]
    if purchase_info.present?
      {
        mode: 'payment',
        ui_mode: 'embedded',
        return_url: "#{root_url}success?session_id={CHECKOUT_SESSION_ID}",
        client_reference_id: @user.account.id,
        line_items: [{
          price_data: {
            unit_amount: price_for_purchase_type(purchase_type, purchase_target),
            currency: 'usd',
            product_data: {
              name: purchase_info[:desc],
            },
          },
          quantity: 1,
        }],
        metadata: {
          purchase_type: purchase_type,
          purchase_target: purchase_target,
          consuming_app: 'yowza',
        },
      }
    else
      {}
    end
  end

  private

  def price_for_purchase_type(purchase_type, purchase_target)
    case purchase_type
    when 'black_check'
      case @user.account.purchased_checks
      when 0
        299
      when 1
        499
      when 2
        999
      end
    when 'bot_follow'
      Account.bots.find_by(username: purchase_target).price
    else
      PURCHASE_TYPES_TO_PARAMS[purchase_type][:price]
    end
  end
end
