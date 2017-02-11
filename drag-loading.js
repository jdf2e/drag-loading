class DragLoading{
	constructor(options){
		this.options = {
			element: null,
			scrollArea: window,
			autoLoad: true,
			distance: 50,
			onDragDown: null,
			onDragUp: null
		}		

		this.downInfo = {
			className: 'drag-down-info',
			refresh: '<div class="drag-down-refresh">↓下拉刷新</div>',
			update: '<div class="drag-down-update">↑释放更新</div>',
			load: '<div class="drag-down-load">正在加载...</div>'
		};

		Object.assign(this.options, options);

		this.bind();
	}

	bind(){
		var me = this;

		$(this.options.scrollArea).on('touchstart', function(event){
			me.touches(event);
			me.touchStart(event);
		});

		$(this.options.scrollArea).on('touchmove', function(event){
			me.touches(event);
			me.touchMove(event);
		});

		$(this.options.scrollArea).on('touchend', function(event){
			me.touches(event);
			me.touchEnd(event);
		});

		$(this.options.element).on('scroll touchmove', function(event){
			// event.preventDefault();
		})
	}

	

	touches(event){
		if(!event.touches){
			event.touches = e.originEvent.touches;
		}
	}

	touchStart(event){
		if(this._isLoading){
			return;
		}

		this._startY = event.touches[0].pageY;
		this._touchScrollTop = $(this.options.scrollArea).scrollTop();

		if($(this.options.element).has('.drag-down-info').length == 0){
			$(this.options.element).prepend('<div class="drag-down-info"></div>');
			this.dragDownInfo = $('.drag-down-info');			
		}
		this.dragDownInfo.css('transition', '');
	}

	touchMove(event){
		if(this._isLoading){
			return;
		}

		this._moveY = event.touches[0].pageY - this._startY;

		$('.result').html(this._touchScrollTop);

		if(this._moveY > 0 && this._touchScrollTop <= 0){
			event.preventDefault();
			this.dragDown();
		}

		if(this._moveY < 0){
			this.dragUp();
		}

	}

	touchEnd(event){
		var me = this;

		if(this._isLoading){
			return;
		}

		if(this._moveY >= this.options.distance){
			this.dragDownInfo.height(this.options.distance + 'px');
			this.dragDownInfo.html(this.downInfo.load);

			this._isLoading = true;

			setTimeout(function(){
				me.options.onDragDown();
				me.reset();
			}, 2000)
		}else{
			this.reset();
		}
		
		this.dragDownInfo.on('webkitTransitionEnd mozTransitionEnd transitionend', function(){
			// me.dragDownInfo.remove();
		});
		this.dragDownInfo.css('transition', 'all .3s ease-out;');

		
	}

	dragDown(){
		
		// console.log(Math.abs(this._moveY))
		this.dragDownInfo.html(this.downInfo.refresh).height(Math.abs(this._moveY));

		if(this._moveY > this.options.distance){
			this.dragDownInfo.html(this.downInfo.update);
		}
	}

	dragUp(){

	}

	reset(){
		this.dragDownInfo.html('');
		this.dragDownInfo.height('0px');
		this._isLoading = false;
	}

	disabled(){

	}
}