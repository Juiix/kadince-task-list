class AddProjectToTasks < ActiveRecord::Migration[8.1]
  def change
    add_reference :tasks, :project, null: true, foreign_key: { on_delete: :cascade }
  end
end
