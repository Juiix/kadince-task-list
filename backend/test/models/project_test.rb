require "test_helper"

class ProjectTest < ActiveSupport::TestCase
  test "factory builds a valid project" do
    assert build(:project).valid?
  end

  test "is invalid without a name" do
    project = Project.new(color: "ffffff")
    assert_not project.valid?
    assert_includes project.errors[:name], "can't be blank"
  end

  test "is invalid without a color" do
    project = Project.new(name: "Build Doghouse")
    assert_not project.valid?
    assert_includes project.errors[:color], "can't be blank"
  end

  test "is invalid with a name longer than 255 characters" do
    project = Project.new(name: "a" * 256, color: "ffffff")
    assert_not project.valid?
    assert_includes project.errors[:name], "is too long (maximum is 255 characters)"
  end

  test "is invalid with invalid hex color" do
    project = Project.new(name: "Build Doghouse", color: "zzzzzz")
    assert_not project.valid?
    assert_includes project.errors[:color], "must be a valid 6-digit hex value"
  end

  test "is invalid with long hex color" do
    project = Project.new(name: "Build Doghouse", color: "f8f8f8f8")
    assert_not project.valid?
    assert_includes project.errors[:color], "must be a valid 6-digit hex value"
  end

  test "is invalid with short hex color" do
    project = Project.new(name: "Build Doghouse", color: "f8f8")
    assert_not project.valid?
    assert_includes project.errors[:color], "must be a valid 6-digit hex value"
  end

  test "defaults completed_at to nil" do
    project = create(:project)
    assert_nil project.completed_at
  end

  test ".active returns only active projects" do
    active_project = create(:project)
    create(:project, :completed)

    assert_equal [ active_project ], Project.active.to_a
  end

  test ".active returns active projects in alphabetical order" do
    train = create(:project, name: "Train Junior Developer")
    build = create(:project, name: "Build Doghouse")
    develop = create(:project, name: "Develop API Backend")

    assert_equal [ build, develop, train ], Project.active.to_a
  end

  test ".completed returns only completed projects" do
    completed_project = create(:project, :completed)
    create(:project)

    assert_equal [ completed_project ], Project.completed.to_a
  end

  test ".completed returns completed projects in desc completed_at order" do
    last_week = create(:project, :completed, completed_at: 7.days.ago)
    recently = create(:project, :completed, completed_at: 1.days.ago)
    month_ago = create(:project, :completed, completed_at: 30.days.ago)

    assert_equal [ recently, last_week, month_ago ], Project.completed.to_a
  end

  test "destroying a project destroys its tasks" do
    unrelated_task = create(:task, title: "Eat dinner")
    project = create(:project, name: "Build a Doghouse for Koto")
    create(:task, title: "Research blueprints", project: project)
    create(:task, title: "Purchase supplies", project: project)
    create(:task, title: "Build Doghouse", project: project)

    assert_difference("Task.count", -3) { project.destroy }
    assert Task.exists?(unrelated_task.id)
  end

  test "completed? is true when completed_at is set" do
    assert build(:project, :completed).completed?
  end

  test "completed? is false when completed_at is nil" do
    assert_not build(:project).completed?
  end

  test "completing a project completes its tasks" do
    unrelated_task = create(:task, title: "Eat dinner")
    project = create(:project, name: "Build a Doghouse for Koto")
    first_task = create(:task, title: "Research blueprints", project: project)
    second_task = create(:task, title: "Purchase supplies", project: project)
    third_task = create(:task, title: "Build Doghouse", project: project)

    project.complete!

    assert project.completed?
    assert first_task.reload.completed?
    assert second_task.reload.completed?
    assert third_task.reload.completed?
    assert_not unrelated_task.reload.completed?
  end

  test "completing a project twice keeps original completed_at" do
    project = create(:project, :completed, name: "Build a Doghouse for Koto")
    completed_at = project.completed_at

    project.complete!

    assert_equal completed_at, project.completed_at
  end

  test "reopening a project clears completed_at timestamp" do
    project = create(:project, :completed, name: "Build a Doghouse for Koto")

    project.reopen!

    assert_nil project.completed_at
  end

  test "reopening a project does not restore swept tasks" do
    project = create(:project, :completed, name: "Build a Doghouse for Koto")
    first_task = create(:task, :completed, title: "Research blueprints", project: project)
    second_task = create(:task, :completed, title: "Purchase supplies", project: project)
    third_task = create(:task, :completed, title: "Build Doghouse", project: project)

    project.reopen!

    assert_not project.completed?
    assert first_task.reload.completed?
    assert second_task.reload.completed?
    assert third_task.reload.completed?
  end
end
