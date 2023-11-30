# frozen_string_literal: true

class UserMailer < Devise::Mailer
  layout 'mailer'

  helper :accounts
  helper :application
  helper :instance
  helper :statuses
  helper :formatting

  helper RoutingHelper

  def confirmation_instructions(user, token, *, **)
    @resource = user
    @token    = token
    @instance = Rails.configuration.x.local_domain

    # Stub out instructions since users are auto-confirmed
    nil
  end

  def reset_password_instructions(user, token, *, **)
    @resource = user
    @token    = token
    @instance = Rails.configuration.x.local_domain

    return unless @resource.active_for_authentication?

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.reset_password_instructions.subject')
    end
  end

  def email_changed(user, *, **)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return unless @resource.active_for_authentication?

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.email_changed.subject')
    end
  end

  def two_factor_enabled(user, *, **)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return unless @resource.active_for_authentication?

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.two_factor_enabled.subject')
    end
  end

  def two_factor_disabled(user, *, **)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return unless @resource.active_for_authentication?

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.two_factor_disabled.subject')
    end
  end

  def two_factor_recovery_codes_changed(user, *, **)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return unless @resource.active_for_authentication?

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.two_factor_recovery_codes_changed.subject')
    end
  end

  def webauthn_enabled(user, *, **)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return unless @resource.active_for_authentication?

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.webauthn_enabled.subject')
    end
  end

  def webauthn_disabled(user, *, **)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return unless @resource.active_for_authentication?

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.webauthn_disabled.subject')
    end
  end

  def webauthn_credential_added(user, webauthn_credential)
    @resource = user
    @instance = Rails.configuration.x.local_domain
    @webauthn_credential = webauthn_credential

    return unless @resource.active_for_authentication?

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.webauthn_credential.added.subject')
    end
  end

  def webauthn_credential_deleted(user, webauthn_credential)
    @resource = user
    @instance = Rails.configuration.x.local_domain
    @webauthn_credential = webauthn_credential

    return unless @resource.active_for_authentication?

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.webauthn_credential.deleted.subject')
    end
  end

  def welcome(user)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return unless @resource.active_for_authentication?

    # Stub out - see sign_up_welcome
    nil
  end

  def backup_ready(user, backup)
    @resource = user
    @instance = Rails.configuration.x.local_domain
    @backup   = backup

    return unless @resource.active_for_authentication?

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.backup_ready.subject')
    end
  end

  def warning(user, warning)
    @resource = user
    @warning  = warning
    @instance = Rails.configuration.x.local_domain
    @statuses = @warning.statuses.includes(:account, :preloadable_poll, :media_attachments, active_mentions: [:account])

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t("user_mailer.warning.subject.#{@warning.action}", acct: "@#{user.account.local_username_and_domain}")
    end
  end

  def appeal_approved(user, appeal)
    @resource = user
    @instance = Rails.configuration.x.local_domain
    @appeal   = appeal

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.appeal_approved.subject', date: l(@appeal.created_at))
    end
  end

  def appeal_rejected(user, appeal)
    @resource = user
    @instance = Rails.configuration.x.local_domain
    @appeal   = appeal

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.appeal_rejected.subject', date: l(@appeal.created_at))
    end
  end

  def suspicious_sign_in(user, _remote_ip, _user_agent, _timestamp)
    @resource = user

    # Stub out
    nil
  end

  # 1 - Sign-up email
  # SignUpWelcomeMailerWorker
  def sign_up_welcome(user)
    @resource = user

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.sign_up_welcome.subject')
    end
  end

  # 2 - Email you get if you used a referral code during sign-up
  # PromoCodePayoutWorker
  def promo_code_payout(user, promo_code)
    @resource = user
    @promo_code = promo_code

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.promo_code_payout.subject')
    end
  end

  # 3 - Free Head Trip
  # FreeHeadTripMailerWorker
  def free_head_trip(user)
    @resource = user

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.free_head_trip.subject')
    end
  end

  # 4 - Account deleted
  # AccountDeletedMailerWorker
  def account_deleted(user)
    @resource = user

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.account_deleted.subject')
    end
  end

  # 5 - Password reset
  # PasswordResetMailerWorker
  def password_reset(user)
    @resource = user

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.password_reset.subject')
    end
  end

  # 6 - Password changed
  # overwrote existing method/mailer and using existing, Devise-triggeredworker
  def password_change(user, *, **)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return unless @resource.active_for_authentication?

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.password_change.subject')
    end
  end

  # 7-8 - Yowza Black receipt / Yowza Blacker receipt
  # YowzaBlackReceiptMailerWorker
  def yowza_black_receipt(user, yb_level)
    @resource = user
    @yb_level = yb_level
    @price = yb_level == 'Black' ? '0.99' : '1.99'

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.yowza_black_receipt.subject', yb_level: yb_level)
    end
  end

  # 9 - Store: 100k followers receipt
  # OneHundredKFollowersReceiptMailerWorker
  def one_hundred_k_followers_receipt(user)
    @resource = user

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.one_hundred_k_followers_receipt.subject')
    end
  end

  # 10 - Store: 1 million likes receipt
  # OneMillionLikesMailerWorker
  def one_million_likes_receipt(user:, status:)
    @resource = user
    @status = status

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.one_million_likes_receipt.subject')
    end
  end

  # 11 - Store: Celeb follow
  # BotFollowMailerWorker
  def celeb_follow(user:, purchased_follower:)
    @resource = user
    @purchased_follower = purchased_follower

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.celeb_follow.subject')
    end
  end

  # 12-14 - 3rd Black Check, 4th Black Check, 5th Black Check
  # NthCheckMailerWorker
  CHECKS_COUNT_PRICE_MAP = {
    1 => '$2.99',
    2 => '$4.99',
    3 => '$9.99',
  }.freeze

  CHECKS_COUNT_TO_ENGLISH_MAP = {
    1 => 'third',
    2 => 'fourth',
    3 => 'fifth',
  }.freeze

  def nth_black_check(checks_count:, user:)
    @resource = user
    @checks_count = checks_count
    @checks_count_english = CHECKS_COUNT_TO_ENGLISH_MAP.fetch(@checks_count, 'third')
    @price = CHECKS_COUNT_PRICE_MAP.fetch(@checks_count, '$2.99')

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.nth_black_check.subject', checks_count: '+' * checks_count)
    end
  end

  # 15 - Store: Ringtone
  # RingtoneMailerWorker
  def ringtone(user:)
    @resource = user

    attachments['YowzaRingtone.m4a'] = Rails.public_path.join('YowzaRingtone.m4a').read

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.ringtone.subject')
    end
  end

  # 16 - Store: YowzaCoin
  # YowzaCoinMailerWorker
  def yowzacoin(user:)
    @resource = user

    # TODO: image in design
    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.yowzacoin.subject')
    end
  end

  # 17 - Store: Shazam
  # ShazamMailerWorker
  def shazam(user:)
    @resource = user

    I18n.with_locale(locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.shazam.subject')
    end
  end

  private

  def locale
    @resource.locale.presence || I18n.default_locale
  end
end
