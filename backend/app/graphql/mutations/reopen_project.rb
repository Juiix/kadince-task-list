# frozen_string_literal: true

module Mutations
  class ReopenProject < BaseMutation
    description "Reopen a project, dependent tasks remain completed."

    argument :id, ID, required: true

    field :project, Types::ProjectType
    field :errors, [ String ], null: false

    def resolve(id:)
      project = Project.find_by(id: id)
      return { project: nil, errors: [ "Project not found" ] } unless project

      project.reopen!
      { project: project, errors: [] }
    end
  end
end
