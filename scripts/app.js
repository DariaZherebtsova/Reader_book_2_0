'use strict';
console.log("--app.js--");
import PageBody from './page-body.js'

let pageBody = new PageBody({
    element: document.querySelector('[data-page-body]')
});