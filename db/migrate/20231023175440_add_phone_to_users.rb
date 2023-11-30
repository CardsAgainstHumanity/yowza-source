# frozen_string_literal: true

class AddPhoneToUsers < ActiveRecord::Migration[7.0]
  disable_ddl_transaction!

  def change
    add_column :users, :phone, :string
    add_index :users, :phone, unique: true, algorithm: :concurrently
  end
end
