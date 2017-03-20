/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import Search from '../Search';
import Table from '../Table';

import {
  DEFAULT_QUERY,
  DEFAULT_PAGE,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
} from '../../constants';

const updateSearchTopstoriesState = (hits, page) =>
  (prevState) => {
    const { searchKey, results } = prevState;
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    return {
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
      isLoading: false,
    };
  };

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: DEFAULT_QUERY,
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
    };

    // Bind class methods to object instances
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    // this.setState({ searchKey: searchTerm });
    // commented this out in favor of defaulting searchKey to DEFAULT_QUERY
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  onSearchSubmit(e) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }
    e.preventDefault();
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
    });
  }

  onSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  setSearchTopstories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopstoriesState(hits, page));
  }

  fetchSearchTopstories(searchTerm, page) {
    this.setState({ isLoading: true });
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`,
    )
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  needsToSearchTopstories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  render() {
    const {
      results,
      searchKey,
      searchTerm,
      isLoading,
    } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div>
        {/* <div className="section">
          <div className="tabs">
            <ul>
              <li className="is-active"><a>Search</a></li>
              <li><a>Trending</a></li>
            </ul>
          </div>
        </div> */}
        <div className="section column is-half is-offset-one-quarter">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            isLoading={isLoading}
          >
            Search
          </Search>
        </div>
        <div className="section">
          <Table list={list} onDismiss={this.onDismiss} />
          <div className="container is-fluid has-text-centered">
            {isLoading
              ? <Button className="button is-primary is-loading is-disabled">
                  Load More
                </Button>
              : <Button
                className="button is-primary"
                onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}
              >
                  Load More
                </Button>}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
