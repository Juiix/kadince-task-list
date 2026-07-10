require "test_helper"

class TaskTest < ActiveSupport::TestCase
  test "is valid with just a title" do
    task = Task.new(title: "Buy groceries")
    assert task.valid?
  end

  test "is invalid without a title" do
    task = Task.new(title: nil)
    assert_not task.valid?
    assert_includes task.errors[:title], "can't be blank"
  end

  test "is invalid with a title longer than 255 characters" do
    task = Task.new(title: "a" * 256)
    assert_not task.valid?
  end

  test "defaults completed to false" do
    task = create(:task)
    assert_equal false, task.completed
  end

  test ".pending returns only incomplete tasks" do
    pending_task = create(:task)
    create(:task, :completed)

    assert_equal [ pending_task ], Task.pending.to_a
  end

  test ".completed returns only completed tasks" do
    create(:task)
    completed_task = create(:task, :completed)

    assert_equal [ completed_task ], Task.completed.to_a
  end

  test ".newest_first orders by creation time descending" do
    older = create(:task, created_at: 2.days.ago)
    newer = create(:task)

    assert_equal [ newer, older ], Task.newest_first.to_a
  end
end
