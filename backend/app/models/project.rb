class Project < ApplicationRecord
  validates :name, presence: true, length: { maximum: 255 }
  validates :color, presence: true, format: { with: /\A\h{6}\z/, message: "must be a valid 6-digit hex value" }

  has_many :tasks, dependent: :destroy

  scope :active, -> { where(completed_at: nil).order(name: :asc) }
  scope :completed, -> { where.not(completed_at: nil).order(completed_at: :desc) }

  def completed?
    completed_at.present?
  end
end
