# frozen_string_literal: true

module Types
  class TaskFilterType < Types::BaseEnum
    graphql_name "TaskFilter"
    description "Filter tasks by completion status"

    value "ALL", "All tasks", value: :all
    value "PENDING", "Tasks not yet completed", value: :pending
    value "COMPLETED", "Completed tasks", value: :completed
  end
end
