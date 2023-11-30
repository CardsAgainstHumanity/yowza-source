# frozen_string_literal: true

module AccountHeader
  extend ActiveSupport::Concern

  IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'].freeze
  LIMIT = 2.megabytes
  MAX_PIXELS = 750_000 # 1500x500px

  class_methods do
    def header_styles(file)
      styles = { original: { pixels: MAX_PIXELS, file_geometry_parser: FastGeometryParser } }
      styles[:static] = { format: 'png', convert_options: '-coalesce', file_geometry_parser: FastGeometryParser } if file.content_type == 'image/gif'
      styles
    end

    private :header_styles
  end

  included do
    # Header upload
    has_attached_file :header, styles: ->(f) { header_styles(f) }, convert_options: { all: '+profile "!icc,*" +set modify-date +set create-date' }, processors: [:lazy_thumbnail]
    validates_attachment_content_type :header, content_type: IMAGE_MIME_TYPES
    validates_attachment_size :header, less_than: LIMIT
    remotable_attachment :header, LIMIT, suppress_errors: false
    after_header_post_process :moderate_header, if: -> { Rails.env.production? }
  end

  def header_original_url
    if header? && header_passed_moderation?
      header.url(:original)
    elsif header_moderation_attempts.present? && header_moderation_attempts >= 3
      '/headers/naughty/naughty.jpeg'
    else
      header.default_url
    end
  end

  def header_static_url
    if header? && header_passed_moderation?
      header_content_type == 'image/gif' ? header.url(:static) : header_original_url
    elsif header_moderation_attempts.present? && header_moderation_attempts >= 3
      '/headers/naughty/naughty.jpeg'
    else
      header.default_url
    end
  end

  def moderate_header
    return true if bot_or_fauxbot?

    ModerateImageWorker.perform_in(rand(30..180).seconds, id, 'header')
  end
end
