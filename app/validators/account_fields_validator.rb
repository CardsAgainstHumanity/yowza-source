# frozen_string_literal: true

class AccountFieldsValidator < ActiveModel::Validator
  def validate(account)
    extra_fields = account.fields.any? { |f| Account::DEFAULT_FIELD_NAMES.exclude?(f.name) }
    account.errors.add(:base, :invalid_field_value) if extra_fields

    account.fields.each do |f|
      mapping = Account::FIELD_INPUT_MAPPINGS[f.name.downcase.to_sym]
      collection_fields_with_invalid_value = validate_collection_field(f, mapping)

      account.errors.add(:fields, :"invalid_#{f.name.downcase}") if collection_fields_with_invalid_value
    end
  end

  private

  def validate_collection_field(field, mapping)
    return false if field.value.blank? || mapping.blank? || mapping[:collection].blank?

    mapping_values = mapping[:collection].pluck(:value)
    mapping_values.exclude?(field.value)
  end
end
