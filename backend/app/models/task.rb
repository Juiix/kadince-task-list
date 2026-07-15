class Task < ApplicationRecord
  validates :title, presence: true, length: { maximum: 255 }
  validates :project, presence: { message: "must exist" }, if: :project_id?
  validate :pending_requires_active_project

  belongs_to :project, optional: true

  scope :pending, -> { where(completed: false) }
  scope :completed, -> { where(completed: true) }
  scope :newest_first, -> { order(created_at: :desc) }
  scope :overdue, -> { pending.where(due_on: ...Date.current) }
  scope :due_today, -> { where(due_on: Date.current) }
  scope :pending_first, -> { order(completed: :asc) }
  scope :by_due_date, -> { order(arel_table[:due_on].asc.nulls_last, created_at: :desc) }

  private

  def pending_requires_active_project
    return if completed || !project&.completed?

    errors.add(:base, "Task cannot be pending when its parent project is completed")
  end
end
