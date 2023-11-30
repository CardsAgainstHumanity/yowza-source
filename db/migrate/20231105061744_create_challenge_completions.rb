# frozen_string_literal: true

class CreateChallengeCompletions < ActiveRecord::Migration[7.0]
  def change
    create_table :challenge_completions do |t|
      t.string :completion_for
      t.boolean :processed, null: false, default: false

      t.timestamps
    end
  end
end
