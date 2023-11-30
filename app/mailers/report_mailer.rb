# frozen_string_literal: true

class ReportMailer < ApplicationMailer
  def send_report(name, file)
    attachments["#{name}_report.csv"] = file.read
    mail to: ENV.fetch('REPORT_RECIPIENT'), subject: "#{name} report attached", body: 'See attached.'
  end
end
