# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/user_mailer

class UserMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/confirmation_instructions
  def confirmation_instructions
    UserMailer.confirmation_instructions(User.first, 'spec')
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/email_changed
  def email_changed
    user = User.first
    user.unconfirmed_email = 'foo@bar.com'
    UserMailer.email_changed(user)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/two_factor_disabled
  def two_factor_disabled
    UserMailer.two_factor_disabled(User.first)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/two_factor_enabled
  def two_factor_enabled
    UserMailer.two_factor_enabled(User.first)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/two_factor_recovery_codes_changed
  def two_factor_recovery_codes_changed
    UserMailer.two_factor_recovery_codes_changed(User.first)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/webauthn_enabled
  def webauthn_enabled
    UserMailer.webauthn_enabled(User.first)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/webauthn_disabled
  def webauthn_disabled
    UserMailer.webauthn_disabled(User.first)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/webauthn_credential_added
  def webauthn_credential_added
    webauthn_credential = WebauthnCredential.new(nickname: 'USB Key')
    UserMailer.webauthn_credential_added(User.first, webauthn_credential)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/webauthn_credential_deleted
  def webauthn_credential_deleted
    webauthn_credential = WebauthnCredential.new(nickname: 'USB Key')
    UserMailer.webauthn_credential_deleted(User.first, webauthn_credential)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/reconfirmation_instructions
  def reconfirmation_instructions
    user = User.first
    user.unconfirmed_email = 'foo@bar.com'
    UserMailer.confirmation_instructions(user, 'spec')
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/reset_password_instructions
  def reset_password_instructions
    UserMailer.reset_password_instructions(User.first, 'spec')
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/welcome
  def welcome
    UserMailer.welcome(User.first)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/backup_ready
  def backup_ready
    UserMailer.backup_ready(User.first, Backup.first)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/warning
  def warning
    UserMailer.warning(User.first, AccountWarning.last)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/appeal_approved
  def appeal_approved
    UserMailer.appeal_approved(User.first, Appeal.last)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/suspicious_sign_in
  def suspicious_sign_in
    UserMailer.suspicious_sign_in(User.first, '127.0.0.1', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0', Time.now.utc)
  end

  # 1 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/sign_up_welcome
  # SignUpWelcomeMailerWorker
  def sign_up_welcome
    UserMailer.sign_up_welcome(User.last)
  end

  # 2 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/promo_code_payout
  # PromoCodePayoutWorker
  def promo_code_payout
    UserMailer.promo_code_payout(User.last, PromoCode.first)
  end

  # 3 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/free_head_trip
  # FreeHeadTripMailerWorker
  def free_head_trip
    UserMailer.free_head_trip(User.last)
  end

  # 4 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/account_deleted
  # AccountDeletedMailerWorker
  def account_deleted
    UserMailer.account_deleted(User.last)
  end

  # 5 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/password_reset
  # PasswordResetMailerWorker
  def password_reset
    UserMailer.password_reset(User.last)
  end

  # 6 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/password_change
  def password_change
    UserMailer.password_change(User.last)
  end

  # 7-8 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/yowza_black_receipt
  # YowzaBlackReceiptMailerWorker
  def yowza_black_receipt
    UserMailer.yowza_black_receipt(User.last, 'Blacker')
  end

  # 9 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/one_hundred_k_followers_receipt
  # OneHundredKFollowersReceiptMailerWorker
  def one_hundred_k_followers_receipt
    UserMailer.one_hundred_k_followers_receipt(User.last)
  end

  # 10 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/one_million_likes_receipt
  # OneMillionLikesMailerWorker
  def one_million_likes_receipt
    UserMailer.one_million_likes_receipt(user: Status.last.account.user, status: Status.last)
  end

  # 11 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/celeb_follow
  # BotFollowMailerWorker
  def celeb_follow
    UserMailer.celeb_follow(user: User.last, purchased_follower: User.first)
  end

  # 12-14 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/nth_black_check
  # NthCheckMailerWorker
  def nth_black_check
    UserMailer.nth_black_check(user: User.last, checks_count: 3)
  end

  # 14 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/ringtone
  # RingtoneMailerWorker
  def ringtone
    UserMailer.ringtone(user: User.last)
  end

  # 15 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/yowzacoin
  # YowzaCoinMailerWorker
  def yowzacoin
    UserMailer.yowzacoin(user: User.last)
  end

  # 16 - Preview this email at # http://localhost:3000/rails/mailers/user_mailer/shazam
  # ShazamMailerWorker
  def shazam
    UserMailer.shazam(user: User.last)
  end
end
