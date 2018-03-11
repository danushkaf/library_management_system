var React = require('react');
var ReactRedux = require('react-redux');

class BooksTable extends React.Component {
  bookList: null;
  loadBooksFromServer() {
    $.ajax({
      url: this.props.listAPIUrl,
      dataType: 'json',
      type: 'POST',
      data: {},
      secret: this.props.secret,
      success: function(res) {
        this.bookList = res.data;
        this.props.viewBooks(this.bookList);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("Error occured while calling api");
      }.bind(this)
    });
  }
  handleBookSubmit(book) {
    this.bookList = this.props.data;
    $.ajax({
      url: this.props.addAPIUrl,
      dataType: 'json',
      type: 'POST',
      data: book,
      secret: this.props.secret,
      success: function(data) {
        this.props.addBook(data);
      }.bind(this),
      error: function(xhr, status, err) {
        this.props.viewBooks(this.bookList);
      }.bind(this)
    });
  }
  componentDidMount() {
    this.loadBooksFromServer();
    setInterval(this.loadBooksFromServer, this.props.pollInterval);
  }
  render() {
    this.bookList = this.props.data;
    return (
      <div>
        <BookList data={this.bookList}/>
        <div className="container">
          <h2>Add New Book to the System</h2>
          <BookForm onBookSubmit={this.handleBookSubmit} />
        </div>
      </div>
    );
  }
};

class BookList extends React.Component {
  render() {
    var bookNodes = this.props.data.map(function(book) {
      return (
        <Book name={book.NAME} description={book.DESCRIPTION} author={book.AUTHOR}
            category={book.CATEGORY} id={book.ID} secret={book.secret} />
      );
    });

    if (bookNodes.length != 0) {
      var noBooksArray = [];
      noBooksArray.push({"noOfBooks" : 0})
      bookNodes = noBooksArray.map(function() {
        return (
          <div className="row well well-sm"> No Books are added yet.</div>
        );
      });
    }
    return (
      <div className="container">
        <div className="row well">
          <div className="col-sm-3"><b>Name</b></div>
          <div className="col-sm-3"><b>Description</b></div>
          <div className="col-sm-3"><b>Author</b></div>
          <div className="col-sm-2"><b>Category</b></div>
          <div className="col-sm-1"><b>Action</b></div>
        </div>
        <bookNodes />
      </div>
    );
  }
};

class Book extends React.Component{
  constructor(props) {
    super(props);
    this.state = {id: this.props.id, name: this.props.name, description: this.props.description, author: this.props.author, category: this.props.category, secret: this.props.secret};
  }

  render() {
    return (
      <div className="row well well-sm">
        <div className="col-sm-3">{this.props.name}</div>
        <div className="col-sm-3">{this.props.description}</div>
        <div className="col-sm-3">{this.props.author}</div>
        <div className="col-sm-2">{this.props.category}</div>
        <div className="col-sm-1"><i className='fa fa-close' onclick='removeItem({this.props.id})'></i></div>
      </div>
    );
  }
};

class BookForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '', description: '', author: '', category:'', secret: this.props.secret};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleNameChange(e) {
    this.setState({author: e.target.value});
  }

  handleDescriptionChange(e) {
    this.setState({author: e.target.value});
  }

  handleAuthorChange(e) {
    this.setState({author: e.target.value});
  }

  handleCategoryChange(e) {
    this.setState({author: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var description = this.state.description.trim();
    var author = this.state.author.trim();
    var category = this.state.category.trim();
    var secret = this.state.secret.trim();
    if (!name || !author || !category) {
      return;
    }
    this.props.onBookSubmit({name: name, description: description, author: author, category:category, secret: secret});
    this.setState({name: '', description: '', author: '', category: '', secret: ''});
    return false;
  }

  render() {
    return (
      <form className="form-horizontal" method="post" action={this.props.addAPIUrl} onSubmit={this.handleSubmit} >
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="name">Name : </label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="name" placeholder="Enter Title" name="name"
              value={this.state.name} onChange={this.handleNameChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="decription">Description : </label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="decription" placeholder="Enter Description" name="decription"
              value={this.state.description} onChange={this.handleDescriptionChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="author">Author : </label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="author" placeholder="Enter Author" name="author"
              value={this.state.author} onChange={this.handleAuthorChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="category">Category : </label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="category" placeholder="Enter Category" name="category"
              value={this.state.category} onChange={this.handleCategoryChange} />
          </div>
        </div>
        <input type="hidden" id="secret" name="secret" value={this.props.secret} />
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <input type="submit" className="btn btn-default" onClick={this.handleSubmit} value="Add"/>
          </div>
        </div>
      </form>
    );
  }
};

function BookTableDispatch(dispatch) {
  return {
    addBook: function(book) {
      dispatch({
        type: 'add_book',
        data: book,
      })
    },
    viewBooks: function(data) {
      dispatch({
        type: 'view_books',
        data: data,
      })
    },
    deleteBook: function(id) {
      dispatch({
        type: 'delete_book',
        data: id
      })
    }
  }
}

function BooksTableState(state) {
  return {
    addAPIUrl: state.addAPIUrl,
    listAPIUrl: state.listAPIUrl,
    deleteAPIUrl: state.deleteAPIUrl,
    secret: state.secret,
    data: state.data,
    pollInterval: state.pollInterval
  }
}

function BookListState(state) {
  return {
    secret: state.secret,
    data: state.data
  }
}

function BookState(state) {
  return {
    secret: state.secret,
    data: state.data
  }
}

function BookFormState(state) {
  return {
    secret: state.secret,
    addAPIUrl: state.addAPIUrl
  }
}

var connect = ReactRedux.connect;

BooksTable = connect(
  BooksTableState,
  BookTableDispatch
)(BooksTable)
BookList = connect(
  BookListState
)(BookList)
Book = connect(
  BookState
)(Book)
BookForm = connect(
  BookFormState
)(BookForm)


module.exports = BooksTable;
