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
  <form className="field">
    <p className="control">
      <input className="input" value={value} type="text" placeholder="Search" onChange={onChange} />
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
    setTimeout(() => this.setState({ result }), 2000);
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
    const updatedHits = this.state.result.hits.filter(isNotId);
    console.log(this.state.result);
    this.setState({
      result: { ...this.state.result, hits: updatedHits },
    });
  }

  onSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const { searchTerm, result } = this.state;

    return (
      <div className="App">
        <div className="section column is-half is-offset-one-quarter">
          <Search value={searchTerm} onChange={this.onSearchChange} />
        </div>
        <div className="section">
          {result && <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss} />}
        </div>
      </div>
    );
  }
}

export default App;
