FactoryBot.define do
  factory :project do
    name { Faker::Lorem.sentence(word_count: 3) }
    color { SecureRandom.hex(3) }

    trait :completed do
      completed_at { 1.day.ago }
    end
  end
end
