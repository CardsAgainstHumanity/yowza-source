# frozen_string_literal: true

class ModerateImageWorker
  include Sidekiq::Worker

  def perform(account_id, image_field)
    return true unless Rails.env.production?

    account = Account.find(account_id)
    uri = URI('https://api.sightengine.com/1.0/check-workflow.json')

    params = {
      url: account.send(image_field).url,
      workflow: ENV.fetch('SIGHTENGINE_IMAGE_WORKFLOW', nil),
      api_user: ENV.fetch('SIGHTENGINE_API_KEY', nil),
      api_secret: ENV.fetch('SIGHTENGINE_API_SECRET', nil),
    }

    uri.query = URI.encode_www_form(params)
    res = Net::HTTP.get_response(uri)

    return unless res.is_a?(Net::HTTPSuccess)

    parsed_result = JSON.parse(res.body)

    if parsed_result.dig('summary', 'action') == 'accept'
      account.update("#{image_field}_passed_moderation" => true)
    else
      current_attempts = account.send("#{image_field}_moderation_attempts") || 0
      incremented_attempts = current_attempts + 1
      account.update("#{image_field}_moderation_attempts" => incremented_attempts, image_field => nil)
    end
  end
end
