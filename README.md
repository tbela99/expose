Overlay
============

A modified version of Samuel Birch overlay, that Extends Element.Properties with mask and expose

#### Demos

- [Expose](http://tbela99.github.com/expose/Demo/expose.html)
- [Mask](http://tbela99.github.com/expose/Demo/index.html)


### Options: {#overlay-options}

* container  - (*mixed*) the element where the overlay will be injected.
* color  - (*string*, optional) the overlay color.
* opacity  - (*float*, optional) overlay transparency
* zIndex - (*int*, optional) the overlay z-index.
* duration  - (*int*, optional) the overlay fading duration.

### Events:

#### click

Fired when the user click the overlay.

#### show

Fired before the overlay is shown.

#### hide

Fired before the overlay is hidden.


Method: show 
------------

display the overlay.

### Returns:

* (*object*) - The overlay.

Method: hide
----------------

hide the overlay.

### Returns:

* (*object*) - The overlay.

Element Properties
============

How to use
---------------------

#### Expose

produce a jQuery like Exposé in mootools.

#### Syntax

	element.set('expose' [, options]);
	element.get('expose' [, options]);

#### Options

In addition to the [Overlay Options](#overlay-options)

* modal  - (*boolean*) if false, the overlay will be hidden the the user click on it.
* dialog  - (*boolean*, optional) the overlay will appear on top of another overlay with the same zIndex.

### Javascript:

	element.set('expose', {
	
		onShow: function () {
		
		},
		onHide: function () {
		
		}
	}).show();
	element.get('expose').hide();

#### Mask

show an overlay on top of the element.

#### Syntax

	element.set('mask' [, options]);
	element.get('mask' [, options]);

#### Options

see [Overlay Options](#overlay-options).

### Javascript:

	element.set('mask', {
	
		onShow: function () {
		
		},
		onHide: function () {
		
		}
	}).show();
	element.get('mask').hide();
