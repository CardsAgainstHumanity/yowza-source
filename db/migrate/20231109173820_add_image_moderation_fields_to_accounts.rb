# frozen_string_literal: true

class AddImageModerationFieldsToAccounts < ActiveRecord::Migration[7.0]
  def change
    safety_assured do
      add_column :accounts, :avatar_passed_moderation, :boolean, null: false, default: false
      add_column :accounts, :header_passed_moderation, :boolean, null: false, default: false
    end
  end
end
