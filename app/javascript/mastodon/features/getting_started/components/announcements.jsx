import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import { fromJS } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import ReactSwipeableViews from 'react-swipeable-views';

import { Avatar } from 'mastodon/components/avatar';
import { IconButton } from 'mastodon/components/icon_button';
import { RelativeTimestamp } from 'mastodon/components/relative_timestamp';
import  VerifiedYowzaBadge  from 'mastodon/components/verified_yowza_badge';
import { reduceMotion, disableSwiping } from 'mastodon/initial_state';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  previous: { id: 'lightbox.previous', defaultMessage: 'Previous' },
  next: { id: 'lightbox.next', defaultMessage: 'Next' },
});

class Content extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    announcement: ImmutablePropTypes.map.isRequired,
  };

  setRef = c => {
    this.node = c;
  };

  componentDidMount () {
    this._updateLinks();
  }

  componentDidUpdate () {
    this._updateLinks();
  }

  _updateLinks () {
    const node = this.node;

    if (!node) {
      return;
    }

    const links = node.querySelectorAll('a');

    for (var i = 0; i < links.length; ++i) {
      let link = links[i];

      if (link.classList.contains('status-link')) {
        continue;
      }

      link.classList.add('status-link');

      let mention = this.props.announcement.get('mentions').find(item => link.href === item.get('url'));

      if (mention) {
        link.addEventListener('click', this.onMentionClick.bind(this, mention), false);
        link.setAttribute('title', mention.get('acct'));
      } else if (link.textContent[0] === '#' || (link.previousSibling && link.previousSibling.textContent && link.previousSibling.textContent[link.previousSibling.textContent.length - 1] === '#')) {
        link.addEventListener('click', this.onHashtagClick.bind(this, link.text), false);
      } else {
        let status = this.props.announcement.get('statuses').find(item => link.href === item.get('url'));
        if (status) {
          link.addEventListener('click', this.onStatusClick.bind(this, status), false);
        }
        link.setAttribute('title', link.href);
        link.classList.add('unhandled-link');
      }

      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  }

  onMentionClick = (mention, e) => {
    if (this.context.router && e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.context.router.history.push(`/@${mention.get('acct')}`);
    }
  };

  onHashtagClick = (hashtag, e) => {
    hashtag = hashtag.replace(/^#/, '');

    if (this.context.router && e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.context.router.history.push(`/tags/${hashtag}`);
    }
  };

  onStatusClick = (status, e) => {
    if (this.context.router && e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.context.router.history.push(`/@${status.getIn(['account', 'acct'])}/${status.get('id')}`);
    }
  };

  render () {
    const { announcement } = this.props;

    return (
      <div
        className='announcements__item__content translate'
        ref={this.setRef}
        dangerouslySetInnerHTML={{ __html: announcement.get('contentHtml') }}
      />
    );
  }

}

class Announcement extends ImmutablePureComponent {

  static propTypes = {
    announcement: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    selected: PropTypes.bool,
  };

  state = {
    unread: !this.props.announcement.get('read'),
  };

  componentDidUpdate () {
    const { selected, announcement } = this.props;
    if (!selected && this.state.unread !== !announcement.get('read')) {
      this.setState({ unread: !announcement.get('read') });
    }
  }

  yowzaAccount() {
    return fromJS({
      avatar: '/avatars/original/yowza.png',
      acct: 'yowza'
    });
  }

  render () {
    const { announcement } = this.props;
    // const { unread } = this.state;

    return (
      <div className='announcements__item'>
        <Avatar account={this.yowzaAccount()} size={46} />
        <div>
          <div className='announcements__item__range'>
            <a href='/@yowza' className='name'>Yowza</a>
            <VerifiedYowzaBadge
              badgeClass={'yowza-official-badge'}
            />
            <span><a href='/@yowza'>@yowza</a></span>
            <span className='timestamp'>·</span>
            <span className='timestamp'><RelativeTimestamp timestamp={announcement.get('published_at')} /></span>
          </div>

          <Content announcement={announcement} />
        </div>
      </div>
    );
  }

}

class Announcements extends ImmutablePureComponent {

  static propTypes = {
    announcements: ImmutablePropTypes.list,
    dismissAnnouncement: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    index: 0,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.announcements.size > 0 && state.index >= props.announcements.size) {
      return { index: props.announcements.size - 1 };
    } else {
      return null;
    }
  }

  componentDidMount () {
    this._markAnnouncementAsRead();
  }

  componentDidUpdate (prevProps) {
    if(prevProps.announcements.size !== this.props.announcements.size) {
      this.setState({ index: 0});
    }
    this._markAnnouncementAsRead();
  }

  _markAnnouncementAsRead () {
    const { dismissAnnouncement, announcements } = this.props;
    const { index } = this.state;
    const announcement = announcements.get(announcements.size - 1 - index);
    if (!announcement.get('read')) dismissAnnouncement(announcement.get('id'));
  }

  handleChangeIndex = index => {
    this.setState({ index: index % this.props.announcements.size });
  };

  handleNextClick = () => {
    this.setState({ index: (this.state.index + 1) % this.props.announcements.size });
  };

  handlePrevClick = () => {
    this.setState({ index: (this.props.announcements.size + this.state.index - 1) % this.props.announcements.size });
  };

  render () {
    const { announcements, intl } = this.props;
    const { index } = this.state;

    if (announcements.isEmpty()) {
      return null;
    }

    return (
      <div className='announcements'>
        <div className='announcements__container'>
          <ReactSwipeableViews animateHeight animateTransitions={!reduceMotion} index={index} onChangeIndex={this.handleChangeIndex}>
            {announcements.map((announcement, idx) => (
              <Announcement
                key={announcement.get('id')}
                announcement={announcement}
                intl={intl}
                selected={index === idx}
                disabled={disableSwiping}
              />
            )).reverse()}
          </ReactSwipeableViews>

          {announcements.size > 1 && (
            <div className='announcements__pagination'>
              <IconButton disabled={announcements.size === 1} title={intl.formatMessage(messages.previous)} icon='chevron-left' onClick={this.handlePrevClick} size={13} />
              <span>{index + 1} / {announcements.size}</span>
              <IconButton disabled={announcements.size === 1} title={intl.formatMessage(messages.next)} icon='chevron-right' onClick={this.handleNextClick} size={13} />
            </div>
          )}
        </div>
      </div>
    );
  }

}

export default injectIntl(Announcements);
