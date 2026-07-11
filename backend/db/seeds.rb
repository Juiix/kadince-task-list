# Idempotent seed data for development and demos.
# Run with: bin/rails db:seed

[
  { title: "Review the Kadince take-home brief", description: "Confirm all required features are covered.", completed: true, due_on: 3.days.ago },
  { title: "Build the GraphQL API", description: "Queries, mutations, and integration tests.", completed: true, due_on: 2.days.ago },
  { title: "Send the repository link", description: "Email the repo to the hiring team.", completed: false, due_on: 2.days.ago },
  { title: "Build the React frontend", description: "Task list with filters, forms, and due dates.", completed: false, due_on: Date.current },
  { title: "Write end-to-end tests", description: "Cypress flows for create, complete, filter, and delete.", completed: false, due_on: Date.current },
  { title: "Deploy the app", description: "Publish a live URL and add it to the README.", completed: false, due_on: 2.days.from_now },
  { title: "Read the graphql-ruby guides", description: "Deepen understanding of resolvers and Dataloader.", completed: false, due_on: nil }
].each do |attrs|
  task = Task.find_or_initialize_by(title: attrs[:title])
  task.assign_attributes(
    description: attrs[:description],
    completed: attrs[:completed],
    due_on: attrs[:due_on]
  )
  task.save!
end

puts "Seeded #{Task.count} tasks."
