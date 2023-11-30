# frozen_string_literal: true

class AddReferralPayoutFieldsToUsers < ActiveRecord::Migration[7.0]
  def change
    safety_assured do
      add_column :users, :paid_for_referral, :boolean, null: false, default: false
      add_column :users, :paid_as_referee, :boolean, null: false, default: false
    end
  end
end
