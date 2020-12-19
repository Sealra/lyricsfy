import './App.css';
import React, { Component } from 'react';

import Navbar from './components/layout/Navbar';
import Index from './components/layout/Index';
import Lyrics from './components/tracks/Lyrics';
import Search from './components/tracks/Search';

import { Provider } from './context';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends Component { 
  render() {
    return (
      <Provider>
        <Router>
          <React.Fragment>
            <Navbar />
            <div className="container" style={{marginTop: 20 ,alignItems: 'center'}}>
              <Search/>
              <Switch>
                <Route exact path="/" component={Index} />
                <Route exact path="/lyrics/track/:id" component={Lyrics} />
              </Switch>
              <br/>
            </div>
          </React.Fragment>
        </Router>
      </Provider>
    )
  }
}

export default App;
