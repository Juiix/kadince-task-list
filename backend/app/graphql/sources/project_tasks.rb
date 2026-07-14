module Sources
  class ProjectTasks < GraphQL::Dataloader::Source
    def fetch(project_ids)
      grouped = Task.where(project_id: project_ids)
                    .pending_first.by_due_date
                    .group_by(&:project_id)
      project_ids.map { |id| grouped[id] || [] }
    end
  end
end
