# frozen_string_literal: true

module Mutations
  class DeleteTask < BaseMutation
    description "Delete a task"

    argument :id, ID, required: true

    field :id, ID, description: "ID of the deleted task"
    field :errors, [ String ], null: false

    def resolve(id:)
      task = Task.find_by(id: id)
      return { id: nil, errors: [ "Task not found" ] } unless task

      task.destroy
      { id: id, errors: [] }
    end
  end
end
