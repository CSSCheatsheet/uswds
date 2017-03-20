'use strict';
var select = require('../utils/select');

var SELECTOR_BUTTON = 'ul > li > button, .usa-accordion-button';
var SELECTOR_BUTTON_EXPANDED = SELECTOR_BUTTON
  .split(', ')
  .map(function (selector) {
    return selector + '[aria-expanded=true]';
  })
  .join(', ');

/**
 * @name showPanelListener
 * @desc The event handler for clicking on a button in an accordion.
 * @param {HTMLElement} el - An HTML element most likely a <button>.
 * @param {Object} ev - A DOM event object.
 */
function showPanelListener (el, ev) {
  var expanded = el.getAttribute('aria-expanded') === 'true';
  this.hideAll();
  if (!expanded) {
    this.show(el);
  }
  return false;
}

function getTargetOf (button) {
  var id = button.getAttribute('aria-controls');
  var target = document.getElementById(id);
  if (target) {
    return target;
  } else {
    throw new Error('No accordion button target with id "' + id + '" exists');
  }
}

/**
 * @class Accordion
 *
 * An accordion component.
 *
 * @param {HTMLElement} el An HTMLElement to turn into an accordion.
 */
function Accordion (el) {
  var self = this;
  this.root = el;

  // delegate click events on each <button>
  this.$(SELECTOR_BUTTON).forEach(function (button) {
    if (button.attachEvent) {
      button.attachEvent('onclick', showPanelListener.bind(self, button));
    } else {
      button.addEventListener('click', showPanelListener.bind(self, button));
    }
  });

  // find the first expanded button
  var expanded = this.select(SELECTOR_BUTTON_EXPANDED);
  this.hideAll();
  if (expanded !== undefined) {
    this.show(expanded);
  }
}

/**
 * @param {String} selector
 * @return {Element}
 */
Accordion.prototype.select = function (selector) {
  return this.$(selector)[ 0 ];
};

/**
 * @param {String} selector
 * @return {Array.HTMLElement}
 */
Accordion.prototype.$ = function (selector) {
  return select(selector, this.root);
};

/**
 * @param {HTMLElement} button
 * @return {Accordion}
 */
Accordion.prototype.hide = function (button) {
  var target = getTargetOf(button);
  button.setAttribute('aria-expanded', false);
  target.setAttribute('aria-hidden', true);
  return this;
};

/**
 * @param {HTMLElement} button
 * @return {Accordion}
 */
Accordion.prototype.show = function (button) {
  var target = getTargetOf(button);
  button.setAttribute('aria-expanded', true);
  target.setAttribute('aria-hidden', false);
  return this;
};

/**
 * @return {Accordion}
 */
Accordion.prototype.hideAll = function () {
  var self = this;
  this.$(SELECTOR_BUTTON).forEach(function (button) {
    self.hide(button);
  });
  return this;
};

module.exports = Accordion;
