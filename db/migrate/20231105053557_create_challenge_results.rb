# frozen_string_literal: true

class CreateChallengeResults < ActiveRecord::Migration[7.0]
  def change
    create_table :challenge_results do |t|
      t.string :result_for
      t.text :result, array: true, default: []

      t.timestamps
    end
  end
end
