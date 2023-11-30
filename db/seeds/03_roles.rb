# frozen_string_literal: true

# Pre-create base role
UserRole.everyone
UserRole.fauxbot

# Create default roles defined in config file
default_roles = YAML.load_file(Rails.root.join('config', 'roles.yml'))

default_roles.each do |_, config|
  UserRole.create_with(position: config['position'], permissions_as_keys: config['permissions'], highlighted: true).find_or_create_by(name: config['name'])
end
