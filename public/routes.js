var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var Index = require('./index')
var BooksTable = require('./book')

var routes = (
    <Route path="/" component={Index}>
      <IndexRoute component={BooksTable}/>
    </Route>
)

module.exports = {
  routes: routes
}
