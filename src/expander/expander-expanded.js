import { component } from '@battr/battr-core';

component.define({
  selector: 'br-expander-expanded',
  controller: Controller
});

function Controller(element, attrs, helper) {
  var expanded = false;
  var expander;

  this.toggle = toggle;
  this.open = open;
  this.close = close;
  this.isOpen = isOpen;


  helper.findParent('br-expander', function (ctrl) {
    expander = ctrl;
  });

  function toggle(value) {
    console.log('toggle')
    if (expanded) { close(); }
    else { open(); }
  }

  function open() {
    expander.element.classList.add('br-open');
    element.classList.add('br-show');
    TweenLite.to(element, 0.2, {ease: Expo.easeOut, height: getHeight()});
    expanded = true;
  }

  function close() {
    expander.element.classList.remove('br-open');
    TweenLite.to(element, 0.2, {ease: Expo.easeOut, height: 0, onComplete: function () {
      element.classList.remove('br-show');
    }});
    expanded = false;
  }

  function getHeight() {
    var height = element.getAttribute('height');
    if (height) {
      return height.replace('px', '') + 'px';
    } else {
      return element.scrollHeight + 'px';
    }
  }

  function isOpen() {
    return expanded;
  }
}
