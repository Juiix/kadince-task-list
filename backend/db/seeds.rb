# Idempotent seed data for development and demos.
# Run with: bin/rails db:seed

projects = {}
[
  { name: "Kadince Take-home Brief", color: "3987e5", completed_at: nil },
  { name: "Build a Doghouse for Koto", color: "c98500", completed_at: nil },
  { name: "Learn the Kadince Stack", color: "199e70", completed_at: 2.days.ago }
].each do |attrs|
  project = Project.find_or_initialize_by(name: attrs[:name])
  project.assign_attributes(color: attrs[:color], completed_at: attrs[:completed_at])
  project.save!
  projects[project.name] = project
end

[
  { title: "Review the Kadince take-home brief", description: "Confirm all required features are covered.", completed: true, due_on: 3.days.ago, project: "Kadince Take-home Brief" },
  { title: "Build the GraphQL API", description: "Queries, mutations, and integration tests.", completed: true, due_on: 2.days.ago, project: "Kadince Take-home Brief" },
  { title: "Send the repository link", description: "Email the repo to the hiring team.", completed: false, due_on: 2.days.ago, project: "Kadince Take-home Brief" },
  { title: "Build the React frontend", description: "Task list with filters, forms, and due dates.", completed: false, due_on: Date.current, project: "Kadince Take-home Brief" },
  { title: "Write end-to-end tests", description: "Cypress flows for create, complete, filter, and delete.", completed: false, due_on: Date.current, project: "Kadince Take-home Brief" },
  { title: "Deploy the app", description: "Publish a live URL and add it to the README.", completed: false, due_on: 2.days.from_now, project: "Kadince Take-home Brief" },
  { title: "Research doghouse blueprints", description: "Find a design sized for a corgi with opinions.", completed: false, due_on: 3.days.from_now, project: "Build a Doghouse for Koto" },
  { title: "Purchase lumber and supplies", description: "Pressure-treated for the base, cedar for the walls.", completed: false, due_on: 5.days.from_now, project: "Build a Doghouse for Koto" },
  { title: "Set up the Rails environment", description: "Ruby, Postgres, and a working dev loop.", completed: true, due_on: 4.days.ago, project: "Learn the Kadince Stack" },
  { title: "Read the graphql-ruby guides", description: "Deepen understanding of resolvers and Dataloader.", completed: false, due_on: nil, project: nil }
].each do |attrs|
  task = Task.find_or_initialize_by(title: attrs[:title])
  task.assign_attributes(
    description: attrs[:description],
    completed: attrs[:completed],
    due_on: attrs[:due_on],
    project: projects[attrs[:project]]
  )
  task.save!
end

puts "Seeded #{Project.count} projects and #{Task.count} tasks."
