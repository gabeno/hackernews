import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'Redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = '?query=';
const url = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}`;

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
    this.setState({ result });
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    fetch(`${url}${searchTerm}`)
      .then(response => response.json())
      // once data arrives, internal component state is changed
      // update lifecycle runs rendera again
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  render() {
    // you may define the higher order function outside of the click handler
    // but it has to live inside of the map callback because it needs
    // objectID

    // destructure for better readability
    console.log(this.state);
    const { searchTerm, result } = this.state;

    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange}>Search</Search>
        </div>
        { result &&
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss} />
        }
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) =>
  <form>
    {children} <input type="text" onChange={onChange} value={value} />
  </form>

const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {list.filter(isSearched(pattern)).map(item =>
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