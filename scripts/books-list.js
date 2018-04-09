import Component from './component.js';

export default class BooksList extends Component {
  constructor({element, userLogin}) {
    console.log("--BooksList--");
    super(element);
    this.userLogin = userLogin;
    this.on('click', this._onBookItemClicked.bind(this), '[data-element="book-item"]');
  }

  setBooks(books) {
    console.log("BooksList setBooks");
    console.log(books);
    this._books = books;
    this._render();
  }

  _onBookItemClicked(event) {
        let bookElement = event.target.closest('[data-element="book-item"]');

        this._trigger('bookSelected', bookElement.dataset.bookName);
  }

  getBook(bookName) {
    for (let book of this._books) {
      if (book.name === bookName) {
        return book;
      }
    }
  }

  _render() {
    let itemsHtml = '';
    //let phones = this._filterTemplate ? this._filterByName() : this._phones;

    for (let book of this._books) {
      itemsHtml += `
        <li class="book_list__item"
            data-element="book-item"
            data-book-name="${ book.name }">

          <a href="#" class="book_list__link">
            "${ book.name }"
          </a>
          
        </li>
      `;
    }

    this._element.innerHTML = `
      <nav id="books_menu" class="position-center">
        <h2 id="books_menu_header" >Привет, ${ this.userLogin }</h2>
        <img id="books_menu_img" src="img/second_page.jpg" width="189" height="255" alt="books">
        <div id="books_menu_div">
          <ul id="book_list">${ itemsHtml }</ul>
          <a id="new_book_link" href="" onclick="addBook();return false;">Добавить новую книгу</a>
        </div>
      </nav>
    `;
  
  }
  
}