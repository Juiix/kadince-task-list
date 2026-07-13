# frozen_string_literal: true

module Mutations
  class UpdateProject < BaseMutation
    description "Update a project's attributes, including toggling completion"

    argument :id, ID, required: true
    argument :name, String, required: false
    argument :color, String, required: false
    argument :completed, Boolean, required: false

    field :project, Types::ProjectType
    field :errors, [ String ], null: false

    def resolve(id:, **attributes)
      project = Project.find_by(id: id)
      return { project: nil, errors: [ "Project not found" ] } unless project

      if attributes.key?(:completed)
        completed = attributes.delete(:completed)
        attributes[:completed_at] = completed ? (project.completed_at || Time.current) : nil
      end

      if project.update(attributes)
        { project: project, errors: [] }
      else
        { project: nil, errors: project.errors.full_messages }
      end
    end
  end
end
