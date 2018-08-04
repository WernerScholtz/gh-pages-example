import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Select from 'react-select';
import { Grid, Row, Col } from 'react-bootstrap';

const ApiEndpoint = "https://free.currencyconverterapi.com/api/v6/";
const ConvertEndpoint = ApiEndpoint + "convert?compact=y&q=";
const CurrenciesEndpoint = ApiEndpoint + 'currencies';

class CurrencyConversion extends Component {
  constructor(props) {
    super(props);
    this.state = {conversionDisplay: 'Please select currencies to convert.'};
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
    const conversionRequest = ConvertEndpoint + request;
    let response = await fetch(conversionRequest);
    let data = await response.json();
    let conversionResult = data[request];
    return conversionResult.val.toFixed(2);
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
    options: []
  }

  componentDidMount() {
    this.getCurrencies();
  }

  async getCurrencies() {
    let response = await fetch(CurrenciesEndpoint);
    let data = await response.json();
    let currenciesResult = data['results'];

    let optionsArray = Object.keys(currenciesResult).map((key) => {
      let currencyEntry = { value: currenciesResult[key].id, label: currenciesResult[key].currencyName };
      return currencyEntry;
    });

    this.setState({options: optionsArray}) ;
  }

  handleFromChange = (selectedFromOption) => {
    this.setState({selectedFromOption});
  }
  handleToChange = (selectedToOption) => {
    this.setState({selectedToOption});
  }

  render() {
    const {selectedFromOption, selectedToOption} = this.state;

    return (
      <div>
        <Grid>
          <Row>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  Select from currency
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Select className={'select-box'}
                    value={selectedFromOption}
                    onChange={this.handleFromChange}
                    options={this.state.options} />
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  Select to currency
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Select className={'select-box'}
                    value={selectedToOption}
                    onChange={this.handleToChange}
                    options={this.state.options} />
                </Col>
              </Row>
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
          <h1 className="App-title">Welcome to a simple currency conversion app built with React</h1>
        </header>
        <p className="App-intro">
          Select currencies below to convert.
        </p>
        <CurrencySelector />
      </div>
    );
  }
}


export default App;
