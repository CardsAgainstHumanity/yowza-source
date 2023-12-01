# frozen_string_literal: true

class RemoveforeignKeyFromPromocodes < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :promo_codes, :users
  end
end
