# frozen_string_literal: true

class AddPriceToAccounts < ActiveRecord::Migration[7.0]
  def change
    add_column :accounts, :price, :integer
  end
end
