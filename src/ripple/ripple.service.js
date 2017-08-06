export function createRipple(element, config = {}) {
  // TODO add validation

  const RIPPLE_FADE_IN_DURATION = 450;
  const RIPPLE_FADE_OUT_DURATION = 400;
  const RIPPLE_STATE = {
    FADING_IN: 'FADING_IN',
    VISIBLE: 'VISIBLE',
    FADING_OUT: 'FADING_OUT',
    HIDDEN: 'HIDDEN'
  };

  const CENTERED = !!config.centered;
  const TIGGER_ELEMENT = config.tiggerElement || element;
  const SPEED_FACTOR = config.speedFactor || 1;
  const RADIUS = config.radius;
  const COLOR = config.color || null;
  const PERSISTENT = !!config.persistent;

  let activeRipples = new Set();
  let isMousedown = false;

  TIGGER_ELEMENT.addEventListener('mousedown', mousesdown);



  // --- Private ---

  function mousesdown(event) {
    isMousedown = true;
    TIGGER_ELEMENT.addEventListener('mouseup', mouseup);
    TIGGER_ELEMENT.addEventListener('mouseleave', mouseleave);
    fadeInRipple(event.pageX, event.pageY);
  }

  function mouseup(event) {
    isMousedown = false;
    // Fade-out all ripples that are completely visible and not persistent.
    activeRipples.forEach(ripple => {
      if (!ripple.config.persistent && ripple.state === RIPPLE_STATE.VISIBLE) {
        ripple.fadeOut();
      }
    });
    TIGGER_ELEMENT.removeEventListener('mouseup', mouseup);
    TIGGER_ELEMENT.removeEventListener('mouseleave', mouseleave);
  }


  function fadeInRipple(pageX, pageY) {
    let containerRect = element.getBoundingClientRect();

    if (CENTERED) {
      pageX = containerRect.left + containerRect.width / 2;
      pageY = containerRect.top + containerRect.height / 2;
    } else {
      // Subtract scroll values from the coordinates because calculations below
      // are always relative to the viewport rectangle.
      let scrollPosition = getViewportScrollPosition();
      pageX -= scrollPosition.left;
      pageY -= scrollPosition.top;
    }

    let radius = RADIUS || distanceToFurthestCorner(pageX, pageY, containerRect);
    let duration = RIPPLE_FADE_IN_DURATION * (1 / SPEED_FACTOR);
    let offsetX = pageX - containerRect.left;
    let offsetY = pageY - containerRect.top;

    let ripple = document.createElement('div');
    ripple.classList.add('br-ripple-element');

    ripple.style.left = `${offsetX - radius}px`;
    ripple.style.top = `${offsetY - radius}px`;
    ripple.style.height = `${radius * 2}px`;
    ripple.style.width = `${radius * 2}px`;

    // If the color is not set, the default CSS color will be used.
    ripple.style.backgroundColor = COLOR || null;
    ripple.style.transitionDuration = `${duration}ms`;

    element.appendChild(ripple);

    // By default the browser does not recalculate the styles of dynamically created
    // ripple elements. This is critical because then the `scale` would not animate properly.
    enforceStyleRecalculation(ripple);

    ripple.style.transform = 'scale(1)';

    // Exposed reference to the ripple that will be returned.
    let rippleRef = {
      config: {
        centered: CENTERED,
        tiggerElement: TIGGER_ELEMENT,
        speedFactor: SPEED_FACTOR,
        radius: radius,
        color: COLOR,
        persistent: PERSISTENT,
        duration: duration
      },
      element: ripple,
      fadeOut: fadeOut
    };

    function fadeOut() {
      fadeOutRipple(rippleRef);
    }

    rippleRef.state = RIPPLE_STATE.FADING_IN;

    // Add the ripple reference to the list of all active ripples.
    activeRipples.add(rippleRef);

    // Wait for the ripple element to be completely faded in.
    // Once it's faded in, the ripple can be hidden immediately if the mouse is released.
    setTimeout(() => {
      rippleRef.state = RIPPLE_STATE.VISIBLE;

      if (!PERSISTENT && !isMousedown) {
        rippleRef.fadeOut();
      }
    }, duration);

    return rippleRef;
  }

  function fadeOutRipple(rippleRef) {
    // For ripples that are not active anymore, don't re-un the fade-out animation.
    if (!activeRipples.delete(rippleRef)) { return; }

    let rippleEl = rippleRef.element;

    rippleEl.style.transitionDuration = `${RIPPLE_FADE_OUT_DURATION}ms`;
    rippleEl.style.opacity = '0';

    rippleRef.state = RIPPLE_STATE.FADING_OUT;
    // Once the ripple faded out, the ripple can be safely removed from the DOM.
    setTimeout(() => {
      rippleRef.state = RIPPLE_STATE.HIDDEN;
      rippleEl.parentNode.removeChild(rippleEl);
    }, RIPPLE_FADE_OUT_DURATION);
  }

  function mouseleave() {
    if (isMousedown) {
      mouseup();
    }
  }


  function distanceToFurthestCorner(x, y, rect) {
    const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
  }

  // TODO move this to a utility module
  function getViewportScrollPosition() {
    const documentRect = document.documentElement.getBoundingClientRect();

    // The top-left-corner of the viewport is determined by the scroll position of the document
    // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
    // whether `document.body` or `document.documentElement` is the scrolled element, so reading
    // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
    // `document.documentElement` works consistently, where the `top` and `left` values will
    // equal negative the scroll position.
    const top = -documentRect.top || document.body.scrollTop || window.scrollY || document.documentElement.scrollTop || 0;
    const left = -documentRect.left || document.body.scrollLeft || window.scrollX || document.documentElement.scrollLeft || 0;

    return {top, left};
  }

  /** Enforces a style recalculation of a DOM element by computing its styles. */
  // TODO(devversion): Move into global utility function.
  function enforceStyleRecalculation(element) {
    // Enforce a style recalculation by calling `getComputedStyle` and accessing any property.
    // Calling `getPropertyValue` is important to let optimizers know that this is not a noop.
    // See: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    window.getComputedStyle(element).getPropertyValue('opacity');
  }
}
