import { PureComponent } from 'react';

import Column from '../../components/column';

class YowzaAppStore extends PureComponent {
  setColumnRef = c => {
    this.column = c;
  };

  render () {
    return (
      <Column bindToDocument ref={this.setColumnRef} label={'Yowza Store'}>
        <div className='yowza-store'>
          {/* <ColumnHeader
            icon='store'
            active={false}
            title={this.props.intl.formatMessage(messages.storeTitle)}
            onClick={this.handleHeaderClick}
            multiColumn={false}
          /> */}

          <div className='copy-box'>
            <h1>Yowza!</h1>
            <p>You can&apos;t view the <strong>Official Yowza Store</strong> in the app. Visit us on the web to become the social media influencer you were born to be. 😎</p>
          </div>
        </div>
      </Column>
    );
  }
}

export default YowzaAppStore;
