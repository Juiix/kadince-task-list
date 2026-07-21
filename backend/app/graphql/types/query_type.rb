# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Tasks
    # -----------------------
    field :tasks, [ Types::TaskType ], null: false,
      description: "Tasks ordered for display: pending before completed, soonest due date first" do
      argument :filter, Types::TaskFilterType, required: false, default_value: :all
      argument :sort, Types::TaskSortType, required: false, default_value: :duedate
    end

    def tasks(filter:, sort:)
      # ------------- filter
      if filter.present?
        scope = Task.send(filter)
      else
        scope = Task.all
      end

      # ------------- sort
      scope = case sort
      when :alphabetical then scope.order(title: :asc)
      else scope.order(due_on: :desc)
      end

      scope.includes(:project)
    end

    field :task, Types::TaskType, description: "Find a single task by ID" do
      argument :id, ID, required: true
    end

    def task(id:)
      Task.find_by(id: id)
    end

    # Projects
    # -----------------------
    field :projects, [ Types::ProjectType ], null: false,
      description: "Projects ordered for display: Active (alphabetical) followed by completed (most recent first)" do
      argument :filter, Types::ProjectFilterType, required: false, default_value: :all
    end

    def projects(filter:)
      case filter
      when :active then Project.active
      when :completed then Project.completed
      else Project.active.to_a + Project.completed.to_a
      end
    end

    field :project, Types::ProjectType, description: "Find a single project by ID" do
      argument :id, ID, required: true
    end

    def project(id:)
      Project.find_by(id: id)
    end
  end
end
