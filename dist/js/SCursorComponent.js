"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SWebComponent2 = _interopRequireDefault(require("coffeekraken-sugar/js/core/SWebComponent"));

var _addEventListener = _interopRequireDefault(require("coffeekraken-sugar/js/dom/addEventListener"));

var _requestAnimationFrame = _interopRequireDefault(require("coffeekraken-sugar/js/dom/requestAnimationFrame"));

var _querySelectorLive = _interopRequireDefault(require("coffeekraken-sugar/js/dom/querySelectorLive"));

var _animejs = _interopRequireDefault(require("animejs"));

var _offset = _interopRequireDefault(require("coffeekraken-sugar/js/dom/offset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SCursorComponent =
/*#__PURE__*/
function (_SWebComponent) {
  _inherits(SCursorComponent, _SWebComponent);

  function SCursorComponent() {
    _classCallCheck(this, SCursorComponent);

    return _possibleConstructorReturn(this, _getPrototypeOf(SCursorComponent).apply(this, arguments));
  }

  _createClass(SCursorComponent, [{
    key: "componentWillMount",

    /**
     * Component will mount
     * @definition    SWebComponent.componentWillMount
     * @protected
     */
    value: function componentWillMount() {
      _get(_getPrototypeOf(SCursorComponent.prototype), "componentWillMount", this).call(this);
    }
    /**
     * Mount component
     * @definition    SWebComponent.componentMount
     * @protected
     */

  }, {
    key: "componentMount",
    value: function componentMount() {
      var _this = this;

      _get(_getPrototypeOf(SCursorComponent.prototype), "componentMount", this).call(this); // init mouse position


      this._mousePos = {
        x: 0,
        y: 0 // get initial size

      };
      this._initialCursorSize = {
        width: this.offsetWidth,
        height: this.offsetHeight // listen for mouse move to update the this._mousePos values

      };
      this._removeMouseMoveHandler = (0, _addEventListener.default)(document, 'mousemove', this._mouseMoveHandler.bind(this)); // request animation frame to update the cursor position as quickly as possible

      (0, _requestAnimationFrame.default)(this._setCursorPosition.bind(this)); // get all the "cursor" marked elements on the page

      this._cursorElmStack = [];
      (0, _querySelectorLive.default)('[cursor]', function ($cursor) {
        // add to the stack
        if (_this._cursorElmStack.indexOf($cursor) === -1) {
          _this._cursorElmStack.push({
            $elm: $cursor,
            mouseEnterListener: (0, _addEventListener.default)($cursor, 'mouseenter', _this._cursorMouseEnterHandler.bind(_this)),
            mouseLeaveListener: (0, _addEventListener.default)($cursor, 'mouseleave', _this._cursorMouseLeaveHandler.bind(_this))
          });
        }
      });
    }
  }, {
    key: "_cursorMouseEnterHandler",
    value: function _cursorMouseEnterHandler(e) {
      // get the handler
      var handler = e.target.getAttribute('cursor'); // check that this handler exist in the handlers stack

      if (!SCursorComponent._handlers[handler]) return; // execute the handler

      this._reverseHandlerFn = SCursorComponent._handlers[handler](this, e.target); // position the element on the target

      this._stickCursorTo(e.target);
    }
  }, {
    key: "_cursorMouseLeaveHandler",
    value: function _cursorMouseLeaveHandler(e) {
      // if a reverse handler function exist, launch it
      if (this._reverseHandlerFn) this._reverseHandlerFn(this._initialCursorSize); // unstick the cursor

      this._unstickCursor();
    }
  }, {
    key: "_stickCursorTo",
    value: function _stickCursorTo($target) {
      // flag the cursor as sticked
      this._sticked = true; // add the sticked class

      this.classList.add('sticked');
      var targetOffset = (0, _offset.default)($target); // anim the cursor to the middle of the target

      (0, _animejs.default)({
        targets: this,
        left: targetOffset.left + $target.offsetWidth * 0.5,
        top: targetOffset.top + $target.offsetHeight * 0.5,
        duration: 300,
        easing: 'easeInOutExpo'
      });
    }
  }, {
    key: "_unstickCursor",
    value: function _unstickCursor() {
      // flag the cursor as unsticked
      this._sticked = false; // add the sticked class

      this.classList.remove('sticked');
    }
    /**
     * Component unmount
     * @definition    SWebComponent.componentUnmount
     * @protected
     */

  }, {
    key: "componentUnmount",
    value: function componentUnmount() {
      _get(_getPrototypeOf(SCursorComponent.prototype), "componentUnmount", this).call(this);

      if (this._removeMouseMoveHandler) {
        this._removeMouseMoveHandler();
      }

      this._cursorElmStack.forEach(function (cursorElm) {
        if (cursorElm.mouseEnterListener) {
          cursorElm.mouseEnterListener();
        }

        if (cursorElm.mouseLeaveListener) {
          cursorElm.mouseLeaveListener();
        }
      });
    }
    /**
     * Component will receive prop
     * @definition    SWebComponent.componentWillReceiveProp
     * @protected
     */

  }, {
    key: "componentWillReceiveProp",
    value: function componentWillReceiveProp(name, newVal, oldVal) {
      _get(_getPrototypeOf(SCursorComponent.prototype), "componentWillReceiveProp", this).call(this, name, newVal, oldVal);
    }
    /**
     * Mouse move handler
     * @param    {MouseEvent}    e     The mouse move event
     */

  }, {
    key: "_mouseMoveHandler",
    value: function _mouseMoveHandler(e) {
      this._mousePos = {
        x: e.clientX,
        y: e.clientY
      };
    }
    /**
     * Set the cursor position
     */

  }, {
    key: "_setCursorPosition",
    value: function _setCursorPosition() {
      if (!this._sticked) {
        (0, _animejs.default)({
          targets: this,
          left: this._mousePos.x + 'px',
          top: this._mousePos.y + 'px',
          duration: 300
        });
      }

      (0, _requestAnimationFrame.default)(this._setCursorPosition.bind(this));
    }
  }], [{
    key: "defaultCss",

    /**
     * Css
     * @protected
     */
    value: function defaultCss(componentName, componentNameDash) {
      return "\n      body {\n        cursor: none !important;\n      }\n      [cursor] {\n        cursor: none !important;\n      }\n      ".concat(componentNameDash, " {\n        display : inline-block;\n        position: fixed;\n        top: 0; left: 0;\n        pointer-events: none;\n        cursor: none !important;\n      }\n    ");
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

  }, {
    key: "registerHandler",
    value: function registerHandler(name, handler) {
      // store the handler into the stack
      if (!SCursorComponent._handlers) SCursorComponent._handlers = {};
      SCursorComponent._handlers[name] = handler;
    }
  }, {
    key: "defaultProps",

    /**
     * Default props
     * @definition    SWebComponent.defaultProps
     * @protected
     */
    get: function get() {
      return {};
    }
    /**
     * Physical props
     * @definition    SWebComponent.physicalProps
     * @protected
     */

  }, {
    key: "physicalProps",
    get: function get() {
      return [];
    }
  }]);

  return SCursorComponent;
}(_SWebComponent2.default);
/**
 * Simple fit handler that animate the cursor
 * to take the same size as the target element
 * @param    {SCursorComponent}    $cursor    The cursor element
 * @param    {HTMLElement}    $target    The target element
 */


exports.default = SCursorComponent;
SCursorComponent.registerHandler('fit', function ($cursor, $target) {
  var width = $cursor.offsetWidth;
  var height = $cursor.offsetHeight;
  (0, _animejs.default)({
    targets: $cursor,
    width: $target.offsetWidth,
    height: $target.offsetHeight,
    duration: 300,
    easing: 'easeInOutExpo'
  });
  return function (initialSize) {
    (0, _animejs.default)({
      targets: $cursor,
      width: initialSize.width,
      height: initialSize.height,
      duration: 300,
      easing: 'easeInOutExpo'
    });
  };
});