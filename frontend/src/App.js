import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home/Home'
import Test from './components/test/Test'

import { Provider } from "react-redux";
import nickApp from "./reducers/index";
import { createStore } from "redux";

let store = createStore(nickApp);

class App extends Component {
  render() {
    return (
      <div className="App">
      <Provider store={store}>
       	<Test />
      </Provider>
      </div>
    );
  }
}

// <Home />
export default App;
