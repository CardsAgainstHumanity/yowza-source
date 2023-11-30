# frozen_string_literal: true

class AddUserIdToPromoCodes < ActiveRecord::Migration[7.0]
  def change
    safety_assured do
      add_reference :promo_codes, :user, foreign_key: true
    end
  end
end
