ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors) if ENV["CI"] # parallelize hangs on local mac

    # Allows `create(:task)` instead of `FactoryBot.create(:task)` in tests.
    include FactoryBot::Syntax::Methods
  end
end

module GraphqlTestHelper
  def execute_graphql(query, variables: {})
    post "/graphql", params: { query: query, variables: variables }, as: :json
    assert_response :success
    response.parsed_body
  end
end
