# frozen_string_literal: true

class Api::V2::InstancesController < Api::V1::InstancesController
  skip_before_action :require_authenticated_user!, only: :show
  def show
    cache_even_if_authenticated!
    render_with_cache json: InstancePresenter.new, serializer: REST::InstanceSerializer, root: 'instance'
  end
end
