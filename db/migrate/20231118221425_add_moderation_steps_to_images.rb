# frozen_string_literal: true

class AddModerationStepsToImages < ActiveRecord::Migration[7.0]
  def up
    add_column :accounts, :avatar_moderation_attempts, :int
    change_column_default :accounts, :avatar_moderation_attempts, 0
    add_column :accounts, :header_moderation_attempts, :int
    change_column_default :accounts, :header_moderation_attempts, 0
  end

  def down
    remove_column :accounts, :avatar_moderation_attempts, :int
    remove_column :accounts, :header_moderation_attempts, :int
  end
end
