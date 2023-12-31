# frozen_string_literal: true

class UpdateAccountService < BaseService
  def call(account, params, raise_error: false)
    was_locked    = account.locked
    update_method = raise_error ? :update! : :update

    params = params.except(:display_name) if account.display_name.include?('NaughtyYowzer')
    params = params.except(:avatar) if account.avatar? || (account.avatar_moderation_attempts.present? && account.avatar_moderation_attempts >= 3)
    params = params.except(:header) if account.header? || (account.header_moderation_attempts.present? && account.header_moderation_attempts >= 3)
    account.send(update_method, params).tap do |ret|
      next unless ret

      authorize_all_follow_requests(account) if was_locked && !account.locked
      check_links(account)
      process_hashtags(account)
    end
  rescue Mastodon::DimensionsValidationError, Mastodon::StreamValidationError => e
    account.errors.add(:avatar, e.message)
    false
  end

  private

  def authorize_all_follow_requests(account)
    follow_requests = FollowRequest.where(target_account: account)
    follow_requests = follow_requests.preload(:account).select { |req| !req.account.silenced? }
    AuthorizeFollowWorker.push_bulk(follow_requests, limit: 1_000) do |req|
      [req.account_id, req.target_account_id]
    end
  end

  def check_links(account)
    VerifyAccountLinksWorker.perform_async(account.id) if account.fields.any?(&:requires_verification?)
  end

  def process_hashtags(account)
    account.tags_as_strings = Extractor.extract_hashtags(account.note)
  end
end
