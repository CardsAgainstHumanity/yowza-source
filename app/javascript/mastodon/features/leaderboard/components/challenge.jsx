import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

const messages = defineMessages({
  countdown: { id: 'challenge.countdown', defaultMessage: 'This challenge<br /> begins in {timeUntilStart}' },
  remaining: { id: 'challenge.remaining', defaultMessage: '{timeRemaining} remaining!' },
  winner: { id: 'challenge.winner', defaultMessage: 'Winner:' },
  viewResults: { id: 'challenge.viewResults', defaultMessage: 'View Results' },
});

class Challenge extends PureComponent {
  static propTypes = {
    challenge: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    onToggleResultsClick: PropTypes.func.isRequired,
    resultsToggled: PropTypes.bool.isRequired,
  };

  state = {
    startDate: new Date(this.challenge.starts_at),
    endDate: new Date(this.challenge.ends_at),
    countdown: null,
  };

  constructor(props, context) {
    super(props, context);
    this.handleToggleResultsClick = this.handleToggleResultsClick.bind(this);
  }

  get challenge() {
    return this.props.challenge;
  }

  challengeFinished() {
    return this.challenge.finished;
  }

  challengeInProgress() {
    return this.challenge.started && !this.challenge.finished;
  }

  challengeWinner() {
    return this.challenge.results[0][0];
  }

  challengeTimeRange() {
    const startHour = this.state.startDate.getHours() % 12;
    const endHour = (this.state.endDate.getHours() + 1) % 12;
    const startMin = this.state.startDate.getMinutes();
    const endMin = this.state.endDate.getMinutes();

    return `${startHour === 0 ? 12 : startHour}:${startMin.toString().padStart(2, '0')} - ${endHour === 0 ? 12 : endHour}:${endMin === 59 ? '00' : endMin.toString().padStart(2, '0')}`;
  }

  setNewTimeRemaining(comparisonDate) {
    const currentTime = new Date();
    const millisRemaining = comparisonDate - currentTime;

    if (millisRemaining < 0) {
      this.setState({
        countdown: null
      });
      return;
    }

    // let days = Math.floor(millisRemaining / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (millisRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    let minutes = Math.floor(
      (millisRemaining % (1000 * 60 * 60)) / (1000 * 60),
    );
    let seconds = Math.floor((millisRemaining % (1000 * 60)) / 1000);

    const numbersToAddZeroTo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    // days = `${days}`;
    if (numbersToAddZeroTo.includes(hours)) {
      hours = `0${hours}`;
    }
    if (numbersToAddZeroTo.includes(minutes)) {
      minutes = `0${minutes}`;
    }
    if (numbersToAddZeroTo.includes(seconds)) {
      seconds = `0${seconds}`;
    }

    this.setState({
      countdown: `${hours}:${minutes}:${seconds}`
    });
  }


  componentDidMount() {
    if (this.challengeInProgress()) {
      this.setNewTimeRemaining(this.state.endDate);
      setInterval(() => this.setNewTimeRemaining(this.state.endDate), 1000);
    } else if(!this.challengeFinished()) {
      this.setNewTimeRemaining(this.state.endDate);
      setInterval(() => this.setNewTimeRemaining(this.state.startDate), 1000);
    }
  }

  handleToggleResultsClick() {
    this.props.onToggleResultsClick(this.challenge.id);
  }

  render() {
    return (
      <div className={classNames('challenge', {'challenge--resultsVisible': this.challengeInProgress() || this.props.resultsToggled})}>
        <div className='challenge-contents'>
          <div className='challenge-details'>
            { this.challengeFinished() && (
              <div className='challenge__countdown-tag-container'>
                <div className='challenge-complete' onClick={this.handleToggleResultsClick}>
                  <svg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <rect width='25' height='25' fill='black' />
                    <path d='M17.0658 7.42285L9.96763 14.5211L6.89267 11.4461L4.99609 13.3427L9.96763 18.3142L18.9624 9.31943L17.0658 7.42285Z' fill='#FF5E5E' />
                  </svg>
                  <span>Challenge Complete</span>
                </div>
              </div>
            )}
            { (this.props.resultsToggled || this.challengeFinished() || this.challengeInProgress()) && <div className='challenge-complete-spacer' /> }

            { this.challengeInProgress() && this.state.countdown && (<div className='challenge__countdown-tag-container'>
              <div className='challenge__countdown-tag'>
                <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'>
                  <path d='M7.54167 8.08341V4.83341H6.45833V8.08341H7.54167Z' fill='black' />
                  <path fillRule='evenodd' clipRule='evenodd' d='M6.45833 2.6965V2.12508H5.91667V1.04175H8.08333V2.12508H7.54167V2.6965C8.48173 2.80042 9.34123 3.17163 10.0425 3.73246L10.9495 2.82148L11.7172 3.58583L10.8086 4.49841C11.4759 5.33246 11.875 6.3905 11.875 7.54175C11.875 10.2341 9.69239 12.4167 7 12.4167C4.30761 12.4167 2.125 10.2341 2.125 7.54175C2.125 5.03245 4.02086 2.96595 6.45833 2.6965ZM7 11.3334C9.09408 11.3334 10.7917 9.63583 10.7917 7.54175C10.7917 5.44767 9.09408 3.75008 7 3.75008C4.90592 3.75008 3.20833 5.44767 3.20833 7.54175C3.20833 9.63583 4.90592 11.3334 7 11.3334Z' fill='black' />
                </svg>
                <span>{this.props.intl.formatMessage(messages.remaining, { timeRemaining: this.state.countdown} )}</span>
              </div>
            </div>) }
            
            { !this.challengeFinished() && !this.challengeInProgress() &&
              <span className='challenge-time'>{this.challengeTimeRange()}</span>
            }
            <h1>{this.challenge.title}</h1>
            <p>{this.challenge.description}</p>
          </div>

          { this.challengeFinished() && !!this.challenge.results && (
            <div className='final-results'>
                <div className='final-results__title'>{this.props.intl.formatMessage(messages.winner)}</div>
                <NavLink className='final-results__winner' exact to={`/@${this.challengeWinner()}`}>@{this.challengeWinner()}</NavLink>
                <span onClick={this.handleToggleResultsClick} className='final-results__show'>{this.props.intl.formatMessage(messages.viewResults)}</span>
              </div>
          )}

          { (this.challengeInProgress() || this.props.resultsToggled) && (
            <div className='challenge-results'>
                { this.challenge.results.map((result, index) => {
                  return (<div key={index} className='challenge-result'>
                      <div className='number'>{index + 1}</div>
                      <div className='username'><NavLink exact to={`/@${result[0]}`}>@{result[0]}</NavLink></div>
                      <div className='yowza-link'>
                          <span>(</span>
                          <NavLink exact to={`/@${result[0]}${result[2] ? ('/'+result[2]) : ''}`}>View</NavLink>
                          <span>)</span>
                      </div>
                      <div className='dots' />
                      <div className='result-descriptor'>{this.props.intl.formatNumber(result[1])} {this.challenge.result_descriptor}</div>
                    </div>)
                })}
              </div>
          )}

          {/*TODO: this.challenge.title !== 'To be revealed!' && */}
          { !this.challenge.started && this.state.countdown && (
            <div className='challenge-countdown'>
              <div>{this.props.intl.formatMessage(messages.countdown)}</div>
              <time>{this.state.countdown}</time>
            </div>
          )}
          </div>
      </div>
    );
  }
}

export default injectIntl(Challenge);
