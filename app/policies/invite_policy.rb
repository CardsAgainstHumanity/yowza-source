# frozen_string_literal: true

class InvitePolicy < ApplicationPolicy
  def index?
    referrals_enabled? && role.can?(:manage_invites)
  end

  def create?
    referrals_enabled? && role.can?(:invite_users)
  end

  def deactivate_all?
    referrals_enabled? && role.can?(:manage_invites)
  end

  def destroy?
    referrals_enabled? && (owner? || role.can?(:manage_invites))
  end

  private

  def owner?
    record.user_id == current_user&.id
  end

  def referrals_enabled?
    FeatureRelease.referrals_enabled?
  end
end
