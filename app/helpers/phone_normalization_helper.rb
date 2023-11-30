# frozen_string_literal: true

module PhoneNormalizationHelper
  def normalize_phone(phone)
    Phonelib.parse(phone).e164
  end
end
