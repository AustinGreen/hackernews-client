import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: 'Electron',
    url: 'https://facebook.github.io/react/',
    author: 'Sam Walker',
    num_comments: 1,
    points: 8,
    objectID: 2,
  },
  {
    title: 'Future',
    url: 'https://github.com/reactjs/redux',
    author: 'Austin Green',
    num_comments: 12,
    points: 52,
    objectID: 3,
  },
  {
    title: 'Metropolis',
    url: 'https://facebook.github.io/react/',
    author: 'Superman',
    num_comments: 7,
    points: 14,
    objectID: 4,
  },
  {
    title: 'Batcave',
    url: 'https://github.com/reactjs/redux',
    author: 'Batman',
    num_comments: 7,
    points: 25,
    objectID: 5,
  },
];

const isSearched = searchTerm =>
  item => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list,
      searchTerm: '',
    };

    // Bind class methods to object instances
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
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
    const { searchTerm, list } = this.state;
    return (
      <div className="App">
        <div className="section">
          <form className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                placeholder="Search"
                onChange={this.onSearchChange}
              />
            </p>
          </form>
        </div>
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
              {list.filter(isSearched(searchTerm)).map(item => (
                <tr key={item.objectID}>
                  <td><a href={item.url}>{item.title}</a></td>
                  <td>{item.author}</td>
                  <td>{item.num_comments}</td>
                  <td>{item.points}</td>
                  <td>
                    <a className="delete" onClick={() => this.onDismiss(item.objectID)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
