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
    this.addMe = this.addMe.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  addMe() {
    this.state.list.push({
      title: 'Future',
      url: 'https://github.com/austingreen',
      author: 'Austin Green',
      num_comments: 22,
      points: 50,
      objectID: 2,
    });
    this.setState({ list });
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
              {this.state.list.filter(isSearched(this.state.searchTerm)).map(item => (
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
        {/* <button onClick={this.addMe}>Add</button> */}
      </div>
    );
  }
}

export default App;
