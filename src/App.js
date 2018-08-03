import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const ApiEndpoint = "https://free.currencyconverterapi.com/api/v6/";
const ConvertEndpoint = ApiEndpoint + "convert?q=";
const CompactEndpoint = "&compact=y";

class Heading extends Component {
  constructor(props) {
    super(props);
    let request = "USD_ZAR";
    this.state = this.getConversionResult(request);
  }
  getConversionResult(request) {
    const conversionRequest = ConvertEndpoint + request + CompactEndpoint;
    return fetch(conversionRequest)
      .then(response => {
        return response.json();
      })
      .then(data => {
        let conversionResult = data[request];
        return conversionResult;
      })
  }

  render() {
    let request = "USD_ZAR";
    return (
      <div>
        {request}: {this.state}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Heading />
      </div>
    );
  }
}

export default App;
