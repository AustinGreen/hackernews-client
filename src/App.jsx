import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit} className="field has-addons has-addons-centered">
    <p className="control is-expanded">
      <input className="input" value={value} type="text" placeholder="Search" onChange={onChange} />
    </p>
    <p className="control">
      <button type="submit" className="button is-primary">
        Search
      </button>
    </p>
  </form>
);

const Table = ({ list, pattern, onDismiss }) => (
  <table className="table is-bordered is-striped">
    <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th>No. of Comments</th>
        <th>Points</th>
        <th>Dismiss</th>
      </tr>
    </thead>
    <tbody>
      {list.map(item => (
        <tr key={item.objectID}>
          <td><a href={item.url}>{item.title}</a></td>
          <td>{item.author}</td>
          <td>{item.num_comments}</td>
          <td>{item.points}</td>
          <td><Button className="delete" onClick={() => onDismiss(item.objectID)} /></td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Button = ({ onClick, className = '', children }) => (
  <button className={className} onClick={onClick}>{children}</button>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    // Bind class methods to object instances
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  onSearchSubmit(e) {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    e.preventDefault();
  }

  setSearchTopstories(result) {
    const { hits, page } = result;
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      result: { hits: updatedHits, page },
    });
  }

  fetchSearchTopstories(searchTerm, page) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`,
    )
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits },
    });
  }

  onSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;

    return (
      <div className="App">
        <div className="section column is-half is-offset-one-quarter">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          />
        </div>
        <div className="section">
          {result && <Table list={result.hits} onDismiss={this.onDismiss} />}
          <div className="container is-fluid has-text-centered">
            <Button
              className="button is-primary"
              onClick={() => this.fetchSearchTopstories(searchTerm, page + 1)}
            >
              Load More
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
