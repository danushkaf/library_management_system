var createStore = require('redux').createStore;

var reducer = function(state, action) {
  if(state === undefined) {
    return {};
  }
  var newState = state;
  switch(action.type) {
    case 'add_book':
      var newBooks = state.data.concat([action.book]);
      newState = Object.assign({}, state, {data: newBooks});
      break;
    case 'view_books':
      newState = Object.assign({}, state, {data: action.data})
      break;
    case 'delete_book':
      var newBooks = delete state.data[id];
      newState = Object.assign({}, state, {data: action.data})
      break;
  }
  return newState;
}

module.exports = {
  configureStore: function(initialState) {
    return createStore(reducer, initialState)
  }
}
