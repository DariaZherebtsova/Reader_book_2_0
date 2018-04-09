
import Component from './component.js';

export default class BookProgress extends Component {
  constructor({element, dataBook}) {
    console.log("--BookProgress--");
    super(element);

    this.dataBook = dataBook;

    this._createTable();
    this._createGraph();
  }

  _createTable() {

  	//узнаем кол-во строк и столбцов

  	let numPages = this.dataBook.numPages;
  	let numDay = this.dataBook.numDay;
	let sStartDate = this.dataBook.date;

	let columns = 3;
	let rows = numDay;

	//сколько читать в день
	let numPagesDay = Math.ceil(numPages/numDay);

	//расшифровываем дату
	//разбиваем строку на элементы
	let dateParts = sStartDate.split('-');    
	//создаем переменную типа Date
	let startDate = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0], 0, 0, 0);
	console.log("00 ",startDate.getDate()+'-'+(startDate.getMonth()+1)+'-'+startDate.getFullYear());
	//почему-то месяц получается +1
	//отнимаем один, чтобы потом в цикле всем прибавлять
	startDate.setDate(startDate.getDate()-1);
	console.log("+1 ",startDate.getDate()+'-'+(startDate.getMonth()+1)+'-'+startDate.getFullYear());

	let currentDate = startDate;

	let nextDate = function() {
		currentDate.setDate(currentDate.getDate()+1);
		return currentDate.getDate()+'-'+(currentDate.getMonth()+1)+'-'+currentDate.getFullYear();
	}

	console.log("nextDate() ",nextDate());
	console.log("nextDate() ",nextDate());
	console.log("currentDate ",currentDate);
	
	let userData = (i) => {
	    //если есть пользов. данные		 
	    if (i < this.dataBook.user_data.length)
	    {
		    return this.dataBook.user_data[i];
	    } 
	    
	    return "  ";
	}

	let table_body = `
  		<tr>
		  	<th>дата</th>
		  	<th>кол-во
				стр</th>
			<th>кол-во
				стр</th>
		</tr>`;

	for (var i = 0; i < rows; i++) {
	  
	  table_body += `
		<tr>
			<td>${ nextDate() }</td>
			<td>${ numPagesDay }</td>
			<td>${ userData(i) }</td>   
		</tr>`;
	}	

	//console.log(table_body);

    let articleHTML = `
      <article>
        <h2 id="article_header">${this.dataBook.name}</h2>
        <h3 id="table_title">План чтения</h3>
        <div class="inline" id="for_table">
          <table>${ table_body }</table>
        </div>
      </article>
    `;

    this._element.insertAdjacentHTML("beforeEnd",articleHTML);

  }

  //====================== График ===============================================

  _createGraph(){

      const numPages = this.dataBook.numPages;
      const numDay = this.dataBook.numDay;
      console.log("numPages ",numPages);
      console.log("numDay ",numDay);

      let margin = {top: -5, right: -5, bottom: -5, left: -5},
          width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      let grHeight = 500,
          grWidth = 800,
          grMargin = 20,
          grMarginX = 50,
          scaleUserData=[],
          scaleControlData=[];


      let user_data = this.dataBook.user_data;
      console.log("user_data ",user_data);

      //сколько читать в день
      let numPagesDay = Math.ceil(numPages/numDay);
      console.log("numPagesDay ",numPagesDay);

      this._element.querySelector('article').insertAdjacentHTML("beforeEnd",'<div class=\"inline\" id=\"for_graph\"></div>');

       //для зума
      let zoom = d3.zoom()
          .scaleExtent([1, 10])
          .on("zoom", zoomed);

      // создание объекта svg
      let svg = d3.select("#for_graph").append("svg")
          .attr("class", "axis")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("class", "graphAllElem")
          .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
          .call(zoom);

      let rect = svg.append("rect")
          .attr("width", width)
          .attr("height", height)
          .style("fill", "none")
          .style("pointer-events", "all");

      let container = svg.append("g");

      // длина оси X = ширина контейнера svg - отступ слева и справа
      let xAxisLength = grWidth - 2 * grMargin;
      console.log("xAxisLength ",xAxisLength);

      // длина оси Y = высота контейнера svg - отступ сверху и снизу
      let yAxisLength = grHeight - 2 * grMargin - 20;
      console.log("yAxisLength ",yAxisLength);

      // функция интерполяции значений на ось Х
      let scaleX = d3.scaleLinear()
          .domain([0, numDay])
          .range([0, xAxisLength]);

      // функция интерполяции значений на ось Y
      let scaleY = d3.scaleLinear()
          .domain([numPages, 0])
          .range([0, yAxisLength]);

      // масштабирование реальных данных в данные для нашей координатной системы
      let page_number = 0;
      for(let i=0; i<user_data.length; i++)  {
          //кол-во страниц, прочитанное к i-ому дню
          page_number = page_number + user_data[i];
          //console.log("page_number ",page_number);
          scaleUserData.push({x: scaleX(i+1)+grMarginX, y: scaleY(page_number) + grMargin});
      }
      console.log("scaleUserData ",scaleUserData);


      page_number = 0;
      for(let i=0; i<user_data.length; i++)  {
          //кол-во страниц, которое надо прочитать к i-ому дню
          page_number = page_number + numPagesDay;
          //console.log("page_number ",page_number);
          scaleControlData.push({x: scaleX(i+1)+grMarginX, y: scaleY(page_number) + grMargin});
      }
      console.log("scaleControlData ",scaleControlData);

      // создаем ось X
      let xAxis = d3.axisBottom()
          .scale(scaleX) // функция интерполяции
          .ticks(10); // сколько делений на оси

      // создаем ось Y
      let yAxis = d3.axisLeft()
          .scale(scaleY)
          .ticks(6);

      // отрисовка оси Х
      container.append("g")
          .attr("class", "x-axis")
          .attr("transform",  // сдвиг оси вниз и вправо
              "translate(" + grMarginX + "," + (grMargin+yAxisLength) + ")")
          .call(xAxis);

      // отрисовка оси Y
      container.append("g")
          .attr("class", "y-axis")
          .attr("transform", // сдвиг оси вниз и вправо на margin
              "translate(" + grMarginX + "," + grMargin + ")")
          .call(yAxis);

      // обща функция для создания графиков
      function createChart (data, colorStroke, label){

          // функция, создающая по массиву точек линии
          var line = d3.line()
              .x(function(d){return d.x;})
              .y(function(d){return d.y;});
          // добавляем путь
          container.append("path")
              .attr("d", line(data))
              .style("fill", "none")
              .style("stroke", colorStroke)
              .style("stroke-width", 2);

      }

      createChart(scaleUserData, "steelblue", "user");
      createChart(scaleControlData, "#FF7F0E", "norm");

      function zoomed() {
          console.log("zoooooooooooooooooooooom");
          //container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
          container.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
      }

  }
}  