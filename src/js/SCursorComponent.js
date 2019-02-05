import SWebComponent from 'coffeekraken-sugar/js/core/SWebComponent'
import addEventListener from 'coffeekraken-sugar/js/dom/addEventListener'
import requestAnimationFrame from 'coffeekraken-sugar/js/dom/requestAnimationFrame'
import querySelectorLive from 'coffeekraken-sugar/js/dom/querySelectorLive'
import anime from 'animejs'
import offset from 'coffeekraken-sugar/js/dom/offset'

export default class SCursorComponent extends SWebComponent {
  /**
   * Default props
   * @definition    SWebComponent.defaultProps
   * @protected
   */
  static get defaultProps() {
    return {}
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
      body {
        cursor: none !important;
      }
      [cursor] {
        cursor: none !important;
      }
      ${componentNameDash} {
        display : inline-block;
        position: fixed;
        top: 0; left: 0;
        pointer-events: none;
        cursor: none !important;
      }
    `
  }

  /**
   * Register a cursor handler
   * A handler function is the function that update in any way the cursor
   * in order to fit, encircle, or whatever you prefer the HTMLElement that has
   * a `cursor` attribute.
   * If my handler function is named "coolEffect", it will be triggered on HTMLElement that
   * have the attribute `cursor="coolEffect"`.
   *
   * @param    {String}    name    The handler name
   * @param    {Function}    handler    The handler function
   */
  static registerHandler(name, handler) {
    // store the handler into the stack
    if (!SCursorComponent._handlers) SCursorComponent._handlers = {}
    SCursorComponent._handlers[name] = handler
  }

  /**
   * Component will mount
   * @definition    SWebComponent.componentWillMount
   * @protected
   */
  componentWillMount() {
    super.componentWillMount()
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
    this._initialCursorSize = {
      width: this.offsetWidth,
      height: this.offsetHeight
    }

    // listen for mouse move to update the this._mousePos values
    this._removeMouseMoveHandler = addEventListener(
      document,
      'mousemove',
      this._mouseMoveHandler.bind(this)
    )

    // request animation frame to update the cursor position as quickly as possible
    requestAnimationFrame(this._setCursorPosition.bind(this))

    // get all the "cursor" marked elements on the page
    this._cursorElmStack = []
    querySelectorLive('[cursor]', $cursor => {
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
          )
        })
      }
    })
  }

  _cursorMouseEnterHandler(e) {
    // get the handler
    const handler = e.target.getAttribute('cursor')
    // check that this handler exist in the handlers stack
    if (!SCursorComponent._handlers[handler]) return
    // execute the handler
    this._reverseHandlerFn = SCursorComponent._handlers[handler](this, e.target)
    // position the element on the target
    this._stickCursorTo(e.target)
  }
  _cursorMouseLeaveHandler(e) {
    // if a reverse handler function exist, launch it
    if (this._reverseHandlerFn) this._reverseHandlerFn(this._initialCursorSize)
    // unstick the cursor
    this._unstickCursor()
  }

  _stickCursorTo($target) {
    // flag the cursor as sticked
    this._sticked = true
    // add the sticked class
    this.classList.add('sticked')

    const targetOffset = offset($target)

    // anim the cursor to the middle of the target
    anime({
      targets: this,
      left: targetOffset.left + $target.offsetWidth * 0.5,
      top: targetOffset.top + $target.offsetHeight * 0.5,
      duration: 300,
      easing: 'easeInOutExpo'
    })
  }

  _unstickCursor() {
    // flag the cursor as unsticked
    this._sticked = false
    // add the sticked class
    this.classList.remove('sticked')
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
   * Set the cursor position
   */
  _setCursorPosition() {
    if (!this._sticked) {
      anime({
        targets: this,
        left: this._mousePos.x + 'px',
        top: this._mousePos.y + 'px',
        duration: 300
      })
    }
    requestAnimationFrame(this._setCursorPosition.bind(this))
  }
}

/**
 * Simple fit handler that animate the cursor
 * to take the same size as the target element
 * @param    {SCursorComponent}    $cursor    The cursor element
 * @param    {HTMLElement}    $target    The target element
 */
SCursorComponent.registerHandler('fit', ($cursor, $target) => {
  const width = $cursor.offsetWidth
  const height = $cursor.offsetHeight
  anime({
    targets: $cursor,
    width: $target.offsetWidth,
    height: $target.offsetHeight,
    duration: 300,
    easing: 'easeInOutExpo'
  })
  return initialSize => {
    anime({
      targets: $cursor,
      width: initialSize.width,
      height: initialSize.height,
      duration: 300,
      easing: 'easeInOutExpo'
    })
  }
})
