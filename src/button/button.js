import { component } from '@battr/battr-core';
import { createRipple } from '../ripple/ripple.service'

component.define({
  selector: 'br-button, button[br-button]',
  template: `<button class="br-button">
      <span class="br-button-content"><transpose></transpose></span>
      <div class="br-button-ripple"></div>
      <div class="br-button-focus-overlay"></div>
    </button>`,
  replace: true,
  transfer: true,
  controller: BattrButtonController
});


function BattrButtonController(model, element) {
  const content = element.querySelector('.br-button-content');
  const rippleContianer = element.querySelector('.br-button-ripple');
  const overlayContianer = element.querySelector('.br-button-overlay');
}
