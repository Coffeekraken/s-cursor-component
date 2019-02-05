'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

var _SWebComponent2 = _interopRequireDefault(
  require('coffeekraken-sugar/js/core/SWebComponent')
)

var _addEventListener = _interopRequireDefault(
  require('coffeekraken-sugar/js/dom/addEventListener')
)

var _requestAnimationFrame = _interopRequireDefault(
  require('coffeekraken-sugar/js/dom/requestAnimationFrame')
)

var _querySelectorLive = _interopRequireDefault(
  require('coffeekraken-sugar/js/dom/querySelectorLive')
)

var _animejs = _interopRequireDefault(require('animejs'))

var _offset = _interopRequireDefault(
  require('coffeekraken-sugar/js/dom/offset')
)

var _getStyleProperty = _interopRequireDefault(
  require('coffeekraken-sugar/js/dom/getStyleProperty')
)

var _scrollTop = _interopRequireDefault(
  require('coffeekraken-sugar/js/dom/scrollTop')
)

var _scrollLeft = _interopRequireDefault(
  require('coffeekraken-sugar/js/dom/scrollLeft')
)

var _dispatchEvent = _interopRequireDefault(
  require('coffeekraken-sugar/js/dom/dispatchEvent')
)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj
    }
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj
    }
  }
  return _typeof(obj)
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call
  }
  return _assertThisInitialized(self)
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return self
}

function _get(target, property, receiver) {
  if (typeof Reflect !== 'undefined' && Reflect.get) {
    _get = Reflect.get
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property)
      if (!base) return
      var desc = Object.getOwnPropertyDescriptor(base, property)
      if (desc.get) {
        return desc.get.call(receiver)
      }
      return desc.value
    }
  }
  return _get(target, property, receiver || target)
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object)
    if (object === null) break
  }
  return object
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
      }
  return _getPrototypeOf(o)
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function')
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  })
  if (superClass) _setPrototypeOf(subClass, superClass)
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p
      return o
    }
  return _setPrototypeOf(o, p)
}

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
var SCursorComponent =
  /*#__PURE__*/
  (function(_SWebComponent) {
    _inherits(SCursorComponent, _SWebComponent)

    function SCursorComponent() {
      _classCallCheck(this, SCursorComponent)

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(SCursorComponent).apply(this, arguments)
      )
    }

    _createClass(
      SCursorComponent,
      [
        {
          key: 'componentWillMount',

          /**
           * Component will mount
           * @definition    SWebComponent.componentWillMount
           * @protected
           */
          value: function componentWillMount() {
            _get(
              _getPrototypeOf(SCursorComponent.prototype),
              'componentWillMount',
              this
            ).call(this) // get some references

            this._$pointer = this.querySelector('[cursor-pointer]')
            this._$sticked = this.querySelector('[cursor-sticked]') // if need to hide the default cursor

            if (this.props.hideDefaultCursor) {
              document.body.classList.add('hide-cursor')
            } // aria attribute

            this.setAttribute('aria-hidden', true)
          }
          /**
           * Mount component
           * @definition    SWebComponent.componentMount
           * @protected
           */
        },
        {
          key: 'componentMount',
          value: function componentMount() {
            var _this = this

            _get(
              _getPrototypeOf(SCursorComponent.prototype),
              'componentMount',
              this
            ).call(this) // init mouse position

            this._mousePos = {
              x: 0,
              y: 0 // get initial size
            }
            this._stickedInitialSize = {
              width: this._$sticked ? this._$sticked.offsetWidth : 0,
              height: this._$sticked ? this._$sticked.offsetHeight : 0 // listen for mouse move to update the this._mousePos values
            }
            this._removeMouseMoveHandler = (0, _addEventListener.default)(
              document,
              'mousemove',
              this._mouseMoveHandler.bind(this)
            ) // request animation frame to update the cursor position as quickly as possible

            ;(0, _requestAnimationFrame.default)(
              this._setCursorPointerPosition.bind(this)
            ) // get all the "cursor" marked elements on the page

            this._cursorElmStack = []
            ;(0, _querySelectorLive.default)('[cursor]', function($cursor) {
              // add the tabindex attribute if not already present
              if (
                !$cursor.hasAttribute('tabindex') &&
                _this.props.enableFocus
              ) {
                $cursor.setAttribute('tabindex', 0)
              } // add to the stack

              if (_this._cursorElmStack.indexOf($cursor) === -1) {
                _this._cursorElmStack.push({
                  $elm: $cursor,
                  mouseEnterListener: (0, _addEventListener.default)(
                    $cursor,
                    'mouseenter',
                    _this._cursorMouseEnterHandler.bind(_this)
                  ),
                  mouseLeaveListener: (0, _addEventListener.default)(
                    $cursor,
                    'mouseleave',
                    _this._cursorMouseLeaveHandler.bind(_this)
                  ),
                  focusListener: (0, _addEventListener.default)(
                    $cursor,
                    'focus',
                    _this._cursorFocusHandler.bind(_this)
                  ),
                  blurListener: (0, _addEventListener.default)(
                    $cursor,
                    'blur',
                    _this._cursorBlurHandler.bind(_this)
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
        },
        {
          key: 'componentUnmount',
          value: function componentUnmount() {
            _get(
              _getPrototypeOf(SCursorComponent.prototype),
              'componentUnmount',
              this
            ).call(this)

            if (this._removeMouseMoveHandler) {
              this._removeMouseMoveHandler()
            }

            this._cursorElmStack.forEach(function(cursorElm) {
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
        },
        {
          key: 'componentWillReceiveProp',
          value: function componentWillReceiveProp(name, newVal, oldVal) {
            _get(
              _getPrototypeOf(SCursorComponent.prototype),
              'componentWillReceiveProp',
              this
            ).call(this, name, newVal, oldVal)
          }
          /**
           * When the mouse enter a target
           * @param    {MouseEvent}    e    The mouse event
           */
        },
        {
          key: '_cursorMouseEnterHandler',
          value: function _cursorMouseEnterHandler(e) {
            // focus the target
            this._focusTarget(e.target)
          }
          /**
           * When the mouse leave a target
           * @param    {MouseEvent}    e    The mouse event
           */
        },
        {
          key: '_cursorMouseLeaveHandler',
          value: function _cursorMouseLeaveHandler(e) {
            // unfocus target
            this._unfocusTarget(e.target)
          }
          /**
           * Focus the target. Mean that we call the handler, we set the sticked as sticked and we
           * add the "cursor-class" if exist on the target
           * @param    {HTMLElement}    $target    The target to focus
           */
        },
        {
          key: '_focusTarget',
          value: function _focusTarget($target) {
            // get the handler
            var handler = $target.getAttribute('cursor') // check that this handler exist in the handlers stack

            if (!SCursorComponent._handlers[handler]) return // set stick class and status

            this._stickSticked() // check if the target has a cursor-class attribute

            if ($target.hasAttribute('cursor-class')) {
              this.classList.add($target.getAttribute('cursor-class'))
            } // add the handler name as a class

            this.classList.add(handler) // execute the handler if we have a sticked element

            if (this._$sticked) {
              _animejs.default.remove(this._$sticked)

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

            ;(0, _dispatchEvent.default)(this, 'sticked', {
              $sticked: this._$sticked,
              $target: $target
            })
          }
          /**
           * Unfoxus the target
           * @param    {HTMLElement}    $target    The target to unfocus
           */
        },
        {
          key: '_unfocusTarget',
          value: function _unfocusTarget($target) {
            // get the handler name from the target
            var handler = $target.getAttribute('cursor') // check if the target has a cursor-class attribute

            if ($target.hasAttribute('cursor-class')) {
              this.classList.remove($target.getAttribute('cursor-class'))
            } // remove the handler class

            this.classList.remove(handler) // if a reverse handler function exist, launch it

            if (this._reverseHandlerFn)
              this._reverseHandlerFn(this._stickedInitialSize) // unstick the cursor

            this._unstickSticked()
            /**
             * @event
             * @name    sticked
             * Dispatched when the "sticked" element is bein unsticked from the target
             * @param    {HTMLElement}    $sticked    The sticked element. Can be null
             * @param    {HTMLElement}    $target    The target element
             */

            ;(0, _dispatchEvent.default)(this, 'unsticked', {
              $sticked: this._$sticked,
              $target: $target
            })
          }
          /**
           * Flag the sticked element as sticked and add classes
           */
        },
        {
          key: '_stickSticked',
          value: function _stickSticked() {
            // flag the cursor as sticked
            this._sticked = true // add the sticked class

            this.classList.add('sticked')
          }
          /**
           * Flag the sticked element as unsticked and remove classes
           */
        },
        {
          key: '_unstickSticked',
          value: function _unstickSticked() {
            // flag the cursor as unsticked
            this._sticked = false // add the sticked class

            this.classList.remove('sticked')
          }
          /**
           * Mouse move handler
           * @param    {MouseEvent}    e     The mouse move event
           */
        },
        {
          key: '_mouseMoveHandler',
          value: function _mouseMoveHandler(e) {
            this._mousePos = {
              x: e.clientX,
              y: e.clientY
            }
          }
          /**
           * When an element in the page has the focus
           * @param    {Event}    e    The focus event
           */
        },
        {
          key: '_cursorFocusHandler',
          value: function _cursorFocusHandler(e) {
            // make sure we have the focus support enabled
            if (!this.props.enableFocus) return // focus the target

            this._focusTarget(e.target)
          }
          /**
           * When an element that has been focused is bein blured
           * @param    {Event}    e    The blur event
           */
        },
        {
          key: '_cursorBlurHandler',
          value: function _cursorBlurHandler(e) {
            // make sure we have the focus support enabled
            if (!this.props.enableFocus) return // unfocus the target

            this._unfocusTarget(e.target)
          }
          /**
           * Set the cursor position
           */
        },
        {
          key: '_setCursorPointerPosition',
          value: function _setCursorPointerPosition() {
            if (this._$pointer) {
              ;(0, _animejs.default)({
                targets: this._$pointer,
                left: this._mousePos.x,
                top: this._mousePos.y,
                duration: this.props.pointerFollowMouseAnimationDuration
              })
            }

            if (this._$sticked && !this._sticked) {
              ;(0, _animejs.default)({
                targets: this._$sticked,
                left: this._mousePos.x,
                top: this._mousePos.y,
                duration: this.props.stickedFollowMouseAnimationDuration
              })
            }

            ;(0, _requestAnimationFrame.default)(
              this._setCursorPointerPosition.bind(this)
            )
          }
        }
      ],
      [
        {
          key: 'defaultCss',

          /**
           * Css
           * @protected
           */
          value: function defaultCss(componentName, componentNameDash) {
            return '\n      [cursor] {\n        outline: none;\n      }\n      body.hide-cursor,\n      body.hide-cursor [cursor],\n      body.hide-cursor '
              .concat(
                componentNameDash,
                ' {\n        cursor: none !important;\n      }\n      '
              )
              .concat(
                componentNameDash,
                ' {\n        display : inline-block;\n        position: fixed;\n        top: 0; left: 0;\n        pointer-events: none;\n      }\n    '
              )
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
        },
        {
          key: 'registerHandler',
          value: function registerHandler(name, handler) {
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
        },
        {
          key: 'applyHandlerOn',
          value: function applyHandlerOn(handler, selector) {
            var cursorClass =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : null
            ;(0, _querySelectorLive.default)(selector, function($elm) {
              // apply the handler on the element
              $elm.setAttribute('cursor', handler) // if has a cursor class, add it as well

              if (cursorClass) {
                $elm.setAttribute('cursor-class', cursorClass)
              }
            })
          }
        },
        {
          key: 'defaultProps',

          /**
           * Default props
           * @definition    SWebComponent.defaultProps
           * @protected
           */
          get: function get() {
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
        },
        {
          key: 'physicalProps',
          get: function get() {
            return []
          }
        }
      ]
    )

    return SCursorComponent
  })(_SWebComponent2.default)
/**
 * @name    fit
 * @setting
 * Simple fit handler that animate the [cursor-sticked] element
 * to take the same size as the target element
 * @param    {SCursorComponent}    $sticked    The [cursor-sticked] element
 * @param    {HTMLElement}    $target    The target element
 */

exports.default = SCursorComponent
SCursorComponent.registerHandler('fit', function($sticked, $target) {
  // get the border initial border-radius
  if (!$sticked._borderRadius)
    $sticked._borderRadius = (0, _getStyleProperty.default)(
      $sticked,
      'borderBottomLeftRadius'
    ) // calculate the target offset

  var targetOffset = (0, _offset.default)($target) // calculate the destinations

  var destX =
    targetOffset.left + $target.offsetWidth * 0.5 - (0, _scrollLeft.default)()
  var destY =
    targetOffset.top + $target.offsetHeight * 0.5 - (0, _scrollTop.default)() // make the cursor fit the target

  ;(0, _animejs.default)({
    targets: $sticked,
    top: destY,
    left: destX,
    width: $target.offsetWidth,
    height: $target.offsetHeight,
    borderRadius: $sticked._borderRadius || 0,
    duration: 300,
    easing: 'easeInOutExpo'
  }) // return the "undo" function

  return function(stickedInitialSize) {
    ;(0, _animejs.default)({
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

SCursorComponent.registerHandler('fit-square', function($sticked, $target) {
  // get the border initial border-radius
  if (!$sticked._borderRadius)
    $sticked._borderRadius = (0, _getStyleProperty.default)(
      $sticked,
      'borderBottomLeftRadius'
    ) // calculate the target offset

  var targetOffset = (0, _offset.default)($target) // calculate the destinations

  var destX =
    targetOffset.left + $target.offsetWidth * 0.5 - (0, _scrollLeft.default)()
  var destY =
    targetOffset.top + $target.offsetHeight * 0.5 - (0, _scrollTop.default)() // make the cursor fit the target

  ;(0, _animejs.default)({
    targets: $sticked,
    top: destY,
    left: destX,
    width: $target.offsetWidth,
    height: $target.offsetHeight,
    borderRadius: 0,
    duration: 300,
    easing: 'easeInOutExpo'
  }) // return the "undo" function

  return function(stickedInitialSize) {
    ;(0, _animejs.default)({
      targets: $sticked,
      width: stickedInitialSize.width,
      height: stickedInitialSize.height,
      borderRadius: $sticked._borderRadius,
      duration: 300,
      easing: 'easeInOutExpo'
    })
  }
})
