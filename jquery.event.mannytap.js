// MannyTap plugin for better touching

(function ($) {
	var eventMap = {
		touch: { start: "touchstart", end: "touchend" },
		mouse: { start: "mousedown", end: "mouseup" }
	},
	settings = {
		moveDistance: 20,
		cancelClick: true,
		cancelClickPropagation: true
	},
	events = ("ontouchstart" in window || !!navigator.msMaxTouchPoints) ? eventMap.touch : eventMap.mouse,

	startHandler = function(e) {
		this.mannyData = {
			clicked: true,
			dataX: e.originalEvent.pageX,
			dataY: e.originalEvent.pageY
		}
	},

	endHandler = function(e) {
		if (!this.mannyData) {
			return false;
		}

		// cancel out the tap if the user's finger moves too far from the origin
		var x = e.originalEvent.pageX,
			y = e.originalEvent.pageY,
			oldX = this.mannyData.dataX,
			oldY = this.mannyData.dataY,
			m = e.data.moveDistance;

		if (x > oldX + m || x < oldX - m || y > oldY + m || y < oldY - m) {
			this.mannyData.clicked = false;
		}

		if (this.mannyData.clicked === true) {
			$(this).trigger("mannyTap");
		}
	},

	postTouchHandler = function(e) {
		// prevent clicks if mannyTap was called
		if (this.mannyData.clicked === true) {
			if (e.data.cancelClick === true) {
				e.preventDefault();
			}
			if (e.data.cancelClickPropagation === true) {
				e.stopPropagation();
			}
		}
		this.mannyData.clicked = false;
	};


	$.event.special.mannyTap = {
		add: function (handleObj) {
			// copy settings and add data if provided
			var mannyOptions = $.extend({}, settings);

			if (typeof handleObj.data === "object") {
				$.extend(mannyOptions, handleObj.data);
			}

			// bind touch or mouse events
			$(this)
				.on(events.start, handleObj.selector, startHandler)
				.on(events.end, handleObj.selector, mannyOptions, endHandler)
				.on("click", handleObj.selector, mannyOptions, postTouchHandler);
		},
		teardown: function () {
			$(this)
				.off(events.start, startHandler)
				.off(events.end, endHandler)
				.off("click", postTouchHandler);
		}
	};
})(jQuery);