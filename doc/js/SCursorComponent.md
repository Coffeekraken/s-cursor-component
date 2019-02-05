# Methods


## registerHandler

Register a cursor handler
A handler function is the function that update in any way the cursor
in order to fit, encircle, or whatever you prefer the HTMLElement that has
a `cursor` attribute.
If my handler function is named "coolEffect", it will be triggered on HTMLElement that
have the attribute `cursor="coolEffect"`.



### Parameters
Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
name  |  **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**  |  The handler name  |  required  |
handler  |  **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**  |  The handler function  |  required  |

**Static**


## SCursorComponent.registerHandler

Simple fit handler that animate the cursor
to take the same size as the target element


### Parameters
Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
$cursor  |  **{ SCursorComponent }**  |  The cursor element  |  required  |
$target  |  **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }**  |  The target element  |  required  |