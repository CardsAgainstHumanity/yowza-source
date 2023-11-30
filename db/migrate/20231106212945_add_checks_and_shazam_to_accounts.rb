# frozen_string_literal: true

class AddChecksAndShazamToAccounts < ActiveRecord::Migration[7.0]
  def change
    safety_assured do
      add_column :accounts, :purchased_checks, :integer, default: 0
      add_column :accounts, :shazam, :boolean, default: false, null: false
    end
  end
end
