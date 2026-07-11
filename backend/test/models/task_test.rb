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

  test ".overdue returns only incomplete tasks due before today" do
    overdue = create(:task, :overdue)
    create(:task, :overdue, :completed)
    create(:task, :due_today)
    create(:task)

    assert_equal [ overdue ], Task.overdue.to_a
  end

  test ".due_today returns tasks due today regardless of completion" do
    due_today = create(:task, :due_today)
    done_today = create(:task, :due_today, :completed)
    create(:task, :overdue)

    assert_equal [ due_today, done_today ].map(&:id).sort, Task.due_today.pluck(:id).sort
  end

  test ".newest_first orders by creation time descending" do
    older = create(:task, created_at: 2.days.ago)
    newer = create(:task)

    assert_equal [ newer, older ], Task.newest_first.to_a
  end

  test ".by_due_date orders soonest first with undated tasks last" do
    undated = create(:task)
    later = create(:task, due_on: 5.days.from_now)
    sooner = create(:task, due_on: 1.day.from_now)

    assert_equal [ sooner, later, undated ], Task.by_due_date.to_a
  end

  test ".pending_first orders incomplete tasks before completed ones" do
    completed = create(:task, :completed)
    pending_task = create(:task)

    assert_equal [ pending_task, completed ], Task.pending_first.to_a
  end
end
