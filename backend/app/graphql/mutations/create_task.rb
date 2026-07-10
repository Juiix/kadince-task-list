# frozen_string_literal: true

module Mutations
  class CreateTask < BaseMutation
    description "Create a new task"

    argument :title, String, required: true
    argument :description, String, required: false

    field :task, Types::TaskType
    field :errors, [ String ], null: false

    def resolve(title:, description: nil)
      task = Task.new(title: title, description: description)

      if task.save
        { task: task, errors: [] }
      else
        { task: nil, errors: task.errors.full_messages }
      end
    end
  end
end
