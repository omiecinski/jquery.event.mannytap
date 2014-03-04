# jquery.event.mannytap

A lightweight jQuery event handler for better click event handling.

### Features

* Moves touch/click events to touchend/mouseup for faster event response time.
* Allows for a user-configurable amount of x and y change during clicks to compensate for slight touch movements.
* Utilizes jQuery's special event API for easy initialization

### Options (and defaults)

	moveDistance: 20,
(int) The maximum distance a touch can move before disqualifying it as a click. Specified in pixels.

	cancelClick: true,
(boolean) Call preventDefault on element click.

	cancelClickPropagation: true
(boolean) Call stopPropagation on element click.


### Examples

Standard usage:

	$("a").on("mannyTap", function(e){
		// click event logic
	});

Delegate event functionality to a child element:

	$("nav").on("mannyTap", "a", function(e){
		// click event logic
	});

### Requires

* jQuery 1.7+
