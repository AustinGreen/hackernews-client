import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const isSearched = searchTerm =>
  item => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

const Search = ({ value, onChange, children }) => (
  <div className="section">
    <form className="field">
      <p className="control">
        <input
          className="input"
          value={value}
          type="text"
          placeholder="Search"
          onChange={onChange}
        />
      </p>
    </form>
  </div>
);

const Table = ({ list, pattern, onDismiss }) => (
  <div className="section">
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
        {list.filter(isSearched(pattern)).map(item => (
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
  </div>
);

const Button = ({ onClick, className = '', children }) => (
  <button className={className} onClick={onClick} />
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
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

  onSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const { searchTerm, result } = this.state;

    if (!result) {
      return null;
    }

    return (
      <div className="App">
        <Search value={searchTerm} onChange={this.onSearchChange} />
        <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss} />
      </div>
    );
  }
}

export default App;
