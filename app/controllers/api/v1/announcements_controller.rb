# frozen_string_literal: true

class Api::V1::AnnouncementsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write, :'write:accounts' }, only: :dismiss
  before_action :require_user!
  before_action :set_announcement, except: :index

  def index
    @announcements = Rails.cache.fetch('announcements_cache', expires_in: 90.minutes) do
      Announcement.published.chronological.to_a
    end

    render json: @announcements, each_serializer: REST::AnnouncementSerializer
  end

  def dismiss
    AnnouncementMute.find_or_create_by!(account: current_account, announcement: @announcement)
    render_empty
  end

  private

  def set_announcement
    @announcement = Announcement.published.find(params[:id])
  end
end
