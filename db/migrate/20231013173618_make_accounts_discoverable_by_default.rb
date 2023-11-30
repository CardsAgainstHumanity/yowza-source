# frozen_string_literal: true

class MakeAccountsDiscoverableByDefault < ActiveRecord::Migration[7.0]
  def change
    change_column_default :accounts, :discoverable, from: nil, to: true
  end
end
