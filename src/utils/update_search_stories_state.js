/**
 *
 * @param {array} hits
 * @param {integer} page
 */
const updateSearchTopStories = (hits, page) => prevState => {
  const { searchKey, results } = prevState;

  // when page=0 its a new search from either
  // onSearchSubmit() or componentDidMount() and hits are empty
  // otherwise more data requested and old hits alreadt stored
  // in the local state
  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

  // merge old and new hits
  console.log(hits);
  const updatedHits = [...oldHits, ...hits];

  // set merged hits and page in the local component state
  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
};

export default updateSearchTopStories;
