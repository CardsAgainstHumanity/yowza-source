# frozen_string_literal: true

class AddReferralsToInvites < ActiveRecord::Migration[7.0]
  def change
    safety_assured do
      add_column :invites, :referrals, :integer, default: 0
    end
  end
end
