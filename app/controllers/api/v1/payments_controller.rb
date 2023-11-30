# frozen_string_literal: true

class Api::V1::PaymentsController < Api::BaseController
  before_action :require_user!, only: :create_session
  skip_before_action :require_authenticated_user!, only: :webhook
  before_action :ensure_valid_purchase

  def create_session
    checkout_session_params = if params[:purchase_type].present?
                                CheckoutSessionBuilderService.new.call(current_user, purchase_params[:purchase_type], purchase_params[:purchase_target])
                              elsif current_user.account.next_yowza_black_status.present?
                                CheckoutSessionBuilderService.new.call(current_user, current_user.account.next_yowza_black_status, nil)
                              end

    if checkout_session_params.present?
      checkout_session = Stripe::Checkout::Session.create(checkout_session_params)

      render json: { clientSecret: checkout_session.client_secret }
    else
      render json: { error: 'You have attained perfection' }, status: 422
    end
  end

  def webhook
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = ENV.fetch('STRIPE_ENDPOINT_SECRET', nil)
    event = Stripe::Webhook.construct_event(
      payload, sig_header, endpoint_secret
    )
    event_object = event.data.object

    PaymentProcessorWorker.perform_async(event_object.client_reference_id, event_object.metadata.purchase_type, event_object.metadata.try(:purchase_target), event_object.payment_intent) if event.type == 'checkout.session.completed' && event_object.metadata.try(:consuming_app) == 'yowza'

    render json: { status: 200 }
  end

  private

  def purchase_params
    params.permit(:purchase_type, :purchase_target)
  end

  def ensure_valid_purchase
    message = case params[:purchase_type]
              when 'yb', 'ybb'
                'You have already atttained perfection' if current_user.account.yowza_black_status == 'ybb'
              when 'black_check'
                'You do not qualify to buy this extra check' if current_user.account.yowza_black_status != 'ybb' || current_user.account.purchased_checks == 3
              when 'bot_follow'
                'This celebrity aleady follows you' if current_user.account.followers.include?(Account.bots.find_by(username: params[:purchase_target]))
              when 'shazam'
                'You are already shazamed' if current_user.account.shazam
              end

    render json: { error: message }, status: 422 if message
  end
end
