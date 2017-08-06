import { component } from '@battr/battr-core';
import { createRipple } from '../ripple/ripple.service'

component.define({
  selector: `br-button, button[br-button],
             br-raised-button, button[br-raised-button],
             br-icon-button, button[br-icon-button],
             br-fab, button[br-fab],
             br-mini-fab, button[br-mini-fab]`,
  template: `<button class="br-button">
      <span class="br-button-content"><transpose></transpose></span>
      <div class="br-button-ripple br-ripple"></div>
      <div class="br-button-focus-overlay"></div>
    </button>`,
  replace: true,
  transfer: true,
  compile: compile,
  controller: BattrButtonController
});

function compile(element) {
  // convert from custom tag/attribute to button + classname
  if (element.hasAttribute('br-raised-button')) { element.classList.add('br-raised-button'); }
  else if (element.nodeName === 'BR-RAISED-BUTTON') { element.classList.add('br-raised-button'); }
  else if (element.hasAttribute('br-icon-button')) { element.classList.add('br-icon-button'); }
  else if (element.nodeName === 'BR-ICON-BUTTON') { element.classList.add('br-icon-button'); }
  else if (element.hasAttribute('br-fab')) { element.classList.add('br-fab'); }
  else if (element.nodeName === 'BR-FAB') { element.classList.add('br-fab'); }
  else if (element.hasAttribute('br-mini-fab')) { element.classList.add('br-mini-fab'); }
  else if (element.nodeName === 'BR-MINI-FAB') { element.classList.add('br-mini-fab'); }
}

function BattrButtonController(model, element) {
  createRipple(element.querySelector('.br-button-ripple'), {
    tiggerElement: element
  });
}
