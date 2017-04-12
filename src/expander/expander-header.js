import { component } from '@battr/battr-core';
component.define({
  selector: 'br-expander-header',
  controller: controller
});


function controller(element, attrs, helper) {
  helper.findParent('br-expander', function (ctrl) {
    element.addEventListener('click', ctrl.toggle);
  });
}
