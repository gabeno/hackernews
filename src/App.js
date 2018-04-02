import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/fontawesome-free-solid';
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
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null, 
      isLoading: false, 
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
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotID = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotID);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  onSearchChange(event) {
    // event => synthetic react event!
    // console.log(event.target.value);
    this.setState({ searchTerm: event.target.value });
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    
    // when page=0 its a new search from either
    // onSearchSubmit() or componentDidMount() and hits are empty
    // otherwise more data requested and old hits alreadt stored
    // in the local state
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];
    
    // merge old and new hits
    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    // set merged hits and page in the local component state
    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      },
      isLoading: false
    });
  }

  fetchSearchTopStories(searchTerm, page=0) {
    this.setState({ isLoading: true });
    axios(`${url}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      // once data arrives, internal component state is changed
      // update lifecycle runs rendera again
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error}));
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    // destructure for better readability
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading
    } = this.state;

    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    if (error) return <p>Something went wrong!</p>

    return (
      <div className="page">
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>

          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>

        { error
          ? <div className="interactions"><p>Something went wrong!</p></div>
          : <Table
              list={list}
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

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
};

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

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

const Button = ({ onClick, className, children }) =>
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  className: '',
};

const Loading = () =>
  <div>
    <FontAwesomeIcon icon={ faSpinner } pulse />
  </div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading
    ? <Loading />
    : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

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

/**
 * src/
  index.js
  index.css
  constants/
    index.js
  components/
    App/
      index.js
      test.js
      index.css
    Button/
      index.js
      test.js
      index.css
    Table/
      index.js
      test.js
      index.css
    Search/
      index.js
      test.js
      index.css
 */
export default App;

export {
  Button,
  Table,
  Search,
  Loading
};