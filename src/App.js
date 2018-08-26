import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Select from 'react-select';
import { Grid, Row, Col } from 'react-bootstrap';

const ApiEndpoint = "https://free.currencyconverterapi.com/api/v6/";
const ConvertEndpoint = ApiEndpoint + "convert?compact=y&q=";
const CurrenciesEndpoint = ApiEndpoint + 'currencies';
var currencies = null;

class CurrencyConversion extends Component {
  constructor(props) {
    super(props);
    this.state = { conversionDisplay: 'Please select currencies to convert.' };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.fromRequest !== null
      & this.props.toRequest !== null
      & (this.props.fromRequest !== prevProps.fromRequest
        | this.props.toRequest !== prevProps.toRequest)
      & this.props.toRequest !== this.props.fromRequest) {
      let request = this.props.fromRequest.value + '_' + this.props.toRequest.value;
      let conversionResult = await this.getConversionResult(request);
      let fromCurrencyMessage = this.getFromMessage();
      let toCurrencyMessage = this.getToMessage(conversionResult);
      let updatedConversionDisplay = fromCurrencyMessage + ' is worth ' + toCurrencyMessage;
      this.setState({ conversionDisplay: updatedConversionDisplay });
    }
  }

  getFromMessage() {
    if (currencies[this.props.fromRequest.value].currencySymbol) {
      return currencies[this.props.fromRequest.value].currencySymbol + '1';
    } else {
      return '1 ' + currencies[this.props.fromRequest.value].currencyName;
    }
  }

  getToMessage(conversionResult) {
    if (currencies[this.props.toRequest.value].currencySymbol) {
      return currencies[this.props.toRequest.value].currencySymbol + conversionResult;
    } else {
      return conversionResult + ' ' + currencies[this.props.toRequest.value].currencyName;
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
    if (LocalStorageIsActive()) {
      await SetCurrenciesWithLocalStorage();
    } else {
      await SetCurrenciesWithoutLocalStorage();
    }

    let optionsArray = Object.keys(currencies).map((key) => {
      let currencyEntry = { value: currencies[key].id, label: currencies[key].currencyName };
      return currencyEntry;
    });

    optionsArray.sort((a, b) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });

    this.setState({ options: optionsArray });
  }

  handleFromChange = (selectedFromOption) => {
    this.setState({ selectedFromOption });
  }
  handleToChange = (selectedToOption) => {
    this.setState({ selectedToOption });
  }

  render() {
    const { selectedFromOption, selectedToOption } = this.state;

    return (
      <div>
        <Grid>
          <Row>
            <Col md={6} className={'select-element'}>
              <Row>
                <Col md={12}>
                  <p>
                    Select from currency
                  </p>
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
            <Col md={6} className={'select-element'}>
              <Row>
                <Col md={12}>
                  <p>
                    Select to currency
                  </p>
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
        <CurrencySelector />
      </div>
    );
  }
}

function LocalStorageIsActive() {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('feature_test', 'yes');
      if (localStorage.getItem('feature_test') === 'yes') {
        localStorage.removeItem('feature_test');
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}

async function SetCurrenciesWithLocalStorage() {
  if (localStorage.getItem('Currencies')) {
    currencies = JSON.parse(localStorage.getItem('Currencies'));
  } else {
    alert('Fetching Currencies for local storage.');
    let response = await fetch(CurrenciesEndpoint);
    let data = await response.json();
    let currenciesResult = data['results'];
    localStorage.setItem('Currencies', JSON.stringify(currenciesResult));
    let currenciesFromStorage = localStorage.getItem('Currencies');
    currencies = JSON.parse(localStorage.getItem('Currencies'));
  }
}

async function SetCurrenciesWithoutLocalStorage() {
  if (currencies === null || !currencies) {
    alert('Fetching Currencies without local storage.');
    let response = await fetch(CurrenciesEndpoint);
    let data = await response.json();
    let currenciesResult = data['results'];
    currencies = currenciesResult;
  }
}

export default App;
