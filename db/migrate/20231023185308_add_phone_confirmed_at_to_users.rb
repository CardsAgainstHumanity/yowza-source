# frozen_string_literal: true

class AddPhoneConfirmedAtToUsers < ActiveRecord::Migration[7.0]
  def change
    safety_assured { add_column :users, :phone_confirmed_at, :boolean, null: false, default: false }
  end
end
