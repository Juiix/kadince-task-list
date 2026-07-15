# frozen_string_literal: true

module Mutations
  class CompleteProject < BaseMutation
    description "Complete a project and dependent tasks."

    argument :id, ID, required: true

    field :project, Types::ProjectType
    field :errors, [ String ], null: false

    def resolve(id:)
      project = Project.find_by(id: id)
      return { project: nil, errors: [ "Project not found" ] } unless project

      project.complete!
      { project: project, errors: [] }
    end
  end
end
