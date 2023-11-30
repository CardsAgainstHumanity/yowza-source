# frozen_string_literal: true

class AddCosmeticFavouritesToStatuses < ActiveRecord::Migration[7.0]
  def change
    safety_assured { add_column :statuses, :cosmetic_favourites_count, :integer, default: 0 }
  end
end
