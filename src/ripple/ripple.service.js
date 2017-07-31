export function createRipple(element, config = {}) {
  // TODO add validation

  let activeRipples = [];
  let isMousedown = false;
  const centered = !!config.centered;
  const tiggerElement = config.tiggerElement || element;
  const triggerEvents = {
    mousedown: tiggerElement.addEventListener('mousedown', mousesown),
    mouseup: tiggerElement.addEventListener('mouseup', mouseup),
    mouseleave: tiggerElement.addEventListener('mouseleave', mouseleave)
  };



  // --- Private ---

  function mousesown(event) {
    isMousedown = true;
    fadeInRipple(event.pageX, event.pageY);
  }

  function mouseup(event) {

  }

  function mouseleave(event) {

  }


  function fadeInRipple(pageX, pageY) {
    let containerRect = element.getBoundingClientRect();

    if (centered) {
      pageX = containerRect.left + containerRect.width / 2;
      pageY = containerRect.top + containerRect.height / 2;
    } else {
      // Subtract scroll values from the coordinates because calculations below
      // are always relative to the viewport rectangle.
      let scrollPosition = getViewportScrollPosition();
      pageX -= scrollPosition.left;
      pageY -= scrollPosition.top;
    }

    let radius = config.radius || distanceToFurthestCorner(pageX, pageY, containerRect);
    let duration = RIPPLE_FADE_IN_DURATION * (1 / (config.speedFactor || 1));
    let offsetX = pageX - containerRect.left;
    let offsetY = pageY - containerRect.top;

    let ripple = document.createElement('div');
    ripple.classList.add('br-ripple-element');

    ripple.style.left = `${offsetX - radius}px`;
    ripple.style.top = `${offsetY - radius}px`;
    ripple.style.height = `${radius * 2}px`;
    ripple.style.width = `${radius * 2}px`;

    // If the color is not set, the default CSS color will be used.
    ripple.style.backgroundColor = config.color || null;
    ripple.style.transitionDuration = `${duration}ms`;

    element.appendChild(ripple);

    // By default the browser does not recalculate the styles of dynamically created
    // ripple elements. This is critical because then the `scale` would not animate properly.
    enforceStyleRecalculation(ripple);

    // Exposed reference to the ripple that will be returned.
    let rippleRef = {
      fadeOut: () => {
        fadeOutRipple(ripple);
      }
    };

    rippleRef.state = 'fadingIn';

    // Add the ripple reference to the list of all active ripples.
    activeRipples.push(rippleRef);

    // Wait for the ripple element to be completely faded in.
    // Once it's faded in, the ripple can be hidden immediately if the mouse is released.
    setTimeout(() => {
      rippleRef.state = 'visible';

      if (!config.persistent && !this._isMousedown) {
        rippleRef.fadeOut();
      }
    }, duration);

    return rippleRef;
  }


  function distanceToFurthestCorner(x, y, rect) {
    const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
  }
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
