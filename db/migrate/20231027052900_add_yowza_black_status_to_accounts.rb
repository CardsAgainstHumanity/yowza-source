# frozen_string_literal: true

class AddYowzaBlackStatusToAccounts < ActiveRecord::Migration[7.0]
  def change
    add_column :accounts, :yowza_black_status, :string
  end
end
