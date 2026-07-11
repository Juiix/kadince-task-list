FactoryBot.define do
  factory :task do
    title { Faker::Lorem.sentence(word_count: 3) }
    description { Faker::Lorem.paragraph }
    completed { false }

    trait :completed do
      completed { true }
    end

    trait :overdue do
      due_on { 2.days.ago.to_date }
    end

    trait :due_today do
      due_on { Date.current }
    end
  end
end
