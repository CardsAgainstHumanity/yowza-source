# frozen_string_literal: true

class CreateReferralCodes < ActiveRecord::Migration[7.0]
  def change
    create_table :referral_codes do |t|
      t.string :code
      t.boolean :used, null: false, default: false

      t.timestamps
    end
  end
end
