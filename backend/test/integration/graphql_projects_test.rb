require "test_helper"

class GraphqlProjectsTest < ActionDispatch::IntegrationTest
  include GraphqlTestHelper
  
  # --- Queries ---

  test "projects orders active alphabetically first, completed by done date last" do
    completed_recent = create(:project, :completed, completed_at: 1.day.ago)
    completed_first = create(:project, :completed, completed_at: 30.days.ago)

    active_t = create(:project, name: "Train Junior Developer")
    active_b = create(:project, name: "Build Doghouse")
    active_d = create(:project, name: "Develop API Backend")

    body = execute_graphql("{ projects { id } }")

    ids = body.dig("data", "projects").map { |t| t["id"].to_i }
    assert_equal [ active_b.id, active_d.id, active_t.id, completed_recent.id, completed_first.id ], ids
  end

  test "projects filter ACTIVE returns only active tasks" do
    active_project = create(:project)
    create(:project, :completed)

    body = execute_graphql("{ projects(filter: ACTIVE) { id } }")

    ids = body.dig("data", "projects").map { |t| t["id"].to_i }
    assert_equal [ active_project.id ], ids
  end

  test "projects filter COMPLETED returns only completed projects" do
    create(:project)
    completed_project = create(:project, :completed)

    body = execute_graphql("{ projects(filter: COMPLETED) { id } }")

    ids = body.dig("data", "projects").map { |t| t["id"].to_i }
    assert_equal [ completed_project.id ], ids
  end

  test "project returns a single project by id" do
    project = create(:project, name: "Find me")

    body = execute_graphql(
      "query($id: ID!) { project(id: $id) { id name } }",
      variables: { id: project.id }
    )

    assert_equal "Find me", body.dig("data", "project", "name")
  end

  test "project returns null for an unknown id" do
    body = execute_graphql("query($id: ID!) { project(id: $id) { id } }", variables: { id: 0 })

    assert_nil body.dig("data", "project")
  end

  # --- createProject ---

  CREATE_PROJECT = <<~GQL
    mutation($input: CreateProjectInput!) {
      createProject(input: $input) {
        project { id name color completed }
        errors
      }
    }
  GQL

  test "createProject creates a project and returns it" do
    assert_difference("Project.count", 1) do
      body = execute_graphql(CREATE_PROJECT, variables: { input: { name: "Write tests", color: "fafafa" } })

      payload = body.dig("data", "createProject")
      assert_empty payload["errors"]
      assert_equal "Write tests", payload.dig("project", "name")
      assert_equal false, payload.dig("project", "completed")
    end
  end

  test "createProject returns validation errors for a blank name" do
    assert_no_difference("Project.count") do
      body = execute_graphql(CREATE_PROJECT, variables: { input: { name: "" } })

      payload = body.dig("data", "createProject")
      assert_nil payload["project"]
      assert_includes payload["errors"], "Name can't be blank"
    end
  end

  # --- updateProject ---

  UPDATE_PROJECT = <<~GQL
    mutation($input: UpdateProjectInput!) {
      updateProject(input: $input) {
        project { id name color completed }
        errors
      }
    }
  GQL

  test "updateProject can rename and recolor a project" do
    project = create(:project, name: "Old name", color: "ffffff")

    body = execute_graphql(UPDATE_PROJECT, variables: { input: { id: project.id, name: "New name", color: "ff0000" } })

    payload = body.dig("data", "updateProject")
    assert_empty payload["errors"]
    assert_equal "New name", payload.dig("project", "name")
    assert_equal "ff0000", payload.dig("project", "color")
    assert_equal "ff0000", project.reload.color
  end

  test "updateProject returns validation errors for a blank name" do
    project = create(:project, name: "Keep me")

    body = execute_graphql(UPDATE_PROJECT, variables: { input: { id: project.id, name: "" } })

    payload = body.dig("data", "updateProject")
    assert_includes payload["errors"], "Name can't be blank"
    assert_equal "Keep me", project.reload.name
  end

  test "updateProject returns an error for an unknown id" do
    body = execute_graphql(UPDATE_PROJECT, variables: { input: { id: 0, color: "ff0000" } })

    assert_includes body.dig("data", "updateProject", "errors"), "Project not found"
  end

  # --- deleteProject ---

  DELETE_PROJECT = <<~GQL
    mutation($input: DeleteProjectInput!) {
      deleteProject(input: $input) {
        id
        errors
      }
    }
  GQL

  test "deleteProject removes the project and dependent tasks" do
    project = create(:project)
    task_1 = create(:task, project: project)
    task_2 = create(:task, project: project)
    standalone = create(:task)

    assert_difference("Project.count" => -1, "Task.count" => -2) do
      body = execute_graphql(DELETE_PROJECT, variables: { input: { id: project.id } })

      payload = body.dig("data", "deleteProject")
      assert_empty payload["errors"]
      assert_equal project.id.to_s, payload["id"]
    end

    assert_nil Project.find_by(id: project.id)
    assert_nil Task.find_by(id: task_1.id)
    assert_nil Task.find_by(id: task_2.id)
    assert Task.exists?(standalone.id)
  end

  test "deleteProject returns an error for an unknown id" do
    assert_no_difference("Project.count") do
      body = execute_graphql(DELETE_PROJECT, variables: { input: { id: 0 } })

      assert_includes body.dig("data", "deleteProject", "errors"), "Project not found"
    end
  end
end
