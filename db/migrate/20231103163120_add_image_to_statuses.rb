# frozen_string_literal: true

class AddImageToStatuses < ActiveRecord::Migration[7.0]
  def change
    add_column :statuses, :image, :string
  end
end
