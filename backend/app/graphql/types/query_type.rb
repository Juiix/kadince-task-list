# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Tasks
    # -----------------------
    field :tasks, [ Types::TaskType ], null: false,
      description: "Tasks ordered for display: pending before completed, soonest due date first" do
      argument :filter, Types::TaskFilterType, required: false, default_value: :all
    end

    def tasks(filter:)
      case filter
      when :pending then Task.pending.by_due_date
      when :completed then Task.completed.order(updated_at: :desc)
      else Task.pending_first.by_due_date
      end
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
