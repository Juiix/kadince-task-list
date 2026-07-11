class Task < ApplicationRecord
  validates :title, presence: true, length: { maximum: 255 }

  scope :pending, -> { where(completed: false) }
  scope :completed, -> { where(completed: true) }
  scope :newest_first, -> { order(created_at: :desc) }
  scope :overdue, -> { pending.where(due_on: ...Date.current) }
  scope :due_today, -> { where(due_on: Date.current) }
end
