# SCursorComponent

Build highly customizable cursor with ease that can interact with the HTMLElements in your page

### Example

```html
<s-cursor>
  <!-- this is the pointer element that display at least a tiny dot or something to help the user click where he wants -->
  <div class="cursor-pointer" cursor-pointer></div>
  <!-- this is an optional element that can interact with the HTMLElement page like sticking to it, resizing, etc... -->
  <div class="cursor-sticked" cursor-sticked></div>
</s-cursor>
```

Author : Olivier Bossel [olivier.bossel@gmail.com](mailto:olivier.bossel@gmail.com) [https://olivierbossel.com](https://olivierbossel.com)

See : **See more** : [https://tympanus.net/codrops/2019/01/31/custom-cursor-effects/](https://tympanus.net/codrops/2019/01/31/custom-cursor-effects/)

Extends **SWebComponent**

## Attributes

Here's the list of available attribute(s).

### hideDefaultCursor

Specify if need to hide the default cursor or not

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**

### enableFocus

Specify if want to enable the focus support or not

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**

### pointerFollowMouseAnimationDuration

Specify the pointer follow mouse animation duration in ms

Type : **{ Integer }**

Default : **100**

### stickedFollowMouseAnimationDuration

Specify the sticked follow mouse animation duration in ms

Type : **{ Integer }**

Default : **200**

## Settings

Here's the list of available setting(s).

### fit

Simple fit handler that animate the [cursor-sticked] element
to take the same size as the target element

#### Parameters

| Name      | Type                                                                             | Description                  | Status   | Default |
| --------- | -------------------------------------------------------------------------------- | ---------------------------- | -------- | ------- |
| \$sticked | **{ SCursorComponent }**                                                         | The [cursor-sticked] element | required |
| \$target  | **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** | The target element           | required |

### fit-square

Simple fit handler that animate the [cursor-sticked] element
to take the same size as the target element.
In addition it will set the border-radius to 0

#### Parameters

| Name      | Type                                                                             | Description                  | Status   | Default |
| --------- | -------------------------------------------------------------------------------- | ---------------------------- | -------- | ------- |
| \$sticked | **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** | The [cursor-sticked] element | required |
| \$target  | **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** | The target element           | required |

## Methods

### registerHandler

Register a cursor handler
A handler function is the function that update in any way the `$sticked` element
in order to fit, encircle, or whatever you prefer the `$target` HTMLElement that has
a `cursor` attribute.
If my handler function is named "coolEffect", it will be triggered on HTMLElement that
have the attribute `cursor="coolEffect"`.

#### Parameters

| Name    | Type                                                                                                       | Description          | Status   | Default |
| ------- | ---------------------------------------------------------------------------------------------------------- | -------------------- | -------- | ------- |
| name    | **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**     | The handler name     | required |
| handler | **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }** | The handler function | required |

#### Example

```js
SCursorComponent.registerHandler('my-cool-handler', ($sticked, $target) => {
  // do something with the sticked and the target element
  return stickedInitialSize => {
    // stickedInitialSize.width
    // stickedInitialSize.height
    // do the opposite of what you've done in the previous phase.
    // this function need to simply undo what you've done in the handler
  }
})
```

**Static**

### applyHandlerOn

Register some elements to be inited with a particular handler

#### Parameters

| Name        | Type                                                                                                   | Description                                                                   | Status   | Default |
| ----------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | -------- | ------- |
| handler     | **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }** | The handler to use on these elements                                          | required |
| selector    | **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }** | The css selector that is used to match the items in the DOM                   | required |
| cursorClass | **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }** | An optional class to apply on the cursor when the target element is "focused" | optional | null    |

#### Example

```js
SCursorComponent.applyHandlerOn('fit', '.btn')
```

**Static**

## Events

### sticked

Dispatched when the "sticked" element is bein sticked to the target

#### Parameters

| Name      | Type                                                                             | Description                      | Status   | Default |
| --------- | -------------------------------------------------------------------------------- | -------------------------------- | -------- | ------- |
| \$sticked | **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** | The sticked element. Can be null | required |
| \$target  | **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** | The target element               | required |

### sticked

Dispatched when the "sticked" element is bein unsticked from the target

#### Parameters

| Name      | Type                                                                             | Description                      | Status   | Default |
| --------- | -------------------------------------------------------------------------------- | -------------------------------- | -------- | ------- |
| \$sticked | **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** | The sticked element. Can be null | required |
| \$target  | **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** | The target element               | required |
