# frozen_string_literal: true

class AddCountedAsReferralToAccountStats < ActiveRecord::Migration[7.0]
  def change
    safety_assured do
      add_column :account_stats, :counted_as_referral, :boolean, null: false, default: false
    end
  end
end
