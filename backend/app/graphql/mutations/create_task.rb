# frozen_string_literal: true

module Mutations
  class CreateTask < BaseMutation
    description "Create a new task"

    argument :title, String, required: true
    argument :description, String, required: false
    argument :due_on, GraphQL::Types::ISO8601Date, required: false

    field :task, Types::TaskType
    field :errors, [ String ], null: false

    def resolve(title:, description: nil, due_on: nil)
      task = Task.new(title: title, description: description, due_on: due_on)

      if task.save
        { task: task, errors: [] }
      else
        { task: nil, errors: task.errors.full_messages }
      end
    end
  end
end
