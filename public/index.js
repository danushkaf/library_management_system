var React = require('react');
var connect = require('react-redux').connect;
var Link = require('react-router').Link;

var Index = React.createClass({

	render: function() {
		return (
		<html>
			<head>
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.3.1/redux.min.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/react-redux/4.4.0/react-redux.min.js"></script>
				<script src="https://npmcdn.com/react-router/umd/ReactRouter.min.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.min.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.js"></script>
				<script src="scripts/require-shims.js"></script>
				<script type="text/babel" src="redux-store.js"></script>
				<script type="text/babel" src="index.js"></script>
				<script type="text/babel" src="book.js"></script>
				<script type="text/babel" src="routes.js"></script>
				<script type="text/babel" src="client.js"></script>
        <title>Library Management System</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body>
				<div id="content">
          <div>
            <nav className="navbar navbar-absolute-top navbar-inverse" role="navigation">
              <ul className="nav navbar-nav">
                <li><Link to="/" activeStyle={{fontWeight: 'bold'}} onlyActiveOnIndex>Manage Books</Link></li>
              </ul>
            </nav>
          </div>
          <br/>
          {this.props.children}
				</div>

			</body>
		</html>
		)
	}
});

var IndexState = function(state) {
	var stateJSON = JSON.stringify(state).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
	return {
		initialState: "window.__INITIAL_STATE__ = "+stateJSON
	}
}

Index = connect(
	IndexState
)(Index)

module.exports = Index
