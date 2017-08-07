import { component, util } from '@battr/battr-core';
// TODO add ripple
// import { createRipple } from '../ripple/ripple.service'

const TransitionCheckState = {
  Init: 'Init',
  Checked: 'Checked',
  Unchecked: 'Unchecked',
  Indeterminate: 'Indeterminate'
};

component.define({
  selector: 'br-checkbox',
  model: false,
  // TODO implamnet template url
  template: `<label class="br-checkbox-layout">
    <div class="br-checkbox-inner-container">
      <input class="br-checkbox-input cdk-visually-hidden" type="checkbox">
      <!-- <div md-ripple class="br-checkbox-ripple"></div> -->
      <div class="br-checkbox-frame"></div>
      <div class="br-checkbox-background">
        <svg version="1.1"
             focusable="false"
             class="br-checkbox-checkmark"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24"
             xml:space="preserve">
          <path class="br-checkbox-checkmark-path"
                fill="none"
                stroke="white"
                d="M4.1,12.7 9,17.6 20.3,6.3"/>
        </svg>
        <!-- Element for rendering the indeterminate state checkbox. -->
        <div class="br-checkbox-mixedmark"></div>
      </div>
    </div>
    <span class="br-checkbox-label">
      <!-- Add an invisible span so JAWS can read the label -->
      <span class="br-hide">&nbsp;</span>
      <transpose></transpose>
    </span>
  </label>`,
  compile: compile,
  controller: Controller
});

function compile(element) {
  // add default theme color if none exist
  if (!element.classList.contains('br-primary') && !element.classList.contains('br-accent') && !element.classList.contains('br-warn')) {
    element.classList.add('br-accent');
  }

  // set default value
  element.value = false;
  element.setAttribute('value', false);
}

function Controller(element, observeAttr) {
  var disabled = false;
  var indeterminate = false; // TODO figure out how to implament this. This is also reffered to as `mixed` mode
  var checked;
  var oldState = TransitionCheckState.Unchecked;
  var currentAnimationClass = '';

  observeAttr('disabled', value => { disabled = value; });
  observeAttr('value', value => {
    checked = util.parseDataType(value, 'boolean');
    setStyle();
  });

  element.querySelector('.br-checkbox-input').addEventListener('click', event => {
    event.stopPropagation();

    // this._removeFocusRipple();

    if (disabled) { return; }
    // When user manually click on the checkbox, `indeterminate` is set to false.
    handleInterminate();
    checked = !checked;
    element.value = checked;
    element.setAttribute('value', checked);
  });

  function handleInterminate() {
    if (indeterminate) {
      indeterminate = false;
      // indeterminateChange.emit(this._indeterminate);
    }
  }



  // --- style and animation ---

  function setStyle() {
    transitionCheckState(checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);

    if (checked) {
      element.classList.add('br-checkbox-checked');
    } else {
      element.classList.remove('br-checkbox-checked');
    }
  }

  function transitionCheckState(newState) {
    if (oldState === newState) { return; }
    if (currentAnimationClass.length > 0) {
      element.classList.remove(currentAnimationClass);
    }

    currentAnimationClass = getAnimationClassForCheckStateTransition(oldState, newState);
    oldState = newState;

    if (currentAnimationClass.length > 0) {
      element.classList.add(currentAnimationClass);
    }
  }

  function getAnimationClassForCheckStateTransition(oldState, newState) {
    let animSuffix = '';

    switch (oldState) {
      case TransitionCheckState.Init:
        // Handle edge case where user interacts with checkbox that does not have [(ngModel)] or
        // [checked] bound to it.
        if (newState === TransitionCheckState.Checked) {
          animSuffix = 'unchecked-checked';
        } else if (newState == TransitionCheckState.Indeterminate) {
          animSuffix = 'unchecked-indeterminate';
        } else {
          return '';
        }
        break;
      case TransitionCheckState.Unchecked:
        animSuffix = newState === TransitionCheckState.Checked ?
            'unchecked-checked' : 'unchecked-indeterminate';
        break;
      case TransitionCheckState.Checked:
        animSuffix = newState === TransitionCheckState.Unchecked ?
            'checked-unchecked' : 'checked-indeterminate';
        break;
      case TransitionCheckState.Indeterminate:
        animSuffix = newState === TransitionCheckState.Checked ?
            'indeterminate-checked' : 'indeterminate-unchecked';
        break;
    }

    return `br-checkbox-anim-${animSuffix}`;
  }
}
