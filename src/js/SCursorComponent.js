import SWebComponent from 'coffeekraken-sugar/js/core/SWebComponent'
import addEventListener from 'coffeekraken-sugar/js/dom/addEventListener'
import requestAnimationFrame from 'coffeekraken-sugar/js/dom/requestAnimationFrame'
import querySelectorLive from 'coffeekraken-sugar/js/dom/querySelectorLive'
import anime from 'animejs'
import offset from 'coffeekraken-sugar/js/dom/offset'
import getStyleProperty from 'coffeekraken-sugar/js/dom/getStyleProperty'
import scrollTop from 'coffeekraken-sugar/js/dom/scrollTop'
import scrollLeft from 'coffeekraken-sugar/js/dom/scrollLeft'
import dispatchEvent from 'coffeekraken-sugar/js/dom/dispatchEvent'

/**
 * Build highly customizable cursor with ease that can interact with the HTMLElements in your page
 *
 * @example    html
 * <s-cursor>
 *   <!-- this is the pointer element that display at least a tiny dot or something to help the user click where he wants -->
 *   <div class="cursor-pointer" cursor-pointer></div>
 *   <!-- this is an optional element that can interact with the HTMLElement page like sticking to it, resizing, etc... -->
 *   <div class="cursor-sticked" cursor-sticked></div>
 * </s-cursor>
 *
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
 * @see    https://tympanus.net/codrops/2019/01/31/custom-cursor-effects/
 */
export default class SCursorComponent extends SWebComponent {
  /**
   * Default props
   * @definition    SWebComponent.defaultProps
   * @protected
   */
  static get defaultProps() {
    return {
      /**
       * Specify if need to hide the default cursor or not
       * @prop
       * @type    {Boolean}
       */
      hideDefaultCursor: false,

      /**
       * Specify if want to enable the focus support or not
       * @prop
       * @type    {Boolean}
       */
      enableFocus: false,

      /**
       * Specify the pointer follow mouse animation duration in ms
       * @prop
       * @type    {Integer}
       */
      pointerFollowMouseAnimationDuration: 100,

      /**
       * Specify the sticked follow mouse animation duration in ms
       * @prop
       * @type    {Integer}
       */
      stickedFollowMouseAnimationDuration: 200
    }
  }

  /**
   * Physical props
   * @definition    SWebComponent.physicalProps
   * @protected
   */
  static get physicalProps() {
    return []
  }

  /**
   * Css
   * @protected
   */
  static defaultCss(componentName, componentNameDash) {
    return `
      [cursor] {
        outline: none;
      }
      body.hide-cursor,
      body.hide-cursor [cursor],
      body.hide-cursor ${componentNameDash} {
        cursor: none !important;
      }
      ${componentNameDash} {
        display : inline-block;
        position: fixed;
        top: 0; left: 0;
        pointer-events: none;
      }
    `
  }

  /**
   * Register a cursor handler
   * A handler function is the function that update in any way the `$sticked` element
   * in order to fit, encircle, or whatever you prefer the `$target` HTMLElement that has
   * a `cursor` attribute.
   * If my handler function is named "coolEffect", it will be triggered on HTMLElement that
   * have the attribute `cursor="coolEffect"`.
   *
   * @param    {String}    name    The handler name
   * @param    {Function}    handler    The handler function
   *
   * @example    js
   * SCursorComponent.registerHandler('my-cool-handler', ($sticked, $target) => {
   *   // do something with the sticked and the target element
   *   return stickedInitialSize => {
   *     // stickedInitialSize.width
   *     // stickedInitialSize.height
   *     // do the opposite of what you've done in the previous phase.
   *     // this function need to simply undo what you've done in the handler
   *   }
   * })
   */
  static registerHandler(name, handler) {
    // store the handler into the stack
    if (!SCursorComponent._handlers) SCursorComponent._handlers = {}
    SCursorComponent._handlers[name] = handler
  }

  /**
   * Register some elements to be inited with a particular handler
   * @param    {String}    handler    The handler to use on these elements
   * @param    {String}    selector    The css selector that is used to match the items in the DOM
   * @param    {String}    [cursorClass=null]    An optional class to apply on the cursor when the target element is "focused"
   *
   * @example    js
   * SCursorComponent.applyHandlerOn('fit', '.btn')
   */
  static applyHandlerOn(handler, selector, cursorClass = null) {
    querySelectorLive(selector, $elm => {
      // apply the handler on the element
      $elm.setAttribute('cursor', handler)
      // if has a cursor class, add it as well
      if (cursorClass) {
        $elm.setAttribute('cursor-class', cursorClass)
      }
    })
  }

  /**
   * Component will mount
   * @definition    SWebComponent.componentWillMount
   * @protected
   */
  componentWillMount() {
    super.componentWillMount()
    // get some references
    this._$pointer = this.querySelector('[cursor-pointer]')
    this._$sticked = this.querySelector('[cursor-sticked]')
    // if need to hide the default cursor
    if (this.props.hideDefaultCursor) {
      document.body.classList.add('hide-cursor')
    }
    // aria attribute
    this.setAttribute('aria-hidden', true)
  }

  /**
   * Mount component
   * @definition    SWebComponent.componentMount
   * @protected
   */
  componentMount() {
    super.componentMount()

    // init mouse position
    this._mousePos = {
      x: 0,
      y: 0
    }

    // get initial size
    this._stickedInitialSize = {
      width: this._$sticked ? this._$sticked.offsetWidth : 0,
      height: this._$sticked ? this._$sticked.offsetHeight : 0
    }

    // listen for mouse move to update the this._mousePos values
    this._removeMouseMoveHandler = addEventListener(
      document,
      'mousemove',
      this._mouseMoveHandler.bind(this)
    )

    // request animation frame to update the cursor position as quickly as possible
    requestAnimationFrame(this._setCursorPointerPosition.bind(this))

    // get all the "cursor" marked elements on the page
    this._cursorElmStack = []
    querySelectorLive('[cursor]', $cursor => {
      // add the tabindex attribute if not already present
      if (!$cursor.hasAttribute('tabindex') && this.props.enableFocus) {
        $cursor.setAttribute('tabindex', 0)
      }
      // add to the stack
      if (this._cursorElmStack.indexOf($cursor) === -1) {
        this._cursorElmStack.push({
          $elm: $cursor,
          mouseEnterListener: addEventListener(
            $cursor,
            'mouseenter',
            this._cursorMouseEnterHandler.bind(this)
          ),
          mouseLeaveListener: addEventListener(
            $cursor,
            'mouseleave',
            this._cursorMouseLeaveHandler.bind(this)
          ),
          focusListener: addEventListener(
            $cursor,
            'focus',
            this._cursorFocusHandler.bind(this)
          ),
          blurListener: addEventListener(
            $cursor,
            'blur',
            this._cursorBlurHandler.bind(this)
          )
        })
      }
    })
  }

  /**
   * Component unmount
   * @definition    SWebComponent.componentUnmount
   * @protected
   */
  componentUnmount() {
    super.componentUnmount()

    if (this._removeMouseMoveHandler) {
      this._removeMouseMoveHandler()
    }

    this._cursorElmStack.forEach(cursorElm => {
      if (cursorElm.mouseEnterListener) {
        cursorElm.mouseEnterListener()
      }
      if (cursorElm.mouseLeaveListener) {
        cursorElm.mouseLeaveListener()
      }
      if (cursorElm.focusListener) {
        cursorElm.focusListener()
      }
      if (cursorElm.blurListener) {
        cursorElm.blurListener()
      }
    })
  }

  /**
   * Component will receive prop
   * @definition    SWebComponent.componentWillReceiveProp
   * @protected
   */
  componentWillReceiveProp(name, newVal, oldVal) {
    super.componentWillReceiveProp(name, newVal, oldVal)
  }

  /**
   * When the mouse enter a target
   * @param    {MouseEvent}    e    The mouse event
   */
  _cursorMouseEnterHandler(e) {
    // focus the target
    this._focusTarget(e.target)
  }

  /**
   * When the mouse leave a target
   * @param    {MouseEvent}    e    The mouse event
   */
  _cursorMouseLeaveHandler(e) {
    // unfocus target
    this._unfocusTarget(e.target)
  }

  /**
   * Focus the target. Mean that we call the handler, we set the sticked as sticked and we
   * add the "cursor-class" if exist on the target
   * @param    {HTMLElement}    $target    The target to focus
   */
  _focusTarget($target) {
    // get the handler
    const handler = $target.getAttribute('cursor')
    // check that this handler exist in the handlers stack
    if (!SCursorComponent._handlers[handler]) return
    // set stick class and status
    this._stickSticked()
    // check if the target has a cursor-class attribute
    if ($target.hasAttribute('cursor-class')) {
      this.classList.add($target.getAttribute('cursor-class'))
    }
    // add the handler name as a class
    this.classList.add(handler)
    // execute the handler if we have a sticked element
    if (this._$sticked) {
      anime.remove(this._$sticked)
      this._reverseHandlerFn = SCursorComponent._handlers[handler](
        this._$sticked,
        $target
      )
    }
    /**
     * @event
     * @name    sticked
     * Dispatched when the "sticked" element is bein sticked to the target
     * @param    {HTMLElement}    $sticked    The sticked element. Can be null
     * @param    {HTMLElement}    $target    The target element
     */
    dispatchEvent(this, 'sticked', {
      $sticked: this._$sticked,
      $target
    })
  }

  /**
   * Unfoxus the target
   * @param    {HTMLElement}    $target    The target to unfocus
   */
  _unfocusTarget($target) {
    // get the handler name from the target
    const handler = $target.getAttribute('cursor')
    // check if the target has a cursor-class attribute
    if ($target.hasAttribute('cursor-class')) {
      this.classList.remove($target.getAttribute('cursor-class'))
    }
    // remove the handler class
    this.classList.remove(handler)
    // if a reverse handler function exist, launch it
    if (this._reverseHandlerFn) this._reverseHandlerFn(this._stickedInitialSize)
    // unstick the cursor
    this._unstickSticked()
    /**
     * @event
     * @name    sticked
     * Dispatched when the "sticked" element is bein unsticked from the target
     * @param    {HTMLElement}    $sticked    The sticked element. Can be null
     * @param    {HTMLElement}    $target    The target element
     */
    dispatchEvent(this, 'unsticked', {
      $sticked: this._$sticked,
      $target
    })
  }

  /**
   * Flag the sticked element as sticked and add classes
   */
  _stickSticked() {
    // flag the cursor as sticked
    this._sticked = true
    // add the sticked class
    this.classList.add('sticked')
  }

  /**
   * Flag the sticked element as unsticked and remove classes
   */
  _unstickSticked() {
    // flag the cursor as unsticked
    this._sticked = false
    // add the sticked class
    this.classList.remove('sticked')
  }

  /**
   * Mouse move handler
   * @param    {MouseEvent}    e     The mouse move event
   */
  _mouseMoveHandler(e) {
    this._mousePos = {
      x: e.clientX,
      y: e.clientY
    }
  }

  /**
   * When an element in the page has the focus
   * @param    {Event}    e    The focus event
   */
  _cursorFocusHandler(e) {
    // make sure we have the focus support enabled
    if (!this.props.enableFocus) return
    // focus the target
    this._focusTarget(e.target)
  }

  /**
   * When an element that has been focused is bein blured
   * @param    {Event}    e    The blur event
   */
  _cursorBlurHandler(e) {
    // make sure we have the focus support enabled
    if (!this.props.enableFocus) return
    // unfocus the target
    this._unfocusTarget(e.target)
  }

  /**
   * Set the cursor position
   */
  _setCursorPointerPosition() {
    if (this._$pointer) {
      anime({
        targets: this._$pointer,
        left: this._mousePos.x,
        top: this._mousePos.y,
        duration: this.props.pointerFollowMouseAnimationDuration
      })
    }
    if (this._$sticked && !this._sticked) {
      anime({
        targets: this._$sticked,
        left: this._mousePos.x,
        top: this._mousePos.y,
        duration: this.props.stickedFollowMouseAnimationDuration
      })
    }
    requestAnimationFrame(this._setCursorPointerPosition.bind(this))
  }
}

/**
 * @name    fit
 * @setting
 * Simple fit handler that animate the [cursor-sticked] element
 * to take the same size as the target element
 * @param    {SCursorComponent}    $sticked    The [cursor-sticked] element
 * @param    {HTMLElement}    $target    The target element
 */
SCursorComponent.registerHandler('fit', ($sticked, $target) => {
  // get the border initial border-radius
  if (!$sticked._borderRadius)
    $sticked._borderRadius = getStyleProperty(
      $sticked,
      'borderBottomLeftRadius'
    )
  // calculate the target offset
  const targetOffset = offset($target)
  // calculate the destinations
  const destX = targetOffset.left + $target.offsetWidth * 0.5 - scrollLeft()
  const destY = targetOffset.top + $target.offsetHeight * 0.5 - scrollTop()
  // make the cursor fit the target
  anime({
    targets: $sticked,
    top: destY,
    left: destX,
    width: $target.offsetWidth,
    height: $target.offsetHeight,
    borderRadius: $sticked._borderRadius || 0,
    duration: 300,
    easing: 'easeInOutExpo'
  })
  // return the "undo" function
  return stickedInitialSize => {
    anime({
      targets: $sticked,
      width: stickedInitialSize.width,
      height: stickedInitialSize.height,
      duration: 300,
      easing: 'easeInOutExpo'
    })
  }
})

/**
 * @name    fit-square
 * @setting
 * Simple fit handler that animate the [cursor-sticked] element
 * to take the same size as the target element.
 * In addition it will set the border-radius to 0
 * @param    {HTMLElement}    $sticked    The [cursor-sticked] element
 * @param    {HTMLElement}    $target    The target element
 */
SCursorComponent.registerHandler('fit-square', ($sticked, $target) => {
  // get the border initial border-radius
  if (!$sticked._borderRadius)
    $sticked._borderRadius = getStyleProperty(
      $sticked,
      'borderBottomLeftRadius'
    )
  // calculate the target offset
  const targetOffset = offset($target)
  // calculate the destinations
  const destX = targetOffset.left + $target.offsetWidth * 0.5 - scrollLeft()
  const destY = targetOffset.top + $target.offsetHeight * 0.5 - scrollTop()
  // make the cursor fit the target
  anime({
    targets: $sticked,
    top: destY,
    left: destX,
    width: $target.offsetWidth,
    height: $target.offsetHeight,
    borderRadius: 0,
    duration: 300,
    easing: 'easeInOutExpo'
  })
  // return the "undo" function
  return stickedInitialSize => {
    anime({
      targets: $sticked,
      width: stickedInitialSize.width,
      height: stickedInitialSize.height,
      borderRadius: $sticked._borderRadius,
      duration: 300,
      easing: 'easeInOutExpo'
    })
  }
})
