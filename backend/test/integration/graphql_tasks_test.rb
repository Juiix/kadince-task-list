require "test_helper"

class GraphqlTasksTest < ActionDispatch::IntegrationTest
  def execute_graphql(query, variables: {})
    post "/graphql", params: { query: query, variables: variables }, as: :json
    assert_response :success
    response.parsed_body
  end

  # --- Queries ---

  test "tasks orders pending by due date first, completed last" do
    completed = create(:task, :completed)
    undated = create(:task)
    later = create(:task, due_on: 5.days.from_now)
    sooner = create(:task, due_on: 1.day.from_now)

    body = execute_graphql("{ tasks { id } }")

    ids = body.dig("data", "tasks").map { |t| t["id"].to_i }
    assert_equal [ sooner.id, later.id, undated.id, completed.id ], ids
  end

  test "tasks filter PENDING returns only incomplete tasks" do
    pending_task = create(:task)
    create(:task, :completed)

    body = execute_graphql("{ tasks(filter: PENDING) { id } }")

    ids = body.dig("data", "tasks").map { |t| t["id"].to_i }
    assert_equal [ pending_task.id ], ids
  end

  test "tasks filter COMPLETED returns only completed tasks" do
    create(:task)
    completed_task = create(:task, :completed)

    body = execute_graphql("{ tasks(filter: COMPLETED) { id } }")

    ids = body.dig("data", "tasks").map { |t| t["id"].to_i }
    assert_equal [ completed_task.id ], ids
  end

  test "task returns a single task by id" do
    task = create(:task, title: "Find me")

    body = execute_graphql(
      "query($id: ID!) { task(id: $id) { id title } }",
      variables: { id: task.id }
    )

    assert_equal "Find me", body.dig("data", "task", "title")
  end

  test "task returns null for an unknown id" do
    body = execute_graphql("query($id: ID!) { task(id: $id) { id } }", variables: { id: 0 })

    assert_nil body.dig("data", "task")
  end

  # --- createTask ---

  CREATE_TASK = <<~GQL
    mutation($input: CreateTaskInput!) {
      createTask(input: $input) {
        task { id title description completed }
        errors
      }
    }
  GQL

  test "createTask creates a task and returns it" do
    assert_difference("Task.count", 1) do
      body = execute_graphql(CREATE_TASK, variables: { input: { title: "Write tests", description: "Backend first" } })

      payload = body.dig("data", "createTask")
      assert_empty payload["errors"]
      assert_equal "Write tests", payload.dig("task", "title")
      assert_equal false, payload.dig("task", "completed")
    end
  end

  test "createTask accepts a due date" do
    body = execute_graphql(
      "mutation($input: CreateTaskInput!) { createTask(input: $input) { task { id dueOn } errors } }",
      variables: { input: { title: "Dated task", dueOn: "2026-07-15" } }
    )

    assert_equal "2026-07-15", body.dig("data", "createTask", "task", "dueOn")
  end

  test "updateTask can set and clear the due date" do
    task = create(:task, due_on: Date.current)

    body = execute_graphql(
      "mutation($input: UpdateTaskInput!) { updateTask(input: $input) { task { dueOn } errors } }",
      variables: { input: { id: task.id, dueOn: nil } }
    )

    assert_nil body.dig("data", "updateTask", "task", "dueOn")
    assert_nil task.reload.due_on
  end

  test "createTask returns validation errors for a blank title" do
    assert_no_difference("Task.count") do
      body = execute_graphql(CREATE_TASK, variables: { input: { title: "" } })

      payload = body.dig("data", "createTask")
      assert_nil payload["task"]
      assert_includes payload["errors"], "Title can't be blank"
    end
  end

  # --- updateTask ---

  UPDATE_TASK = <<~GQL
    mutation($input: UpdateTaskInput!) {
      updateTask(input: $input) {
        task { id title completed }
        errors
      }
    }
  GQL

  test "updateTask can rename and complete a task" do
    task = create(:task, title: "Old name")

    body = execute_graphql(UPDATE_TASK, variables: { input: { id: task.id, title: "New name", completed: true } })

    payload = body.dig("data", "updateTask")
    assert_empty payload["errors"]
    assert_equal "New name", payload.dig("task", "title")
    assert_equal true, payload.dig("task", "completed")
    assert task.reload.completed
  end

  test "updateTask returns validation errors for a blank title" do
    task = create(:task, title: "Keep me")

    body = execute_graphql(UPDATE_TASK, variables: { input: { id: task.id, title: "" } })

    payload = body.dig("data", "updateTask")
    assert_includes payload["errors"], "Title can't be blank"
    assert_equal "Keep me", task.reload.title
  end

  test "updateTask returns an error for an unknown id" do
    body = execute_graphql(UPDATE_TASK, variables: { input: { id: 0, completed: true } })

    assert_includes body.dig("data", "updateTask", "errors"), "Task not found"
  end

  # --- deleteTask ---

  DELETE_TASK = <<~GQL
    mutation($input: DeleteTaskInput!) {
      deleteTask(input: $input) {
        id
        errors
      }
    }
  GQL

  test "deleteTask removes the task" do
    task = create(:task)

    assert_difference("Task.count", -1) do
      body = execute_graphql(DELETE_TASK, variables: { input: { id: task.id } })

      payload = body.dig("data", "deleteTask")
      assert_empty payload["errors"]
      assert_equal task.id.to_s, payload["id"]
    end

    assert_nil Task.find_by(id: task.id)
  end

  test "deleteTask returns an error for an unknown id" do
    assert_no_difference("Task.count") do
      body = execute_graphql(DELETE_TASK, variables: { input: { id: 0 } })

      assert_includes body.dig("data", "deleteTask", "errors"), "Task not found"
    end
  end
end
