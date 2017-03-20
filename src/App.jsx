/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import { sortBy } from 'lodash';
import FontAwesome from 'react-fontawesome';

const DEFAULT_QUERY = 'Tesla';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

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

const Sort = ({ sortKey, activeSortKey, onSort, children, isSortReverse }) => (
  <th onClick={() => onSort(sortKey)} style={{ cursor: 'pointer' }}>
    {sortKey === activeSortKey
      ? <FontAwesome
        name="caret-down"
        className={isSortReverse ? 'fa-rotate-180' : ''}
        style={{ verticalAlign: 'middle' }}
      />
      : ''}
    {children}
  </th>
);

const Search = ({ value, onChange, onSubmit, children, isLoading }) => (
  <form onSubmit={onSubmit} className="field has-addons has-addons-centered">
    <p className="control is-expanded">
      <input className="input" value={value} type="text" placeholder="Search" onChange={onChange} />
    </p>
    <p className="control">
      {isLoading
        ? <button type="submit" className="button is-primary is-loading is-disabled">
          {children}
        </button>
        : <button type="submit" className="button is-primary">
          {children}
        </button>}
    </p>
  </form>
);

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
  isLoading: PropTypes.boolValue,
};

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const {
      list,
      onDismiss,
    } = this.props;

    const {
      sortKey,
      isSortReverse,
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <table className="table is-striped">
        <thead>
          <tr>
            <Sort
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              {' '}Title
            </Sort>
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              {' '}Author
            </Sort>
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              {' '}Comments
            </Sort>
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              {' '}Points
            </Sort>
            <th>Archive</th>
          </tr>
        </thead>
        {reverseSortedList.map(item => (
          <tbody>
            <tr key={item.objectID}>
              <td><a href={item.url} rel="noopener noreferrer" target="_blank">{item.title}</a></td>
              <td>{item.author}</td>
              <td>{item.num_comments}</td>
              <td>{item.points}</td>
              <td><Button className="delete" onClick={() => onDismiss(item.objectID)} /></td>
            </tr>
          </tbody>
        ))}
      </table>
    );
  }
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    }),
  ).isRequired,
  onDismiss: PropTypes.func,
};

const Button = ({ onClick, className, children }) => (
  <button className={className} onClick={onClick}>{children}</button>
);

Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

Button.defaultProps = {
  className: '',
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

export { Button, Search, Table };
