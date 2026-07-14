# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_task, mutation: Mutations::CreateTask
    field :update_task, mutation: Mutations::UpdateTask
    field :delete_task, mutation: Mutations::DeleteTask

    field :create_project, mutation: Mutations::CreateProject
    field :update_project, mutation: Mutations::UpdateProject
    field :delete_project, mutation: Mutations::DeleteProject
    field :complete_project, mutation: Mutations::CompleteProject
    field :reopen_project, mutation: Mutations::ReopenProject
  end
end
