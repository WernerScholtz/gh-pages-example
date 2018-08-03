import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const ApiEndpoint = "https://free.currencyconverterapi.com/api/v6/";
const ConvertEndpoint = ApiEndpoint + "convert?q=";
const CompactEndpoint = "&compact=y";

class Heading extends Component {
  constructor(props) {
    super(props);
    this.state = {name: 0};
  }

  componentDidMount(){
    let request = "USD_ZAR";
    this.getConversionResult(request)
  }

  async getConversionResult(request) {
    const conversionRequest = ConvertEndpoint + request + CompactEndpoint;
    let response = await fetch(conversionRequest)
    let data = await response.json()
    let conversionResult = data[request];
    console.log(conversionResult);
    this.setState({ name: conversionResult.val });
  }

  render() {
    let request = "USD_ZAR";
    return (
      <label>
        {request}: {this.state.name}
      </label>
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
