// MannyTap plugin for better touching

(function($) {
	var settings = {
		moveDistance: 20,
		cancelClick: true,
		cancelClickPropagation: true
	},
	
	startHandler = function(e){
		this.mannyData = {
			clicked: true,
			dataX: e.originalEvent.pageX,
			dataY: e.originalEvent.pageY
		}
	},
	
	moveHandler = function(e){
		// cancel out the tap if the user's finger moves too far from the origin
		var x = e.originalEvent.pageX,
			y = e.originalEvent.pageY,
			oldX = this.mannyData.dataX,
			oldY = this.mannyData.dataY,
			m = e.data.moveDistance;
			
		if(x > oldX + m || x < oldX - m || y > oldY + m || y < oldY - m){
			this.mannyData.clicked = false;
		}
	},
	
	endHandler = function(e){
		if(e.data.ignoreTouch === true || this.mannyData.clicked === true){
			$(this).trigger("mannyTap");
		}
		// call cancels for native click
		if(e.data.ignoreTouch === true){
			this.mannyData = {
				clicked: true
			}
			postTouchHandler.call(this, e);
		}
	},
	
	postTouchHandler = function(e){
		// prevent clicks if mannyTap was called
		if(this.mannyData.clicked === true){
			if(e.data.cancelClick === true){
				e.preventDefault();
			}
			if(e.data.cancelClickPropagation === true){
				e.stopPropagation();
			}
		}
		this.mannyData.clicked = false;
	};
	
	
	$.event.special.mannyTap = {
		add: function(handleObj){
			// copy settings and add data if provided
			var mannyOptions = $.extend({}, settings);
			
			if(typeof handleObj.data === "object"){
				$.extend(mannyOptions, handleObj.data);
			}

			// bind touch or click events
			if('ontouchstart' in window){
				$(this).on("touchstart", handleObj.selector, startHandler).on("touchmove", handleObj.selector, mannyOptions, moveHandler).on("touchend", handleObj.selector, mannyOptions, endHandler).on("click", handleObj.selector, mannyOptions, postTouchHandler);
			} else {
				$.extend(mannyOptions, {ignoreTouch: true});
				$(this).on("click", handleObj.selector, mannyOptions, endHandler);
			}
		},
		teardown: function(){
			$(this).unbind("touchstart", startHandler).unbind("touchmove", moveHandler).unbind("touchend", endHandler).unbind("click", endHandler);
		}
	};

})(jQuery);
