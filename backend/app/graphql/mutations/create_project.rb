# frozen_string_literal: true

module Mutations
  class CreateProject < BaseMutation
    description "Create a new project"

    argument :name, String, required: true
    argument :color, String, required: true

    field :project, Types::ProjectType
    field :errors, [ String ], null: false

    def resolve(name:, color:)
      project = Project.new(name: name, color: color)

      if project.save
        { project: project, errors: [] }
      else
        { project: nil, errors: project.errors.full_messages }
      end
    end
  end
end
