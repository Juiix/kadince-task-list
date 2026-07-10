class Task < ApplicationRecord
  validates :title, presence: true, length: { maximum: 255 }

  scope :pending, -> { where(completed: false) }
  scope :completed, -> { where(completed: true) }
  scope :newest_first, -> { order(created_at: :desc) }
end
