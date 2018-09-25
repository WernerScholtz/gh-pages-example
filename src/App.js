import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Select from 'react-select';
import { Grid, Row, Col } from 'react-bootstrap';

const ApiEndpoint = "https://free.currencyconverterapi.com/api/v6/";
const ConvertEndpoint = ApiEndpoint + "convert?compact=y&q=";
const CurrenciesEndpoint = ApiEndpoint + 'currencies';
var currencies = null;

class ConversionCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = { toValue: '1', fromValue: '1', conversionResult: '1',
                    fromCurrencySymbol: '', fromCurrencyName: '',
                    toCurrencySymbol: '', toCurrencyName: '' }

    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.conversionResult !== prevProps.conversionResult) {
      let fromResult = 1;
      let toResult = fromResult * this.props.conversionResult;

      let fromCurrencySymbol = '';
      let fromCurrencyName = '';
      let toCurrencySymbol = '';
      let toCurrencyName = '';
      if (this.props.fromRequest && this.props.toRequest) {
        if (currencies[this.props.fromRequest].currencySymbol) {
          fromCurrencySymbol = currencies[this.props.fromRequest].currencySymbol;
        } else {
          fromCurrencyName = currencies[this.props.fromRequest].currencyName;
        }

        if (currencies[this.props.toRequest].currencySymbol) {
          toCurrencySymbol = currencies[this.props.toRequest].currencySymbol;
        } else {
          toCurrencyName = currencies[this.props.toRequest].currencyName;
        }
      }

      this.setState({ fromValue: fromResult.toFixed(2), toValue: toResult.toFixed(2),
                      conversionResult: this.props.conversionResult,
                      fromCurrencySymbol: fromCurrencySymbol, fromCurrencyName: fromCurrencyName,
                      toCurrencySymbol: toCurrencySymbol, toCurrencyName: toCurrencyName });
    }
  }

  handleFromChange = (event) => {
    let value = parseFloat(event.target.value);
    if (value != null && value >= 0) {
      let toResult = value * this.state.conversionResult;
      this.setState({ toValue: toResult.toFixed(2) });
    } else {
      let toResult = 0;
      this.setState({ toValue: toResult.toFixed(2) });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Grid>
          <Row>
            <Col md={12}>
              <Row>
                <Col md={12}>
                  {this.state.fromCurrencySymbol} <input className={'value-input'} type="text" defaultValue={this.state.fromValue} onChange={this.handleFromChange} /> {this.state.fromCurrencyName} equals {this.state.toCurrencySymbol} {this.state.toValue} {this.state.toCurrencyName}
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </form>
    );
  }
}

class CurrencyConversion extends Component {
  constructor(props) {
    super(props);
    this.state = { conversionResult: 0, fromRequest: '', toRequest: '' };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.fromRequest !== null
        & this.props.toRequest !== null
        & (this.props.fromRequest !== prevProps.fromRequest
          | this.props.toRequest !== prevProps.toRequest)
        & this.props.toRequest !== this.props.fromRequest) {
      let request = this.props.fromRequest.value + '_' + this.props.toRequest.value;
      let conversionResult = await this.getConversionResult(request);
      this.setState({ conversionResult: conversionResult, fromRequest: this.props.fromRequest.value, toRequest: this.props.toRequest.value });
    }
  }

  async getConversionResult(request) {
    if (LocalStorageIsActive) {
      return await GetConversionResultWithLocalStorage(request);
    } else {
      return await GetConversionResult(request);
    }
  }

  render() {
    return (
        <ConversionCalculator
          conversionResult={this.state.conversionResult}
          fromRequest={this.state.fromRequest}
          toRequest={this.state.toRequest}
        />
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
            <Col md={6} className={'select-element'}>
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
    let response = await fetch(CurrenciesEndpoint);
    let data = await response.json();
    let currenciesResult = data['results'];
    localStorage.setItem('Currencies', JSON.stringify(currenciesResult));
    currencies = JSON.parse(localStorage.getItem('Currencies'));
  }
}

async function SetCurrenciesWithoutLocalStorage() {
  if (currencies === null || !currencies) {
    let response = await fetch(CurrenciesEndpoint);
    let data = await response.json();
    let currenciesResult = data['results'];
    currencies = currenciesResult;
  }
}

async function GetConversionResultWithLocalStorage(request) {
  let requestFlip = request.substring(4, 7) + '_' + request.substring(0, 3);

  if (localStorage.getItem(request)) {
    return await GetConversionResultFromStorage(request);
  } else if (localStorage.getItem(requestFlip)) {
    let result = await GetConversionResultFromStorage(requestFlip);
    if (result > 0) {
      return 1/result;
    } else {
      return 0;
    }
  } else {
    return await FetchAndStoreConversionResult(request);
  }
}

async function GetConversionResultFromStorage(request) {
  let resultObject = JSON.parse(localStorage.getItem(request));
  let date = new Date();
  if ( date.getTime() - resultObject.time > 3600000 ) {
    localStorage.removeItem(request);
    return await FetchAndStoreConversionResult(request);
  }
  return resultObject.conversionResult;
}

async function FetchAndStoreConversionResult(request) {
  let conversionResult = await GetConversionResult(request);
  let date = new Date();
  let time = date.getTime();
  let conversionResultObject = { conversionResult, time };
  localStorage.setItem(request, JSON.stringify(conversionResultObject));
  return conversionResult;
}

async function GetConversionResult(request) {
  const conversionRequest = ConvertEndpoint + request;
  let response = await fetch(conversionRequest);
  let data = await response.json();
  let conversionResult = data[request];
  return conversionResult.val;
}

export default App;
