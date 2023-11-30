# frozen_string_literal: true

module AccountAvatar
  extend ActiveSupport::Concern

  IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'].freeze
  LIMIT = 2.megabytes

  class_methods do
    def avatar_styles(file)
      styles = { original: { geometry: '400x400#', file_geometry_parser: FastGeometryParser } }
      styles[:static] = { geometry: '400x400#', format: 'png', convert_options: '-coalesce', file_geometry_parser: FastGeometryParser } if file.content_type == 'image/gif'
      styles
    end

    private :avatar_styles
  end

  included do
    # Avatar upload
    has_attached_file :avatar, styles: ->(f) { avatar_styles(f) }, convert_options: { all: '+profile "!icc,*" +set modify-date +set create-date' }, processors: [:lazy_thumbnail]
    validates_attachment_content_type :avatar, content_type: IMAGE_MIME_TYPES
    validates_attachment_size :avatar, less_than: LIMIT
    remotable_attachment :avatar, LIMIT, suppress_errors: false
    after_avatar_post_process :moderate_avatar, if: -> { Rails.env.production? }
  end

  def avatar_original_url
    if avatar? && avatar_passed_moderation?
      avatar.url(:original)
    elsif avatar_moderation_attempts.present? && avatar_moderation_attempts >= 3
      '/avatars/naughty/naughty.jpeg'
    else
      avatar.default_url
    end
  end

  def avatar_static_url
    if avatar? && avatar_passed_moderation?
      avatar_content_type == 'image/gif' ? avatar.url(:static) : avatar_original_url
    elsif avatar_moderation_attempts.present? && avatar_moderation_attempts >= 3
      '/avatars/naughty/naughty.jpeg'
    else
      avatar.default_url
    end
  end

  def moderate_avatar
    return true if bot_or_fauxbot?

    ModerateImageWorker.perform_in(rand(30..180).seconds, id, 'avatar')
  end
end
