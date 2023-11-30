# frozen_string_literal: true

class Api::V1::Accounts::FeaturedTagsController < Api::BaseController
  before_action :set_account
  before_action :set_featured_tags

  skip_before_action :require_authenticated_user!, only: :index

  respond_to :json

  def index
    render json: @featured_tags, each_serializer: REST::FeaturedTagSerializer
  end

  private

  def set_account
    @account = Account.find(params[:account_id])
  end

  def set_featured_tags
    @featured_tags = @account.suspended? ? [] : @account.featured_tags
  end
end
