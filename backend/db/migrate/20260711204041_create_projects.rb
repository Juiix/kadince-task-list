class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects do |t|
      t.string :name, null: false
      t.string :color, null: false
      t.datetime :completed_at, null: true

      t.timestamps
    end
  end
end
