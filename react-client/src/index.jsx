import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toEmail: '',
      fromEmail: '',
      subject: '',
      content: '',
      errorBoolean: false
    };

    this.sendEmail = this.sendEmail.bind(this);
  }

  sendEmail() {
    //There are other validations I could add, however this is the most basic front-end validation
    if(typeof this.state.content !== 'string' || typeof this.state.subject !== 'string' || typeof this.state.toEmail !== 'string' || typeof this.state.fromEmail !== 'string' || this.state.toEmail.indexOf('@') === -1 || this.state.fromEmail.indexOf('@') === -1 || typeof this.state.toEmail !== 'string' || typeof this.state.fromEmail !== 'string' || this.state.toEmail.indexOf('.') === -1 || this.state.fromEmail.indexOf('.') === -1) {
      this.setState({errorBoolean: true})
    } else {
      this.setState({errorBoolean: false})
      axios.post('/send', {toEmail: this.state.toEmail,
        fromEmail: this.state.fromEmail,
        subject: this.state.subject,
        content: this.state.content})
        .then(result => console.log(result))
        .catch(error => console.log('Error! inside send', error))
    }
  }
  
  render () {
    return (
      <div>
        <h1>Email Information</h1>
        <input onChange={(e) => this.setState({toEmail: e.target.value})} placeholder='To Email'></input>
        <input onChange={(e) => this.setState({fromEmail: e.target.value})} placeholder='From Email'></input>
        <input onChange={(e) => this.setState({subject: e.target.value})} placeholder='Subject'></input>
        <input onChange={(e) => this.setState({content: e.target.value})} placeholder='Content'></input>
        <button onClick={this.sendEmail}>Send Email</button> 
        {this.state.errorBoolean ? <div>Your input has an error</div> : null}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));