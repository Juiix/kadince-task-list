# frozen_string_literal: true

module Types
  class ProjectFilterType < Types::BaseEnum
    graphql_name "ProjectFilter"
    description "Filter projects by completion status"

    value "ALL", "All projects", value: :all
    value "ACTIVE", "Projects currently active", value: :active
    value "COMPLETED", "Completed projects", value: :completed
  end
end
