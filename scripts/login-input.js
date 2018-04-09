import Component from './component.js';

export default class LoginInput extends Component {
  
    constructor({element}) {
		console.log("--LoginInput--");
	super(element);

	this._render();
	
	//assign handler of Enter button
	this.on('click', this._triggerEnter.bind(this), '[data-element="enter-btn"]');
      
      
    }
    
    _render() {
      
	this._element.innerHTML  = `
				  <img id="welcom_picture" src="img/Read Something Good.jpg" alt="Read Something Good">
				  <div id="login">
				    <label >
				      Введите имя <input id="login_input" type="text">
				    </label>
				    <button data-element="enter-btn">Вход</button>
				  </div>`;
		  
    }
    
    // handler of Enter button
    _triggerEnter() {
    	console.log(document.querySelector('#login_input').name);
		let userLogin =  document.querySelector('#login_input').value;
		console.log("userLogin1 ", userLogin);
		//создаем customEvent, инициируем и передаем через него login
		this._trigger('enterBtnClicked', userLogin);
    }
  
} 
