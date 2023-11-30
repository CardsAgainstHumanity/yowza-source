# frozen_string_literal: true

module YowzafyHelper
  PERMISSIVE_URL_REGEX = /\.(com|org|edu|gov|uk|net|ca|de|jp|fr|au|us|ru|ch|it|nl|se|no|es|mil|co|io|social|biz|icu|info|top|xyz|lol|za)\z/
  CHOICES_AND_WEIGHTS = {
    'yowza' => {
      'Yowza' => 1.15,
      'YOWZA' => 0.25,
      'yowza' => 0.19,
      'YoWzA' => 0.11,
      'Yowwwza' => 0.12,
      'Yowzaaa' => 0.14,
      'Yowzzza' => 0.09,
      'YOWWWZA' => 0.05,
      'yyyowza' => 0.03,
      'YOWZAAA' => 0.05,
      'YYYOWZA' => 0.04,
    },
    'awooga' => {
      'Awooga' => 1.00,
      'AWOOGA' => 0.2,
      'awooga' => 0.16,
      'AwOoGa' => 0.1,
      'Awooooga' => 0.18,
      'AWOOOOGA' => 0.09,
      'Awwwooga' => 0.07,
    },
    'shazam' => {
      'Shazam' => 1.0,
      'SHAZAM' => 0.22,
      'shazam' => 0.09,
      'ShAzAm' => 0.08,
      'Shazzzam' => 0.26,
      'SHAZZZAM' => 0.11,
      'Shazammm' => 0.05,
    },
  }.freeze

  PUNCTUATIONS_AND_WEIGHTS = {
    '' => 0.65,
    '!' => 0.175,
    '?' => 0.0875,
    '.' => 0.0525,
    '!?' => 0.035,
  }.freeze

  # lol
  def yowzafy(string, allowed_words: ['yowza'])
    squeezed_string = string.squeeze(' ')
    string_array = squeezed_string.split.uniq
    mentions = string_array.select { |el| el.match(Account::MENTION_RE) }
    hashtags = string_array.select { |el| el.match(Tag::HASHTAG_RE) }
    uris = string_array.select { |el| el.match(PERMISSIVE_URL_REGEX) }
    text_elements = string_array - mentions - hashtags - uris
    string_array -= mentions[1..] if mentions.count > 1
    string_array -= hashtags[1..] if hashtags.count > 1
    string_array -= text_elements[1..] if text_elements.count > 1
    string_array -= uris[1..] if uris.count > 1
    final_array = string_array.map do |post_chunk|
      process_chunk(post_chunk, allowed_words: allowed_words)
    end

    final_array.unshift(yowzafy_string('', allowed_words: allowed_words)) if text_elements.empty? && hashtags.empty? && (mentions.present? || uris.present?)

    final_array.compact.join(' ')
  end

  def process_chunk(string, allowed_words: ['yowza'])
    if string.match?(PERMISSIVE_URL_REGEX)
      "https://yow.za/#{SecureRandom.hex(3)}"
    elsif string.start_with?('@')
      string if Account.find_by(username: string.split('@')[1]).present?
    elsif string.start_with?('#')
      "##{yowzafy_string(string.split('#')[1], allowed_words: allowed_words, include_punctuation: false)}"
    else
      yowzafy_string(string, allowed_words: allowed_words)
    end
  end

  def yowzafy_string(string, allowed_words: ['yowza'], include_punctuation: true)
    is_compliant = allowed_words.detect do |word|
      char_tally = string.downcase.chars.tally
      string.downcase.squeeze.delete('!').delete('?').delete('.') == word.squeeze &&
        string.downcase.delete('!').delete('?').delete('.').length <= (word.length + 2) &&
        ((char_tally['!'] || 0) + (char_tally['?'] || 0) + (char_tally['.'] || 0)) <= 2
    end
    is_compliant ? string : "#{random_allowed_word_variant(allowed_words.sample)}#{random_punctuation_variant if include_punctuation}"
  end

  def random_allowed_word_variant(allowed_word)
    choices_and_weights = CHOICES_AND_WEIGHTS[allowed_word]
    variants = choices_and_weights.keys
    weights = choices_and_weights.values
    normalized_weights = weights.map { |w| w / weights.sum }
    normalized_choices_and_weights = variants.zip(normalized_weights).to_h
    normalized_choices_and_weights.max_by { |_, weight| rand**(1.0 / weight) }.first
  end

  def random_punctuation_variant
    PUNCTUATIONS_AND_WEIGHTS.max_by { |_, weight| rand**(1.0 / weight) }.first
  end
end
