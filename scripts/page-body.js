
import LoginInput from './login-input.js'
import BooksList from './books-list.js'
import DataService from './data-service.js'
import BookProgress from './book-progress.js'

export default class PageBody {
    
    constructor( { element }) {
		
		console.log("--PageBody--");
		
        this._element = element;

        this._render();//do nothing
	
		this._initLoginInput();
        
    }
    
    
    _initLoginInput() {
	this._loginInput = new LoginInput({element: this._element});
	
	this._loginInput.on('enterBtnClicked', (event) => {
	  
	    //сохранить логин
	    PageBody.userLogin = event.detail; 
	  
	    //создаем booksList на месте loginInput
	    this._initBooksList(PageBody.userLogin);
	    //он запишет в element data-page-body новый HTML и loginInput не будет
	});
    }
    
    
    _initBooksList(userLogin) {

        console.log("_initBooksList login ", userLogin);

        console.log("_initBooksList this ", this);

        this._booksList = new BooksList({
            element: this._element,
	        userLogin: userLogin
        });

        //получаем данные о книгах текущего userLogin
        let booksPromise = DataService.getBooks(userLogin);

        //отображем список книг
        booksPromise.then(this._showBooks.bind(this));

        //событие "Выбрана книга"
        this._booksList.on('bookSelected', (event) => {
            const bookName = event.detail;
            console.log("_initBooksList bookSelected ", bookName);

            //красивое перемещение меню в бок
            $('#books_menu').animate({ //выбираем класс menu и метод animate
     
                left: '10px' /* теперь меню изменит свое положение left:10px */
                    
                }, 200); //скорость движения меню в мс            

            $('#books_menu').removeClass("position-center").addClass("position-left");
            $('#books_menu_img').css('padding-left','20px');
            $('.book_list__link').css('max-width','150px');


            //данные для выбранной книги
            let dataBook = this._booksList.getBook(bookName);
            console.log("dataBook ", dataBook);

            //создаем пространство для таблицы и графика
            this._initBookProgress(dataBook);

        });

    }

    _initBookProgress(dataBook) {
        this._bookProgress = new BookProgress({
            element: this._element,
            dataBook: dataBook
        });
    }

    _showBooks(books) {
        console.log("PageBody _showBooks");
        console.log(books);
        this._booksList.setBooks(books);
    }

    _render() {
        // ... render page template
    }
}




