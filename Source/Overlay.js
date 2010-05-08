
/*
Script: Overlay.js
	Covers the window with a semi-transparent layer.

	License: MIT-style license.
	Copyright: Copyright (c) 2007 Thierry bela <bntfr at yahoo dot fr>
	Original by Samuel birch

	License:
		MIT-style license.

	Authors:
		Thierry Bela
	Version:
		1.2.1

*/

	(function ($) {
		
		function position(el) {
		
			return el.getStyle('position') == 'fixed' ? 'fixed' : 'relative'
		}
		
		var Overlay = this.Overlay = new Class({
			Implements: [Options, Events],
			options: {
				/*
					container: null,
					onClick: $empty,
					onShow: $empty,
					onHide: $empty,
				*/
					color: '#000',
					opacity: 0.7,
					zIndex: 1,
					duration: 250
			},
			initialize: function(options){
			
				this.setOptions(options);
				
				this.options.container = $(this.options.container || document.body);
				
				this.container = new Element('div', {
					tween: {duration: this.options.duration},
					styles: {
					
						position: 'absolute',
						left: 0,
						top: 0,
						width: '100%',
						zIndex: this.options.zIndex
					}
				}).inject(this.options.container);
				
				this.iframe = new Element('iframe', {
					src: 'javascript:;',
					frameborder: 1,
					scrolling: 'no',
					styles: {
					
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						filter: 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)',
						opacity: 0,
						zIndex: 1
					}
				}).inject(this.container);
				
				this.overlay = new Element('div', {styles: {
						position: 'absolute',
						left: 0,
						top: 0,
						width: '100%',
						height: '100%',
						zIndex: 2,
						backgroundColor: this.options.color
					}
				}).inject(this.container);
				
				this.container.set('opacity', 0).addEvent('click', function(e) {
				
					e.stop();
					this.fireEvent('click')
					
				}.bind(this));
				
				var p = this.position.bind(this);
				
				window.addEvents({resize: p, scroll: p, mousewheel: p})
			},
			
			destroy: function () {
			
				this.iframe.destroy();
				this.overlay.destroy();
				this.container.destroy();
				return this
			},
			toElement: function () {
			
				return this.overlay
			},
			position: function(){

				var container = this.options.container,
					myCoords;
					
				if(this.options.container == document.body) this.container.setStyles({top: Browser.Engine.trident4 ? window.getScrollTop() : 0, height: window.getScrollHeight()});
				else {

					myCoords = container.getCoordinates(container.getStyle('position') != 'static' ? container : null); 
					this.container.setStyles({
						top: myCoords.top, 
						height: container.offsetHeight, 
						left: myCoords.left, 
						width:container.offsetWidth
					}) 
				}

				return this
			},
			
			show: function(){
			
				this.options.container.addClass('body-overlayed');
				this.position().fireEvent('show').container.tween('opacity', this.options.opacity).get('tween').chain(function () {
				
					if(this.options.opacity == 0) this.container.setStyle('visibility', 'visible')
					
				}.bind(this));
				
				return this
			},
			
			hide: function(){
				this.options.container.removeClass('body-overlayed');
				this.fireEvent('hide').container.tween('opacity', this.container.get('opacity'), 0);
				return this
			}
		}),
		
		overlay = {
						/* 
						modal: false, 
						dialog: false,
						*/
						color: "#0F0F0F", zIndex: 1,opacity: .4, duration: 250
					},
		
		_get = function (options, name) {
		
				if(options || !this.retrieve(name)) this.erase(name).set(name, options);
				
				return this.retrieve(name)
				
		},
		
		_expose = 'expose',
		_mask = 'mask';
			
		//the jQuery Expose effect
		Element.Properties.expose = {
		
			set: function (options) {
			
				options = $merge(overlay, options);
				
				//dialog is on top of overlay
				if(options.dialog) options.zIndex += 2;
				
				if(!options.modal) options.onClick = function () { this.retrieve(_expose).hide() }.bind(this);
								
				var parent = this.getParent(),
					prop = ['z-index', 'position'];
										
				return this.erase(_expose).store(_expose, new Overlay(options).addEvents({onShow: function () {
				
						this.store('o:' + _expose, true).setStyles({
							
								//zIndex: options.zIndex + 1,
								position: position(this)
						}).getParents(':not(body):not(html)').each(function (el) {
						
							el.store('props', el.getStyles(prop, 'backgroundColor')).setStyles({
								
									zIndex: options.zIndex + 1,
									position: 'relative'
							})
						});
						
						//
						parent.setStyle(
							
								'backgroundColor', parent.getStyle('backgroundColor') == 'transparent' ? '#fff' : parent.getStyle('backgroundColor')
							).
							getChildren().each(function (el) {
							
								el.store('props', el.getStyles(prop)).setStyles({
								
									zIndex: el == this ? 2 : 0,
									position: position(el)
							})
						}.bind(this));
						
						parent.erase(_mask).get(_mask, {
								modal: true, 
								container: parent.erase('mask'),
								zIndex: options.zIndex,
								opacity: options.opacity,
								onClick: function () {
							
									this.get('expose').hide()
									
								}.bind(this)
								
							}).show()
							
					}.bind(this),
					onHide: function () {
				
						this.eliminate('o:' + _expose).getParents(':not(body):not(html)').each(function (el) { el.setStyles(el.retrieve('props')).eliminate('props') });
						
						//
						parent.erase(_mask).getChildren().each(function (el) {
						
							el.setStyles(el.retrieve('props')).eliminate('props')
						});
						
					}.bind(this)
				}))				
			},
			get: function (options) {
			
				return _get.apply(this, [options, _expose])
			},
			erase: function () {
		
				if(this.retrieve(_expose)) {
				
					this.retrieve(_expose).destroy();
					this.eliminate(_expose)
				}
				
				return this
			}
		}
		
		//mask appear on top of the element
		Element.Properties.mask = {
		
			set: function (options) {
			
				options = $merge(overlay, options, {container: this});
				
				if(!options.modal) options.onClick = function () {
				
					this.retrieve(_mask).hide()
					
				}.bind(this);
									
				return this.erase(_mask).store(_mask, new Overlay(options).addEvents({
				
					onShow: function () {
					
						this.store('o:' + _mask, true)
					}.bind(this),
					onHide: function () {
					
						this.eliminate('o:' + _mask)
					}.bind(this)
				}))
			},
			get: function (options) {
			
				return _get.apply(this, [options, _mask])
			},
			erase: function () {
		
				if(this.retrieve(_mask)) {
				
					this.retrieve(_mask).destroy();
					this.eliminate(_mask)
				}
				
				return this				
			}
		}
		
		//conflict the buit-in Element.expose, learnt the hard way :)
		/* Element.implement({
		
			expose: function (options) {
			
				this.get('expose', options).show();
				return this
			}
		}) */
		
	})(document.id);
	