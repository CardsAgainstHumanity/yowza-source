# frozen_string_literal: true

class CreateFeatureReleases < ActiveRecord::Migration[7.0]
  def change
    create_table :feature_releases do |t|
      t.integer :current_features, null: false, default: 0
      t.integer :singleton_guard, null: false

      t.timestamps
      t.index :singleton_guard, unique: true
    end
  end
end
