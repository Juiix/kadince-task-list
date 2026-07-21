# frozen_string_literal: true

module Types
  class TaskSortType < Types::BaseEnum
    graphql_name "TaskSort"
    description "Sort tasks by criteria"

    value "DUEDATE", "Sorted by due date, nulls last", value: :duedate
    value "ALPHABETICAL", "Sorted A-Z", value: :alphabetical
  end
end
