# frozen_string_literal: true

module Mutations
  class DeleteProject < BaseMutation
    description "Delete a project and its dependent tasks"

    argument :id, ID, required: true

    field :id, ID, description: "ID of the deleted project"
    field :errors, [ String ], null: false

    def resolve(id:)
      project = Project.find_by(id: id)
      return { id: nil, errors: [ "Project not found" ] } unless project

      if project.destroy
        { id: id, errors: [] }
      else
        { id: nil, errors: project.errors.full_messages }
      end
    end
  end
end
