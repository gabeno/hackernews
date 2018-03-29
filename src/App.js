import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'Redux';
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = '?query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const url = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}`;


class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY 
    }

    // bind class methods to this (class instance)
    // done in the constructor because it runs once on instantiation
    // defining methods using arrow functions achieves the same but without
    // the statement here!
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  onDismiss(id) {
    const isNotID = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotID);
    this.setState({
      // result: Object.assign({}, this.state.result, { hits: updatedHits })
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange(event) {
    // event => synthetic react event!
    // console.log(event.target.value);
    this.setState({ searchTerm: event.target.value });
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    
    // when page=0 its a new search from either
    // onSearchSubmit() or componentDidMount() and hits are empty
    // otherwise more data requested and old hits alreadt stored
    // in the local state
    const oldHits = page !== 0
      ? this.state.result.hits
      : [];
    
    // merge old and new hits
    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    // set merged hits and page in the local component state
    this.setState({
      result: { hits: updatedHits, page }
    });
  }

  fetchSearchTopStories(searchTerm, page=0) {
    fetch(`${url}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      // once data arrives, internal component state is changed
      // update lifecycle runs rendera again
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    // destructure for better readability
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;

    console.log(this.state);

    return (
      <div className="page">
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
            More
          </Button>

          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>

        { result &&
          <Table
            list={result.hits}
            onDismiss={this.onDismiss} />
        }
      </div>
    );
  }
}

const Search = ({ value, onChange, children, onSubmit }) =>
  <form onSubmit={onSubmit}>
    <input type="text" onChange={onChange} value={value} />
    <button type="submit">{children}</button>
  </form>

const Table = ({ list, onDismiss }) =>
  <div className="table">
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>{item.author}</span>
        <span style={{ width: '10%' }}>{item.num_comments}</span>
        <span style={{ width: '10%' }}>{item.points}</span>
        <span style={{ width: '10%' }}>
          <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
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


/*
class Component {
  // REF: https://reactjs.org/docs/react-component.html
  // will - before something happens
  // did - after something happens

  // *****************************
  //      CLASS PROPERTIES 
  // *****************************
  
  defaultProps

  displayName

  // *****************************
  //      INSTANCE PROPERTIES 
  // *****************************

  props

  state

  // *****************************
  //         MOUNTING
  // *****************************
  
  // called during mounting - when an instance of the component
  // is created and inserted into the DOM
  constructor() {}

  // called before render
  componentWillMount() {}

  // called during mounting too and also when component updates - state 
  // or props change
  render() {}

  // called after render
  componentDidMount() {}

  // *****************************
  //        UPDATING 
  // *****************************

  componentWillReceiveProps() {}

  shouldComponentUpdate() {}

  componentWillUpdate() {}

  render() {}

  componentDidUpdate() {}

  // *****************************
  //       UNMOUNTING 
  // *****************************

  componentWillUnmount() {}

  // *****************************
  //       OTHER APIs
  // *****************************

  setState() {}

  forceUpdate() {}


}
*/

export default App;