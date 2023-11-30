import { PureComponent } from 'react';

import { injectIntl } from 'react-intl';

import { Markup } from 'react-render-markup';

import Column from 'mastodon/components/column';
import ColumnHeader from 'mastodon/components/column_header';
import { markupContent } from 'mastodon/features/ui/util/faq-markup';


class Faq extends PureComponent {
  render() {
    return (
      <Column>
        <ColumnHeader
          icon='question-circle'
          title={"FAQ"}
        />

        <div className='faq-container'>
          <Markup markup={markupContent} />
        </div>

      </Column>
    );
  }
}

export default injectIntl(Faq);
