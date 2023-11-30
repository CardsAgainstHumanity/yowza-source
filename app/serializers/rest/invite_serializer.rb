# frozen_string_literal: true

class REST::InviteSerializer < ActiveModel::Serializer
  attributes :uses, :username, :code, :id, :total_checks, :badge_class

  def username
    object.user.account.username
  end

  def uses
    object.referrals
  end

  def id
    object.user.account.id
  end

  def total_checks
    object.user.account.total_checks
  end

  def badge_class
    object.user.account.badge_class
  end
end
