export default class Component {
  constructor(element) {
    this._element = element;
  }

  on(eventName, callback, selector = '') {
    this._element.addEventListener(eventName, (event) => {
      if (selector && !event.target.closest(selector)) {
        return;
      }

      callback(event);
    });
  }

  off(eventName, callback) {
    this._element.removeEventListener(eventName, callback);
  }

  _trigger(eventName, data) {
    let customEvent = new CustomEvent(eventName, {
      detail: data,
    });

    this._element.dispatchEvent(customEvent);
  }

  hide() {
    this._element.classList.add('hidden');
  }

  show() {
    this._element.classList.remove('hidden');
  }
}
