import { component } from '@battr/battr-core';

component.define({
  selector: 'br-button, button[br-button]',
  template: '<button class="br-button"><transpose></transpose></button>',
  replace: true,
  transfer: true
});
