import React, { Component, PropTypes } from 'react';
import Table from '../Table';

import { PATH_BASE, PATH_SEARCH, PARAM_FRONT_PAGE } from '../../constants';

class Trending extends Component {
  constructor(props) {
    super(props);

    // Bind class methods to object instances
    this.fetchTopstories = this.fetchTopstories.bind(this);
  }

  componentDidMount() {
    this.fetchTopstories();
  }

  fetchTopstories() {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_FRONT_PAGE}`)
      .then(response => response.json())
      .then(result => console.log(result));
  }

  render() {
    return (
      <div>
        <div className="section" />
      </div>
    );
  }
}

export default Trending;
