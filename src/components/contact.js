import React, { Component } from 'react';
import globalStyles from '../assets/styles/globals.scss';
import localStyles from './styles/contact.scss';
import Popover from 'react-popover'

//assets
import skyline from '../assets/images/skyline.svg';
import tower from '../assets/images/tower.svg';
import team from '../assets/images/teamblue.png';

const styles = Object.assign({}, localStyles, globalStyles);
export default class Contact extends Component {

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      subject: '',
      message: '',
      error: '',
      open: false,
      spinnerClass: 'fa-send',
      sent: false,
      sendText: 'Send'
    }
  }

  validateEmail () {
    const email = this.state.email
    if (!email) {
      this.setState({ open: true, error: 'Please enter your email address so that we can get back in touch with you!' })
    }
    else if (!/^.+@.+\..+$/.test(email)) {
      this.setState({ open: true, error: 'Please make sure your email address is valid. For example: hello@langa.io' })
    }
    else {
      return true
    }
  }

  validateMessage () {
    const message = this.state.message
    if (!message) {
      this.setState({ open: true, error: 'Please enter a message.' })
    }
    else if (message.length < 10) {
      this.setState({ open: true, error: 'Please provide in more detail so that we know how we can help.' })
    }
    else {
      return true
    }
  }

  closePopover () {
    this.setState({ open: false })
  }

  onSubjectChanged (e) {
    this.setState({ subject: e.target.value })
  }
  onEmailChanged (e) {
    this.setState({ email: e.target.value })
  }
  onMessageChanged (e) {
    this.setState({ message: e.target.value })
  }
  submitForm (e) {
    if (this.state.sent) {
      this.setState({ error: 'We received your message, and will get in touch shortly! Thanks.', open: true })
      return
    }

    if (!this.validateMessage()) return
    if (!this.validateEmail()) return

    this.setState({ spinnerClass: 'fa-spin fa-refresh' })

    const req = new XMLHttpRequest()
    //req.open('POST', '//api.langa.io/email', true)
    req.open('POST', '//localhost:4000/email', true)
    req.setRequestHeader('Content-Type', 'application/json')
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        const result = JSON.parse(req.responseText)
        if (result.status == 'sent') {
          this.setState({ sent: true, spinnerClass: 'fa-check', sendText: 'Sent!' })
        }
      }
      else {
        console.log(req.responseText)
        this.setState({ error: 'Oops! Our emailer is having some problems right now. Please email hello@langa.io' })
        this.setState({ sent: true, spinnerClass: 'fa-warn' })
      }
    }
    req.send(JSON.stringify({
      email: this.state.email,
      subject: this.state.subject,
      message: this.state.message
    }))
  }

  render () {
    const { sendText, spinnerClass, error, open } = this.state
      return (
        <div className={styles.Contact}>
          <div className={styles.header}>
            <h1>Contact</h1>
          </div>
          <div className={styles.main}>
              <div className={styles.flexLeft} />
              <div className={`${styles.flexMiddle}`}>
                  <div className={`${styles.contactTower}`}>
                      <form className={`${styles.form}`}>
                          <input placeholder="What's your Email Address?" onChange={e => this.onEmailChanged(e)}></input>
                          <input placeholder='Message Subject' onChange={e => this.onSubjectChanged(e)}></input>
                          <textarea
                            placeholder='How can we help?'
                            type="text"
                            onChange={e => this.onMessageChanged(e)}
                            className={`${styles.projectInfo}`}>
                          </textarea>
                          <button type="button" className={`${styles.submit}`} onClick={e => this.submitForm(e)}>
                            <i className={'fa ' + spinnerClass} />
                            {sendText}
                          </button>
                          <Popover
                            offset={8}
                            enterExitTransitionDurationMs={200}
                            refreshIntervalMs={10000}
                            className={styles.Popoverbody}
                            isOpen={open}
                            body={
                              <div>
                                {error}
                              </div>
                            }
                            onOuterAction={() => this.closePopover()}
                            place='below'>
                              <div className="target" onClick={() => this.closePopover()}>
                              </div>
                          </Popover>
                      </form>
                      <img src={tower} className={`${styles.tower}`}/>
                  </div>
                  <img src={team} className={`${styles.teamimage}`}/>
              </div>
              <div className={styles.flexLeft} />
          </div>
        </div>
      );
  }
}
