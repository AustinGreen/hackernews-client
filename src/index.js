/* eslint-env browser */

import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';

import App from './components/App';
import Trending from './components/Trending';

const RouterParent = () => (
  <Router>
    <div>
      <div className="section">
        <div className="tabs">
          <ul>
            <li>
              <NavLink
                exact
                to="/"
                activeStyle={{ borderBottomColor: '#00d1b2', color: '#00d1b2' }}
              >
                Search
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/trending"
                activeStyle={{ borderBottomColor: '#00d1b2', color: '#00d1b2' }}
              >
                Trending
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <Route exact path="/" component={App} />
      <Route path="/trending" component={Trending} />
    </div>
  </Router>
);

ReactDOM.render(<RouterParent />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
