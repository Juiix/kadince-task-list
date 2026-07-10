class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :description
      t.boolean :completed, null: false, default: false

      t.timestamps
    end

    add_index :tasks, :completed
  end
end
