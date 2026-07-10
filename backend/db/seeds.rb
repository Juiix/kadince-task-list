# Idempotent seed data for development and demos.
# Run with: bin/rails db:seed

[
  { title: "Review the Kadince take-home brief", description: "Confirm all required features are covered.", completed: true },
  { title: "Build the GraphQL API", description: "Queries, mutations, and integration tests.", completed: true },
  { title: "Build the React frontend", description: "Task list with filters, forms, and optimistic updates.", completed: false },
  { title: "Write end-to-end tests", description: "Cypress flows for create, complete, filter, and delete.", completed: false },
  { title: "Deploy the app", description: "Publish a live URL and add it to the README.", completed: false }
].each do |attrs|
  Task.find_or_create_by!(title: attrs[:title]) do |task|
    task.description = attrs[:description]
    task.completed = attrs[:completed]
  end
end

puts "Seeded #{Task.count} tasks."
