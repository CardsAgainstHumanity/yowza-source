# frozen_string_literal: true

class ChangeReferralCodesToPromoCodes < ActiveRecord::Migration[7.0]
  def change
    safety_assured do
      rename_table :referral_codes, :promo_codes
    end
  end
end
