# frozen_string_literal: true

class UpdatesOptInController < ApplicationController
  before_action :authenticate_user!
  before_action :set_body_classes
  before_action :set_instance_presenter

  private

  def set_instance_presenter
    @instance_presenter = InstancePresenter.new
  end

  def set_body_classes
    @body_classes = 'signup'
  end
end
