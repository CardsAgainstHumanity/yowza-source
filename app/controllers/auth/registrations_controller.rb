# frozen_string_literal: true

class Auth::RegistrationsController < Devise::RegistrationsController
  include RegistrationSpamConcern
  include PhoneNormalizationHelper

  layout :determine_layout

  before_action :set_invite, only: [:new, :create]
  before_action :check_enabled_registrations, only: [:new, :create]
  before_action :configure_sign_up_params, only: [:create]
  before_action :set_sessions, only: [:edit, :update]
  before_action :set_strikes, only: [:edit, :update]
  before_action :set_instance_presenter, only: [:new, :create, :update]
  before_action :set_body_classes, only: [:new, :create, :edit, :update, :confirm_phone, :verify_otp, :phone_form, :resend_code]
  before_action :require_not_suspended!, only: [:update]
  before_action :set_cache_headers, only: [:edit, :update]
  before_action :set_rules, only: :new
  before_action :require_rules_acceptance!, only: :new
  before_action :set_registration_form_time, only: :new

  skip_before_action :require_functional!, only: [:edit, :update, :confirm_phone, :verify_otp, :phone_form, :resend_code]

  def new
    super(&:build_invite_request)
  end

  def confirm_phone; end

  def resend_code
    if current_user.update(phone: normalize_phone(params[:user][:phone]))
      current_user.send_otp
      redirect_to auth_confirm_phone_path
    else
      render :resend_code
    end
  end

  def verify_otp
    if current_user.verify_otp(otp_code)
      current_user.update(phone_confirmed_at: Time.now.utc)
      redirect_to updates_opt_in_path
    else
      render :confirm_phone
    end
  end

  def update
    super do |resource|
      resource.clear_other_sessions(current_session.session_id) if resource.saved_change_to_encrypted_password?
    end
  end

  def destroy
    not_found
  end

  protected

  def update_resource(resource, params)
    params[:password] = nil if Devise.pam_authentication && resource.encrypted_password.blank?

    super
  end

  def build_resource(hash = nil)
    super(hash)

    resource.locale                 = I18n.locale
    resource.invite_code            = @invite&.code if resource.invite_code.blank?
    resource.registration_form_time = session[:registration_form_time]
    resource.sign_up_ip             = request.remote_ip

    resource.build_account if resource.account.nil?
  end

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up) do |user_params|
      user_params.permit({ account_attributes: [:username, :display_name], invite_request_attributes: [:text] }, :email, :password, :password_confirmation, :invite_code, :agreement, :website, :confirm_password, :phone)
    end
  end

  def after_sign_up_path_for(_resource)
    auth_setup_path
  end

  def after_sign_in_path_for(_resource)
    set_invite

    if @invite&.autofollow?
      short_account_path(@invite.user.account)
    else
      super
    end
  end

  def after_inactive_sign_up_path_for(_resource)
    new_user_session_path
  end

  def after_update_path_for(_resource)
    edit_user_registration_path
  end

  def check_enabled_registrations
    redirect_to root_path if single_user_mode? || omniauth_only? || !allowed_registrations? || ip_blocked?
  end

  def allowed_registrations?
    Setting.registrations_mode != 'none' || @invite&.valid_for_use?
  end

  def omniauth_only?
    ENV['OMNIAUTH_ONLY'] == 'true'
  end

  def ip_blocked?
    IpBlock.where(severity: :sign_up_block).where('ip >>= ?', request.remote_ip.to_s).exists?
  end

  def invite_code
    if params[:user]
      params[:user][:invite_code]&.downcase
    elsif params[:r]
      params[:r]&.downcase
    else
      params[:invite_code]&.downcase
    end
  end

  def otp_code
    params[:user][:otp]
  end

  private

  def set_instance_presenter
    @instance_presenter = InstancePresenter.new
  end

  def set_body_classes
    @body_classes = %w(edit update).include?(action_name) ? 'admin' : 'signup'
  end

  def set_invite
    @invite = begin
      invite = Invite.find_by(code: invite_code) if invite_code.present?
      invite if invite&.valid_for_use?
    end
  end

  def determine_layout
    %w(edit update).include?(action_name) ? 'admin' : 'auth'
  end

  def set_sessions
    @sessions = current_user.session_activations.order(updated_at: :desc)
  end

  def set_strikes
    @strikes = current_account.strikes.recent.latest
  end

  def require_not_suspended!
    forbidden if current_account.suspended?
  end

  def set_rules
    @rules = Rule.ordered
  end

  def require_rules_acceptance!
    return if @rules.empty? || (session[:accept_token].present? && params[:accept] == session[:accept_token])

    @accept_token = session[:accept_token] = SecureRandom.hex
    @invite_code  = invite_code

    set_locale { render :rules }
  end

  def set_cache_headers
    response.cache_control.replace(private: true, no_store: true)
  end
end
