# Coffeekraken s-cursor-component <img src=".resources/coffeekraken-logo.jpg" height="25px" />

<p>
	<!-- <a href="https://travis-ci.org/coffeekraken/s-cursor-component">
		<img src="https://img.shields.io/travis/coffeekraken/s-cursor-component.svg?style=flat-square" />
	</a> -->
	<a href="https://www.npmjs.com/package/coffeekraken-s-cursor-component">
		<img src="https://img.shields.io/npm/v/coffeekraken-s-cursor-component.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-cursor-component/blob/master/LICENSE.txt">
		<img src="https://img.shields.io/npm/l/coffeekraken-s-cursor-component.svg?style=flat-square" />
	</a>
	<!-- <a href="https://github.com/coffeekraken/s-cursor-component">
		<img src="https://img.shields.io/npm/dt/coffeekraken-s-cursor-component.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-cursor-component">
		<img src="https://img.shields.io/github/forks/coffeekraken/s-cursor-component.svg?style=social&label=Fork&style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-cursor-component">
		<img src="https://img.shields.io/github/stars/coffeekraken/s-cursor-component.svg?style=social&label=Star&style=flat-square" />
	</a> -->
	<a href="https://twitter.com/{twitter-username}">
		<img src="https://img.shields.io/twitter/url/http/{twitter-username}.svg?style=social&style=flat-square" />
	</a>
	<a href="http://coffeekraken.io">
		<img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=flat-square&label=coffeekraken.io&colorB=f2bc2b&style=flat-square" />
	</a>
</p>

<p class="lead">Build highly customizable cursor with ease that can interact with the HTMLElements in your page</p>

[![View demo](http://components.coffeekraken.io/assets/img/view-demo.png)](http://components.coffeekraken.io/app/s-cursor-component)

## Table of content

1. **[Demo](http://components.coffeekraken.io/app/s-cursor-component)**
2. [Install](#readme-install)
3. [Get Started](#readme-get-started)
4. [Handlers](#readme-handlers)
5. [Provided handlers](#readme-provided-handlers)
6. [Apply handler on](#readme-apply-handler-on)
7. [Classes](#readme-classes)
8. [Javascript API](doc/js)
9. [Sugar Web Components Documentation](https://github.com/coffeekraken/sugar/blob/master/doc/webcomponent.md)
10. [Browsers support](#readme-browsers-support)
11. [Code linting](#readme-code-linting)
12. [Contribute](#readme-contribute)
13. [Who are Coffeekraken?](#readme-who-are-coffeekraken)
14. [Licence](#readme-license)

<a name="readme-install"></a>

## Install

```
npm install coffeekraken-s-cursor-component --save
```

<a name="readme-get-started"></a>

## Get Started

First, import the component into your javascript file like so:

```js
import SCursorComponent from 'coffeekraken-s-cursor-component'
```

Then simply use it inside your html like so:

```html
<s-cursor>
  <!-- this is the pointer element that display at least a tiny dot or something to help the user click where he wants -->
  <div class="cursor-pointer" cursor-pointer></div>
  <!-- this is an optional element that can interact with the HTMLElement page like sticking to it, resizing, etc... -->
  <div class="cursor-sticked" cursor-sticked></div>
</s-cursor>
```

You can then skin your cursor as you wish. The display is totaly up to you.

<a id="readme-handlers"></a>

## Handlers

The handlers in this webcomponent are a key part and you need to understand that to release it's power.
A handler is nothing more than a function that take the `$sticked` element, the `$target` one and do something with them like resizing the `$sticked` element to the `$target` size, or whatever you want.

#### What is a `$target` element?

A `$target` element is any HTMLElement in your page that are marked with the `cursor` attribute. This attribute specify the **handler** to use when the cursor `mousenter` it.
Here's an example:

```html
<ul>
  <li cursor="fit">Item #1</li>
  <li cursor="fit">Item #2</li>
  <li cursor="fit">Item #3</li>
  <li cursor="fit">Item #4</li>
</ul>
```

#### What is an **handler**?

If we take the example above, the wanted handler is named `fit`. We need to define this handler. Here's how:

```js
// we register our handler using this function:
SCursorComponent.registerHandler('fit', ($sticked, $target) => {
  // here we can do what we want with the two elements passed as parameters.
  // in our example, we need to make the $sticked element "fit" the $target one.
  // here's how:

  // calculate the target offset
  const targetOffset = offset($target) // offset comes from the sugar toolkit that you can find in the coffeekraken repos
  // calculate the destinations
  const destX = targetOffset.left + $target.offsetWidth * 0.5 - scrollLeft() // scrollLeft comes from the sugar toolkit that you can find in the coffeekraken repos
  const destY = targetOffset.top + $target.offsetHeight * 0.5 - scrollTop() // scrollTop comes from the sugar toolkit that you can find in the coffeekraken repos
  // make the cursor fit the target
  anime({
    // anime is a cool animation engine that you can find on https://animejs.com/
    targets: $sticked,
    top: destY,
    left: destX,
    width: $target.offsetWidth,
    height: $target.offsetHeight,
    duration: 400,
    easing: 'easeInOutExpo'
  })

  // we now have our "in" animation. This mean that this code will be executed when the cursor "mouseenter" the $target
  // we do need to tell our $sticked element how to go back to his initial state when the cursot "mouseleave" the $target
  // to do that, we return a function here that will do exactly that. Here's how:
  return stickedInitialSize => {
    // note that we have access here at an object containing the initial width and height or the $sticked element
    // here's how code that reset the size of our $sticked element:
    anime({
      targets: $sticked,
      width: stickedInitialSize.width,
      height: stickedInitialSize.height,
      duration: 400,
      easing: 'easeInOutExpo'
    })
  }
})
```

You do know what's a `$target` element and an **handler** function. This way the hardest part. You're now able to create some cool cursors with HTMLElements, canvas, etc...

<a id="readme-provided-handlers"></a>

## Provided handlers

No need to write every handlers by yourself. We provide you some that you can use directly. Here's the list:

1. `fit`: Make the `$sticked` element fit the `$target` one in size
2. `fit-square`: Make the `$sticked` element fit the `$target` one in size and ensure that no border-radius is left

If you have any idea or "base" handlers, don't hesitate to contact us.

<a id="readme-apply-handler-on"></a>

## Apply handler on

It can be hard and painful to add on every HTMLElement the `cursor` attribute to enable an **handler** on every buttons for example.
This is where the function `applyHandlerOn` comes into place.
This function allows you to set an **handler** on multiple HTMLElement at once using a simple css selector. Here's how:

```js
SCursorElement.applyHandlerOn('fit', '.btn') // apply the "fit" handler on every ".btn"
```

This function is a "live" one. Meaning that it will take care of every existing ".btn" in your page AND of every upcoming ".btn" that you may add to your page using ajax or whatever...

<a id="readme-classes"></a>

## Classes

Your component will have some classes applied along his life. Here's the list:

- `sticked`: Applied when the pointer has `mouseenter` a `$target` element. Will be removed on `mouseleave`
- `{handlerName}`: Applied when the `$sticked` element has been "sticked" by an handler to a `$target`
- `{cursorClass}`: Class taker from the `$target` element in the `cursor-class` attribute. Useful to customize your cursor using css

Here's an example of `cursor-class` usage:

```html
<a class="btn" cursor="fit" cursor-class="my-cool-class">Hello World</a>
```

<a id="readme-browsers-support"></a>

## Browsers support

| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /></br>IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /></br>Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /></br>Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /></br>Safari |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11+                                                                                                                                                              | last 2 versions                                                                                                                                                   | last 2 versions                                                                                                                                                | last 2 versions                                                                                                                                                |

> As browsers are automatically updated, we will keep as reference the last two versions of each but this component can work on older ones as well.

> The webcomponent API (custom elements, shadowDOM, etc...) is not supported in some older browsers like IE10, etc... In order to make them work, you will need to integrate the [corresponding polyfill](https://www.webcomponents.org/polyfills).

<a id="readme-code-linting"></a>

## Code linting

This package uses some code linting rules. Here's the list:

1. [StandardJS](https://standardjs.com/) for javascript files
2. [Stylelint](https://github.com/stylelint/stylelint) with [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) for `scss` files

> Your commits will not been accepted if the code style is not respected!

<a id="readme-contribute"></a>

## Contribute

This is an open source project and will ever be! You are more that welcomed to contribute to his development and make it more awesome every day.
To do so, you have several possibilities:

1. [Share the love ❤️](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-share-the-love)
2. [Declare issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-declare-issues)
3. [Fix issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-fix-issues)
4. [Add features](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-add-features)
5. [Build web component](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-build-web-component)

<a id="readme-who-are-coffeekraken"></a>

## Who are Coffeekraken

We try to be **some cool guys** that build **some cool tools** to make our (and yours hopefully) **every day life better**.

#### [More on who we are](https://github.com/Coffeekraken/coffeekraken/blob/master/who-are-we.md)

<a id="readme-license"></a>

## License

The code is available under the [MIT license](LICENSE.txt). This mean that you can use, modify, or do whatever you want with it. This mean also that it is shipped to you for free, so don't be a hater and if you find some issues, etc... feel free to [contribute](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md) instead of sharing your frustrations on social networks like an asshole...
