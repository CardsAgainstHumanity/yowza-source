# frozen_string_literal: true

# == Schema Information
#
# Table name: promo_codes
#
#  id         :bigint(8)        not null, primary key
#  code       :string
#  used       :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint(8)
#
class PromoCode < ApplicationRecord
  belongs_to :user, optional: true

  scope :unused, -> { where(used: false) }
end
