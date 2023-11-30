# frozen_string_literal: true

class AddWinnerToAccounts < ActiveRecord::Migration[7.0]
  def change
    safety_assured { add_column :accounts, :winner, :boolean, null: false, default: false }
  end
end
