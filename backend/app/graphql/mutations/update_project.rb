# frozen_string_literal: true

module Mutations
  class UpdateProject < BaseMutation
    description "Update a project's attributes"

    argument :id, ID, required: true
    argument :name, String, required: false
    argument :color, String, required: false

    field :project, Types::ProjectType
    field :errors, [ String ], null: false

    def resolve(id:, **attributes)
      project = Project.find_by(id: id)
      return { project: nil, errors: [ "Project not found" ] } unless project

      if project.update(attributes)
        { project: project, errors: [] }
      else
        { project: nil, errors: project.errors.full_messages }
      end
    end
  end
end
