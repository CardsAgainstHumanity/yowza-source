# frozen_string_literal: true

class AddCosmeticFollowersCountToAccounts < ActiveRecord::Migration[7.0]
  def change
    safety_assured { add_column :accounts, :cosmetic_followers_count, :integer, default: 0 }
  end
end
