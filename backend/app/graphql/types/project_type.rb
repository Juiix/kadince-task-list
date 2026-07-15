# frozen_string_literal: true

module Types
  class ProjectType < Types::BaseObject
    description "A group of tasks to achieve a goal"

    field :id, ID, null: false
    field :name, String, null: false
    field :color, String, null: false
    field :completed, Boolean, null: false, method: :completed?
    field :completed_at, GraphQL::Types::ISO8601DateTime, description: "When this project was completed"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :tasks, [ Types::TaskType ], null: false,
      description: "Tasks in this project, pending before completed, soonest due date first"

    def tasks
      dataloader.with(Sources::ProjectTasks).load(object.id)
    end
  end
end
