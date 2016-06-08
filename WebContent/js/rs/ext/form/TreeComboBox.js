Ext.ns("Rs.ext.form");

(function(){
	
	/**
	 * Ê÷ÏÂÀ­¿ò
	 * 
	 * @class Rs.ext.form.TreeComboBox
	 * @extends Ext.form.TriggerField
	 */
	Rs.ext.form.TreeComboBox = Ext.extend(Ext.form.TriggerField, {

			width : 120,
		
			initComponent : function() {
				this.addEvents( [ 'select' ]);
				Rs.ext.form.TreeComboBox.superclass.initComponent.call(this);
				this.emptyText = 'Ñ¡Ôñ' + (this.name || '');
			},

			onRender : function(ct, pos) {
				Rs.ext.form.TreeComboBox.superclass.onRender.call(this, ct, pos);
				this.el.dom.readOnly = true;
				this.el.setStyle( { 
					'cursor' : 'pointer'
				});
				this.el.on('click', this.onTriggerClick, this);
			},
			
			onTriggerClick : function() {
				if(this.disabled)
					return;
				if(!this.view)
					this.initLayer();
				if(this.expanded) {
					this.collapse();
				} else {
					this.tree.collapseAll();
					this.expand();
				}
			},

			initLayer : function() {
				this.view = new Ext.Layer( {
					constrain : false,
					shadow : "sides",
					cls : " x-combo-list "
				});
				this.view.swallowEvent("mousewheel");
				this.view.swallowEvent("mousedown");
				this.resizer = new Ext.Resizable(this.view, {
					pinned : true,
					handles : 'se'
				});
				this.tree.render(this.view);
				this.resizer.on('resize', function(r, w, h) {
					this.tree.setWidth(w - 2);
					this.tree.setHeight(h - 2);
				}, this);
				this.on("blur", this.collapse, this);
				this.tree.getSelectionModel().on('selectionchange', this.onSelect, this);
			},

			expand : function() {
				this.view.alignTo(this.wrap, "tl-bl?");
				this.view.show();
				this.expanded = true;
				Ext.getDoc().on('mousewheel', this.collapseIf, this);
				Ext.getDoc().on('mousedown', this.collapseIf, this);
			},

			collapse : function() {
				this.view.hide();
				this.expanded = false;
				Ext.getDoc().un('mousewheel', this.collapseIf, this);
				Ext.getDoc().un('mousedown', this.collapseIf, this);
			},

			collapseIf : function(e) {
				if(!e.within(this.wrap) && !e.within(this.view)) {
					this.collapse();
				}
			},

			onSelect : function(sm, node) {
				var member = node.attributes;
				this.member = member;
				this.collapse();
				this.fireEvent('submit', this, member);
			},

			getValue : function() {
				return this.member;
			},

			setValue : function(member) {
				this.member = member;
				this.fireEvent('submit', this, member);
			},
			
			onDestroy : function() {
				Rs.ext.form.TreeComboBox.superclass.onDestroy.call(this);
				if(this.tree)
					this.tree.destroy();
				if(this.view)
					this.view.remove();
			}

		});

		Ext.ComponentMgr.registerType("rs-ext-treecombobox", Rs.ext.form.TreeComboBox);
	
})();