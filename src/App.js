import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Select from 'react-select';
import { Grid, Row, Col } from 'react-bootstrap'

const ApiEndpoint = "https://free.currencyconverterapi.com/api/v6/";
const ConvertEndpoint = ApiEndpoint + "convert?q=";
const CompactEndpoint = "&compact=y";

const options = [
  { value: 'USD', label: 'USD' },
  { value: 'ZAR', label: 'ZAR'}
]

class CurrencyConversionResult extends Component {
  constructor(props) {
    super(props);
    this.state = {conversion: 0};
  }

  componentDidMount(){
    this.getConversionResult(this.props.request)
  }

  async getConversionResult(request) {
    const conversionRequest = ConvertEndpoint + request + CompactEndpoint;
    let response = await fetch(conversionRequest)
    let data = await response.json()
    let conversionResult = data[request];
    console.log(conversionResult);
    this.setState({ conversion: conversionResult.val });
  }

  render() {
    return (
      <div>
        {this.props.request}: {this.state.conversion}
      </div>
    );
  }
}

class CurrencySelector extends Component {
  state = {
    selectedOption: null
  }
  handleChange = (selectedOption) => {
    this.setState({selectedOption});
    console.log('Option selected: ', selectedOption);
  }

  render() {
    const requestCurrencies = "USD_ZAR";
    const {selectedOption} = this.state;

    return (
      <div>
        <Grid>
          <Row>
            <Col md={6}>
              Select from currency
          </Col>
            <Col md={6}>
              Select to currency
          </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Select className={'select-box'}
                value={selectedOption}
                onChange={this.handleChange}
                options={options} />
            </Col>
            <Col md={6}>
              <Select className={'select-box'}
                value={selectedOption}
                onChange={this.handleChange}
                options={options} />
            </Col>
          </Row>
          <CurrencyConversionResult request={requestCurrencies} />
        </Grid>
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
        <CurrencySelector />
      </div>
    );
  }
}

export default App;
