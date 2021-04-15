import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginComponent from './Login'

// import { 
//   BrowserRouter as Router, 
//   Route, 
//   Switch, 
//   Link, 
//   Redirect 
// } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: '' };
  }

  callAPI() { // this function requests information from the node server (at localhost:9000), and stores it in the apiResponse variable. 
    fetch('http://localhost:9000/testAPI')
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }))
      .catch(err => err);
  }; 

  componentWillMount() {
    this.callAPI();
  };

  render() { 
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
          <p className="App-intro">;{this.state.apiResponse}</p> 

          {/* <p>
                  Edit <code>src/App.js</code> and save to reload.
          </p> */}
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <br></br>
          <LoginComponent displaytext="First Component Data"/>
        </header>
      </div>
    )
  };
};



export default App;
