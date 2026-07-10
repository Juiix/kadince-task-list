# Be sure to restart your server when you modify this file.

# Allow the React frontend to call this API from a different origin.
# In development that's the Vite dev server; in production set
# FRONTEND_ORIGIN to the deployed frontend's URL.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("FRONTEND_ORIGIN", "http://localhost:5173")

    resource "/graphql",
      headers: :any,
      methods: [ :post, :options ]
  end
end
