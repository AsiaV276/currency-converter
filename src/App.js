import React, {useEffect, useState} from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow'


const BASE_URL = 'https://api.exchangeratesapi.io/latest'

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true); //determines whether value was changed in the fromCurrency or the toCurrency
  
let toAmount, fromAmount;
if(amountInFromCurrency) {
  fromAmount = amount;
  toAmount = amount * exchangeRate;
}
else {
  toAmount = amount;
  fromAmount = amount / exchangeRate;
}

  useEffect(() => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      const firstCurrency = Object.keys(data.rates)[0];
      setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
      setToCurrency(firstCurrency);
      setExchangeRate(data.rates[firstCurrency]);
    })
  },[]) //runs code when page loads

  useEffect(() => {
    if(fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res => res.json())
      .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency]) //runs code when fromCurrency or toCurrency is changed

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true); //lets know that amount change is from From
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false); //lets know that amount change is NOT from From
  }

  return (
    <>
      <h1>Currency Converter</h1>
      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)} //sets the from currency to the state
        onChangeAmount={handleFromAmountChange} //tells which input is changing, to know how to do the conversion
        amount={fromAmount}
      />
      <div className='equals'>=</div>
      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange} 
        amount={toAmount}
      />
    </>
  );
}

export default App;
