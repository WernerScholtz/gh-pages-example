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

class CurrencyConversion extends Component {
  constructor(props) {
    super(props);
    this.state = {conversion: 0,
    conversionDisplay: 'Please select currencies to convert.'};
  }

  async componentDidUpdate(prevProps) {
    if (this.props.fromRequest !== null
      & this.props.toRequest !== null
      & (this.props.fromRequest !== prevProps.fromRequest
      | this.props.toRequest !== prevProps.toRequest)
      & this.props.toRequest !== this.props.fromRequest) {
      let request = this.props.fromRequest.value + '_' + this.props.toRequest.value;
      let conversionResult = await this.getConversionResult(request);
      let updatedConversionDisplay = this.props.fromRequest.label + ' to ' + this.props.toRequest.label + ': ' + conversionResult;
      this.setState({ conversionDisplay: updatedConversionDisplay });
    }
  }

  async getConversionResult(request) {
    const conversionRequest = ConvertEndpoint + request + CompactEndpoint;
    let response = await fetch(conversionRequest)
    let data = await response.json()
    let conversionResult = data[request];
    console.log(conversionResult);
    return conversionResult.val;
  }

  render() {
    return (
        <Grid className={'currency-conversion'}>
          <Row>
            <Col md={12}>
              {this.state.conversionDisplay}
            </Col>
          </Row>
        </Grid>
    );
  }
}

class CurrencySelector extends Component {
  state = {
    selectedFromOption: null,
    selectedToOption: null,
  }
  handleFromChange = (selectedFromOption) => {
    this.setState({selectedFromOption});
    console.log('Option selected: ', selectedFromOption);
  }
  handleToChange = (selectedToOption) => {
    this.setState({selectedToOption});
    console.log('Option selected: ', selectedToOption);
  }

  render() {
    const {selectedFromOption, selectedToOption} = this.state;

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
                value={selectedFromOption}
                onChange={this.handleFromChange}
                options={options} />
            </Col>
            <Col md={6}>
              <Select className={'select-box'}
                value={selectedToOption}
                onChange={this.handleToChange}
                options={options} />
            </Col>
          </Row>
        </Grid>
        <CurrencyConversion
        fromRequest={this.state.selectedFromOption}
        toRequest={this.state.selectedToOption} />
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
