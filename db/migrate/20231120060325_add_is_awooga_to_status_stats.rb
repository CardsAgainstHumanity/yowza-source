# frozen_string_literal: true

class AddIsAwoogaToStatusStats < ActiveRecord::Migration[7.0]
  def up
    add_column :status_stats, :is_awooga, :boolean
    change_column_default :status_stats, :is_awooga, false
  end

  def down
    remove_column :status_stats, :is_awooga, :boolean
  end
end
