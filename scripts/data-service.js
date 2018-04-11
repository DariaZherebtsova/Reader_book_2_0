
'use strict';

const BASE_API_URL = 'https://dariazherebtsova.github.io/Reader_book_2_0';

//const BASE_API_URL = 'http://localhost:8080';

export default class DataService {

    static getBooks( userLogin ) {

        let url = BASE_API_URL + '/data/books.json';


        return fetch(url)
        	.then((response) => response.json())
        	.then((books) => {
        		if (userLogin) {
	        	//пройтись по массиву books
	    	    //найти элемент с нужным логин
	    	    let login_number = -1;
        		//цикл по массиву записей для разных логинов
				for (let i=0; i<books.length; i++ ) {
					console.log("json login ", books[i].login );	
					//ищем нужный логин
					if (books[i].login == userLogin) {
						login_number = i;		
						
						//выходим из цикла
						i = books.length;
					}						
				}

				if (login_number != -1) {
					console.log("Contact!");
					console.log(books[login_number].books);
					return books[login_number].books;
				}
				else return [];
        
      		}
        });	    
    }

    static sendRequest(url) {

	    return new Promise(
	        (resolve, reject) => {

			    let xhr = new XMLHttpRequest();

			    xhr.open('GET', url, true);

			    xhr.send();

	    		xhr.onload = function() {

	      			if (xhr.status !== 200) {

						reject(xhr.status + ': ' + xhr.statusText);

	      			} else {

						resolve(JSON.parse(xhr.responseText));
	      			}
	    		};
	  		}
		);
    }
    
}
