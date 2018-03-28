import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  }
]

/*
// an es5 higher order function
// see es6 equivalent below

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}
*/

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      list,
      searchTerm: ''
    }

    // bind class methods to this (class instance)
    // done in the constructor because it runs once on instantiation
    // defining methods using arrow functions achieves the same but without
    // the statement here!
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    const isNotID = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotID);
    this.setState({list: updatedList});
  }

  onSearchChange(event) {
    // event => synthetic react event!
    // console.log(event.target.value);
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    // you may define the higher order function outside of the click handler
    // but it has to live inside of the map callback because it needs
    // objectID

    // destructure for better readability
    const { searchTerm, list } = this.state;

    return (
      <div className="App">
        <Search value={searchTerm} onChange={this.onSearchChange}>Search</Search>
        <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) =>
  <form>
    {children} <input type="text" onChange={onChange} value={value} />
  </form>

const Table = ({ list, pattern, onDismiss }) =>
  <div>
    {list.filter(isSearched(pattern)).map(item =>
      <div key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>
          <Button onClick={() => onDismiss(item.objectID)}>
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

const Button = ({ onClick, className = '', children }) =>
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>

export default App;