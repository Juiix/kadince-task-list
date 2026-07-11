# frozen_string_literal: true

module Mutations
  class UpdateTask < BaseMutation
    description "Update a task's attributes, including toggling completion"

    argument :id, ID, required: true
    argument :title, String, required: false
    argument :description, String, required: false
    argument :completed, Boolean, required: false
    argument :due_on, GraphQL::Types::ISO8601Date, required: false

    field :task, Types::TaskType
    field :errors, [ String ], null: false

    def resolve(id:, **attributes)
      task = Task.find_by(id: id)
      return { task: nil, errors: [ "Task not found" ] } unless task

      if task.update(attributes)
        { task: task, errors: [] }
      else
        { task: nil, errors: task.errors.full_messages }
      end
    end
  end
end
