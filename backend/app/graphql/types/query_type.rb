# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :tasks, [ Types::TaskType ], null: false,
      description: "All tasks, newest first, optionally filtered by status" do
      argument :filter, Types::TaskFilterType, required: false, default_value: :all
    end

    def tasks(filter:)
      scope = Task.newest_first
      case filter
      when :pending then scope.pending
      when :completed then scope.completed
      else scope
      end
    end

    field :task, Types::TaskType, description: "Find a single task by ID" do
      argument :id, ID, required: true
    end

    def task(id:)
      Task.find_by(id: id)
    end
  end
end
