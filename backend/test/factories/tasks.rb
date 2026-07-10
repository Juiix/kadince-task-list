FactoryBot.define do
  factory :task do
    title { Faker::Lorem.sentence(word_count: 3) }
    description { Faker::Lorem.paragraph }
    completed { false }

    trait :completed do
      completed { true }
    end
  end
end
