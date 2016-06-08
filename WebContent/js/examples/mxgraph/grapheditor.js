/*
 * $Id: GraphEditor.js,v 1.51 2010-10-21 12:19:00 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */
GraphEditor = {};

function main()
{
    Ext.QuickTips.init();

	// Disables browser context menu
	mxEvent.disableContextMenu(document.body);	
	
	// Makes the connection hotspot smaller
	mxConstants.DEFAULT_HOTSPOT = 0.3;
	
	// Makes the shadow brighter
	mxConstants.SHADOWCOLOR = '#C0C0C0';
    
	// Creates the graph and loads the default stylesheet
    var graph = new mxGraph();
    
    // Inverts the elbow edge style without removing existing styles
    graph.flipEdge = function(edge)
    {
		if (edge != null)
		{
			var state = this.view.getState(edge);
			var style = (state != null) ? state.style : this.getCellStyle(edge);
			
			if (style != null)
			{
				var elbow = mxUtils.getValue(style, mxConstants.STYLE_ELBOW,
					mxConstants.ELBOW_HORIZONTAL);
				var value = (elbow == mxConstants.ELBOW_HORIZONTAL) ?
					mxConstants.ELBOW_VERTICAL : mxConstants.ELBOW_HORIZONTAL;
				this.setCellStyles(mxConstants.STYLE_ELBOW, value, [edge]);
			}
		}
    };
    
    // Creates the command history (undo/redo)
    var history = new mxUndoManager();

    // Loads the default stylesheet into the graph
    var node = mxUtils.load('resources/default-style.xml').getDocumentElement();
		var dec = new mxCodec(node.ownerDocument);
		dec.decode(node, graph.getStylesheet());
	
	// Sets the style to be used when an elbow edge is double clicked
	graph.alternateEdgeStyle = 'vertical';
	
	// Creates the main containers
	var mainPanel = new MainPanel(graph, history);
	var library = new LibraryPanel();
	
	var store = new Ext.data.ArrayStore({
	    fields: ['name']
	});
    store.loadData([['test'], ['test2']]);
    
    var updateHandler = function()
    {
		var data = [];
		var names = DiagramStore.getNames();
		
		for (var i = 0; i < names.length; i++)
		{
			data.push([names[i]]);
		}
		
		store.loadData(data);
    };
    
    DiagramStore.addListener('put', updateHandler);
    DiagramStore.addListener('remove', updateHandler);
    updateHandler();
    
	var diagramPanel = new DiagramPanel(store, mainPanel);
	
	diagramPanel.on('dblclick', function(view, index, node, e)
	{
		var name = store.getAt(index).get('name');
		mainPanel.openDiagram(name);
	});
	
	var tabItems = (DiagramStore.isAvailable()) ? [library, diagramPanel] : [library];
	
    // Creates the container for the outline
	var tabPanel = new Ext.TabPanel(
	{
		id: 'tabPanel',
		region: 'center',
		activeTab: 0,
		width: 180,
		items: tabItems
    });
	
    // Creates the container for the outline
	var mainTabPanel = new Ext.TabPanel(
	{
		id: 'mainTabPanel',
		region: 'center',
		activeTab: 0,
		items: [mainPanel]
    });
	
    // Creates the container for the outline
	var outlinePanel = new Ext.Panel(
	{
		id: 'outlinePanel',
		layout: 'fit',
		split: true,
		height: 200,
        region:'south'
    });

	// Creates the enclosing viewport
    var viewport = new Ext.Viewport(
    {
    	layout:'border',
    	items:
        [{
	        xtype: 'panel',
	       	margins: '5 5 5 5',
	        region: 'center',
	        layout: 'border',
	        border: false,
        	items:
        	[
	            new Ext.Panel(
	            {
			        region: 'west',
			        layout: 'border',
			        split: true,
			        width: 180,
			        border: false,
			        items:
			        [
			         	tabPanel,
			        	outlinePanel
					]
		    	}),
		    	mainTabPanel
        	]
       	  } // end master panel
       	] // end viewport items
    }); // end of new Viewport

    // Enables scrollbars for the graph container to make it more
    // native looking, this will affect the panning to use the
    // scrollbars rather than moving the container contents inline
   	mainPanel.graphPanel.body.dom.style.overflow = 'auto';

    // Installs the command history after the initial graph
    // has been created
	var listener = function(sender, evt)
	{
		history.undoableEditHappened(evt.getProperty('edit'));
	};
	
	graph.getModel().addListener(mxEvent.UNDO, listener);
	graph.getView().addListener(mxEvent.UNDO, listener);

	// Keeps the selection in sync with the history
	var undoHandler = function(sender, evt)
	{
		var changes = evt.getProperty('edit').changes;
		graph.setSelectionCells(graph.getSelectionCellsForChanges(changes));
	};
	
	history.addListener(mxEvent.UNDO, undoHandler);
	history.addListener(mxEvent.REDO, undoHandler);

	// Initializes the graph as the DOM for the panel has now been created	
    graph.init(mainPanel.graphPanel.body.dom);
    
    if (mxClient.IS_GC || mxClient.IS_SF)
    {
    	graph.container.style.background = '-webkit-gradient(linear, 0% 0%, 100% 0%, from(#FFFFFF), to(#FFFFEE))';
    }
    else if (mxClient.IS_NS)
    {
    	graph.container.style.background = '-moz-linear-gradient(left, #FFFFFF, #FFFFEE)';  
    }
    else if (mxClient.IS_IE)
    {
    	graph.container.style.filter = 'progid:DXImageTransform.Microsoft.Gradient('+
                'StartColorStr=\'#FFFFFF\', EndColorStr=\'#FFFFEE\', GradientType=1)';
    }
    
    graph.setConnectable(true);
	graph.setDropEnabled(true);
    graph.setPanning(true);
    graph.setTooltips(true);
    graph.connectionHandler.setCreateTarget(true);
    
    // Sets the cursor
    graph.container.style.cursor = 'default';

	// Creates rubberband selection
    var rubberband = new mxRubberband(graph);

	// Adds some example cells into the graph
	mainPanel.newDiagram();
    var parent = graph.getDefaultParent();
	graph.getModel().beginUpdate();
	try
	{
		var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 40, 'rounded=1');
		var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 40, 'rounded=1');
		var e1 = graph.insertEdge(parent, null, 'Hello, World!', v1, v2);
	}
	finally
	{
		// Updates the display
		graph.getModel().endUpdate();
	}

	// Toolbar object for updating buttons in listeners
	var toolbarItems = mainPanel.graphPanel.getTopToolbar().items;
	
	// Hides the buttons which are only used if we have client-side storage
	if (!DiagramStore.isAvailable())
	{
		toolbarItems.get('saveButton').setVisible(false);
		toolbarItems.get('saveAsButton').setVisible(false);
	}
	
    // Updates the states of all buttons that require a selection
    var selectionListener = function()
    {
    	var selected = !graph.isSelectionEmpty();
    	
    	toolbarItems.get('cut').setDisabled(!selected);
    	toolbarItems.get('copy').setDisabled(!selected);
    	toolbarItems.get('delete').setDisabled(!selected);
    	toolbarItems.get('italic').setDisabled(!selected);
    	toolbarItems.get('bold').setDisabled(!selected);
    	toolbarItems.get('underline').setDisabled(!selected);
    	toolbarItems.get('fillcolor').setDisabled(!selected);
    	toolbarItems.get('fontcolor').setDisabled(!selected);
    	toolbarItems.get('linecolor').setDisabled(!selected);
    	toolbarItems.get('align').setDisabled(!selected);
    };
    
    graph.getSelectionModel().addListener(mxEvent.CHANGE, selectionListener);

    // Updates the states of the undo/redo buttons in the toolbar
    var historyListener = function()
    {
    	toolbarItems.get('undo').setDisabled(!history.canUndo());
    	toolbarItems.get('redo').setDisabled(!history.canRedo());
    };

	history.addListener(mxEvent.ADD, historyListener);
	history.addListener(mxEvent.UNDO, historyListener);
	history.addListener(mxEvent.REDO, historyListener);
	
	// Updates the button states once
	selectionListener();
	historyListener();
	
    // Installs outline in outlinePanel
	var outline = new mxOutline(graph, outlinePanel.body.dom);
	outlinePanel.body.dom.style.cursor = 'move';
	
    // Adds the entries into the library
    insertVertexTemplate(library, graph, 'Container', 'images/swimlane.gif', 'swimlane', 200, 200, 'Container');
    insertVertexTemplate(library, graph, 'Icon', 'images/rounded.gif', 'icon;image=images/wrench.png', 70, 70, "Icon");
    insertVertexTemplate(library, graph, 'Label', 'images/rounded.gif', 'label;image=images/gear.png', 130, 50, "Label");
    insertVertexTemplate(library, graph, 'Rectangle', 'images/rectangle.gif', null, 120, 50);
    insertVertexTemplate(library, graph, 'Rounded Rectangle', 'images/rounded.gif', 'rounded=1', 120, 50);
    insertVertexTemplate(library, graph, 'Ellipse', 'images/ellipse.gif', 'ellipse', 50, 50);
    insertVertexTemplate(library, graph, 'Double Ellipse', 'images/doubleellipse.gif', 'ellipse;shape=doubleEllipse', 50, 50);
    insertVertexTemplate(library, graph, 'Triangle', 'images/triangle.gif', 'triangle', 50, 70);
    insertVertexTemplate(library, graph, 'Rhombus', 'images/rhombus.gif', 'rhombus', 50, 50);
	  insertVertexTemplate(library, graph, 'Horizontal Line', 'images/hline.gif', 'line', 120, 10);
    insertVertexTemplate(library, graph, 'Hexagon', 'images/hexagon.gif', 'shape=hexagon', 90, 70);
    insertVertexTemplate(library, graph, 'Cylinder', 'images/cylinder.gif', 'shape=cylinder', 70, 90);
    insertVertexTemplate(library, graph, 'Actor', 'images/actor.gif', 'shape=actor', 70, 90);
    insertVertexTemplate(library, graph, 'Cloud', 'images/cloud.gif', 'ellipse;shape=cloud', 90, 70);

    /*insertImageTemplate(library, graph, 'Bell', 'images/bell.png', false);
    insertImageTemplate(library, graph, 'Box', 'images/box.png', false);
    insertImageTemplate(library, graph, 'Cube', 'images/cube_green.png', false);
    insertImageTemplate(library, graph, 'User', 'images/dude3.png', true);
    insertImageTemplate(library, graph, 'Earth', 'images/earth.png', true);
    insertImageTemplate(library, graph, 'Gear', 'images/gear.png', true);
    insertImageTemplate(library, graph, 'Home', 'images/house.png', false);
    insertImageTemplate(library, graph, 'Package', 'images/package.png', false);
    insertImageTemplate(library, graph, 'Printer', 'images/printer.png', false);
    insertImageTemplate(library, graph, 'Server', 'images/server.png', false);
    insertImageTemplate(library, graph, 'Workplace', 'images/workplace.png', false);
    insertImageTemplate(library, graph, 'Wrench', 'images/wrench.png', true);
    */
    insertImageTemplate(library, graph, 'Bell1', 'images/Resources/Elbow1.png', false);
    insertImageTemplate(library, graph, 'Bell2', 'images/Resources/Elbow2.png', false);
    insertImageTemplate(library, graph, 'Bell3', 'images/Resources/Elbow3.png', false);
    insertImageTemplate(library, graph, 'Bell4', 'images/Resources/Elbow4.png', false);
    
    insertSymbolTemplate(library, graph, 'Cancel', 'images/symbols/cancel_end.png', false);
    insertSymbolTemplate(library, graph, 'Error', 'images/symbols/error.png', false);
    insertSymbolTemplate(library, graph, 'Event', 'images/symbols/event.png', false);
    insertSymbolTemplate(library, graph, 'Fork', 'images/symbols/fork.png', true);
    insertSymbolTemplate(library, graph, 'Inclusive', 'images/symbols/inclusive.png', true);
    insertSymbolTemplate(library, graph, 'Link', 'images/symbols/link.png', false);
    insertSymbolTemplate(library, graph, 'Merge', 'images/symbols/merge.png', true);
    insertSymbolTemplate(library, graph, 'Message', 'images/symbols/message.png', false);
    insertSymbolTemplate(library, graph, 'Multiple', 'images/symbols/multiple.png', false);
    insertSymbolTemplate(library, graph, 'Rule', 'images/symbols/rule.png', false);
    insertSymbolTemplate(library, graph, 'Terminate', 'images/symbols/terminate.png', false);
    insertSymbolTemplate(library, graph, 'Timer', 'images/symbols/timer.png', false);

	insertEdgeTemplate(library, graph, 'Straight', 'images/straight.gif', 'straight', 100, 100);
	insertEdgeTemplate(library, graph, 'Horizontal Connector', 'images/connect.gif', null, 100, 100);
    insertEdgeTemplate(library, graph, 'Vertical Connector', 'images/vertical.gif', 'vertical', 100, 100);
    insertEdgeTemplate(library, graph, 'Entity Relation', 'images/entity.gif', 'entity', 100, 100);
	insertEdgeTemplate(library, graph, 'Arrow', 'images/arrow.gif', 'arrow', 100, 100);
    
    // Overrides createGroupCell to set the group style for new groups to 'group'
    var previousCreateGroupCell = graph.createGroupCell;
    
    graph.createGroupCell = function()
    {
    	var group = previousCreateGroupCell.apply(this, arguments);
    	group.setStyle('group');
    	
    	return group;
    };

    graph.connectionHandler.factoryMethod = function()
    {
		if (GraphEditor.edgeTemplate != null)
		{
    		return graph.cloneCells([GraphEditor.edgeTemplate])[0];
    	}
		
		return null;
    };

    // Uses the selected edge in the library as a template for new edges
    library.getSelectionModel().on('selectionchange', function(sm, node)
    {
    	if (node != null &&
    		node.attributes.cells != null)
    	{
    		var cell = node.attributes.cells[0];
    		
    		if (cell != null &&
    			graph.getModel().isEdge(cell))
    		{
    			GraphEditor.edgeTemplate = cell;
    		}
    	}
    });

    // Redirects tooltips to ExtJs tooltips. First a tooltip object
    // is created that will act as the tooltip for all cells.
  	var tooltip = new Ext.ToolTip(
	{
        target: graph.container,
        html: ''
    });
    
    // Disables the built-in event handling
    tooltip.disabled = true;
    
    // Installs the tooltip by overriding the hooks in mxGraph to
    // show and hide the tooltip.
    graph.tooltipHandler.show = function(tip, x, y)
    {
    	if (tip != null &&
    		tip.length > 0)
    	{
    		// Changes the DOM of the tooltip in-place if
    		// it has already been rendered
	    	if (tooltip.body != null)
	    	{
	    		// TODO: Use mxUtils.isNode(tip) and handle as markup,
	    		// problem is dom contains some other markup so the
	    		// innerHTML is not a good place to put the markup
	    		// and this method can also not be applied in
	    		// pre-rendered state (see below)
	    		//tooltip.body.dom.innerHTML = tip.replace(/\n/g, '<br>');
				tooltip.body.dom.firstChild.nodeValue = tip;
	    	}
	    	
	    	// Changes the html config value if the tooltip
	    	// has not yet been rendered, in which case it
	    	// has no DOM nodes associated
	    	else
	    	{
	    		tooltip.html = tip;
	    	}
	    	
	    	tooltip.showAt([x, y + mxConstants.TOOLTIP_VERTICAL_OFFSET]);
	    }
    };
    
    graph.tooltipHandler.hide = function()
    {
    	tooltip.hide();
    };

    // Updates the document title if the current root changes (drilling)
	var drillHandler = function(sender)
	{
		var model = graph.getModel();
		var cell = graph.getCurrentRoot();
		var title = '';
		
		while (cell != null &&
			  model.getParent(model.getParent(cell)) != null)
		{
			// Append each label of a valid root
			if (graph.isValidRoot(cell))
			{
				title = ' > ' +
				graph.convertValueToString(cell) + title;
			}
			
			cell = graph.getModel().getParent(cell);
		}
		
		document.title = 'Graph Editor' + title;
	};
		
	graph.getView().addListener(mxEvent.DOWN, drillHandler);
	graph.getView().addListener(mxEvent.UP, drillHandler);

	// Transfer initial focus to graph container for keystroke handling
	graph.container.focus();
	    
    // Handles keystroke events
    var keyHandler = new mxKeyHandler(graph);
    
    // Ignores enter keystroke. Remove this line if you want the
    // enter keystroke to stop editing
    keyHandler.enter = function() {};
    
    keyHandler.bindKey(8, function()
    {
    	graph.foldCells(true);
    });
    
    keyHandler.bindKey(13, function()
    {
    	graph.foldCells(false);
    });
    
    keyHandler.bindKey(33, function()
    {
    	graph.exitGroup();
    });
    
    keyHandler.bindKey(34, function()
    {
    	graph.enterGroup();
    });
    
    keyHandler.bindKey(36, function()
    {
    	graph.home();
    });

    keyHandler.bindKey(35, function()
    {
    	graph.refresh();
    });
    
    keyHandler.bindKey(37, function()
    {
    	graph.selectPreviousCell();
    });
        
    keyHandler.bindKey(38, function()
    {
    	graph.selectParentCell();
    });

    keyHandler.bindKey(39, function()
    {
    	graph.selectNextCell();
    });
    
    keyHandler.bindKey(40, function()
    {
    	graph.selectChildCell();
    });
    
    keyHandler.bindKey(46, function()
    {
    	graph.removeCells();
    });
    
    keyHandler.bindKey(107, function()
    {
    	graph.zoomIn();
    });
    
    keyHandler.bindKey(109, function()
    {
    	graph.zoomOut();
    });
    
    keyHandler.bindKey(113, function()
    {
    	graph.startEditingAtCell();
    });
  
    keyHandler.bindControlKey(65, function()
    {
    	graph.selectAll();
    });

    keyHandler.bindControlKey(89, function()
    {
    	history.redo();
    });
    
    keyHandler.bindControlKey(90, function()
    {
    	history.undo();
    });
    
    keyHandler.bindControlKey(88, function()
    {
    	mxClipboard.cut(graph);
    });
    
    keyHandler.bindControlKey(67, function()
    {
    	mxClipboard.copy(graph);
    });
    
    keyHandler.bindControlKey(86, function()
    {
    	mxClipboard.paste(graph);
    });
    
    keyHandler.bindControlKey(71, function()
    {
    	graph.setSelectionCell(graph.groupCells(null, 20));
    });
    
    keyHandler.bindControlKey(85, function()
    {
    	graph.setSelectionCells(graph.ungroupCells());
    });
}; // end of main

function insertSymbolTemplate(panel, graph, name, icon, rhombus)
{
    var imagesNode = panel.symbols;
    var style = (rhombus) ? 'rhombusImage' : 'roundImage';
    return insertVertexTemplate(panel, graph, name, icon, style+';image='+icon, 50, 50, '', imagesNode);
};

function insertImageTemplate(panel, graph, name, icon, round)
{
    var imagesNode = panel.images;
    var style = (round) ? 'roundImage' : 'image';
    return insertVertexTemplate(panel, graph, name, icon, style+';image='+icon, 50, 50, name, imagesNode);
};

function insertVertexTemplate(panel, graph, name, icon, style, width, height, value, parentNode)
{
		var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style)];
		cells[0].vertex = true;
		
		var funct = function(graph, evt, target)
		{
			cells = graph.getImportableCells(cells);
			
			if (cells.length > 0)
			{
				var validDropTarget = (target != null) ?
					graph.isValidDropTarget(target, cells, evt) : false;
				var select = null;
				
				if (target != null &&
					!validDropTarget &&
					graph.getModel().getChildCount(target) == 0 &&
					graph.getModel().isVertex(target) == cells[0].vertex)
				{
					graph.getModel().setStyle(target, style);
					select = [target];
				}
				else
				{
					if (target != null &&
						!validDropTarget)
					{
						target = null;
					}
					
					var pt = graph.getPointForEvent(evt);
					
					// Splits the target edge or inserts into target group
					if (graph.isSplitEnabled() &&
						graph.isSplitTarget(target, cells, evt))
					{
						graph.splitEdge(target, cells, null, pt.x, pt.y);
						select = cells;
					}
					else
					{
						cells = graph.getImportableCells(cells);
						
						if (cells.length > 0)
						{
							select = graph.importCells(cells, pt.x, pt.y, target);
						}
					}
				}
				
				if (select != null &&
					select.length > 0)
				{
					graph.scrollCellToVisible(select[0]);
					graph.setSelectionCells(select);
				}
			}
		};
		
		// Small hack to install the drag listener on the node's DOM element
		// after it has been created. The DOM node does not exist if the parent
		// is not expanded.
		var node = panel.addTemplate(name, icon, parentNode, cells);
		var installDrag = function(expandedNode)
		{
			if (node.ui.elNode != null)
			{
				// Creates the element that is being shown while the drag is in progress
				var dragPreview = document.createElement('div');
				dragPreview.style.border = 'dashed black 1px';
				dragPreview.style.width = width+'px';
				dragPreview.style.height = height+'px';
				
				mxUtils.makeDraggable(node.ui.elNode, graph, funct, dragPreview, 0, 0,
						graph.autoscroll, true);
			}
		};
		
		if (!node.parentNode.isExpanded())
		{
			panel.on('expandnode', installDrag);
		}
		else
		{
			installDrag(node.parentNode);
		}
		
		return node;
};

function insertEdgeTemplate(panel, graph, name, icon, style, width, height, value, parentNode)
{
		var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style)];
		cells[0].geometry.setTerminalPoint(new mxPoint(0, height), true);
		cells[0].geometry.setTerminalPoint(new mxPoint(width, 0), false);
		cells[0].edge = true;
		
		var funct = function(graph, evt, target)
		{
			cells = graph.getImportableCells(cells);
			
			if (cells.length > 0)
			{
				var validDropTarget = (target != null) ?
					graph.isValidDropTarget(target, cells, evt) : false;
				var select = null;
				
				if (target != null &&
					!validDropTarget)
				{
					target = null;
				}
				
				var pt = graph.getPointForEvent(evt);
				var scale = graph.view.scale;
				
				pt.x -= graph.snap(width / 2);
				pt.y -= graph.snap(height / 2);
				
				select = graph.importCells(cells, pt.x, pt.y, target);
				
				// Uses this new cell as a template for all new edges
				GraphEditor.edgeTemplate = select[0];
				
				graph.scrollCellToVisible(select[0]);
				graph.setSelectionCells(select);
			}
		};
		
		// Small hack to install the drag listener on the node's DOM element
		// after it has been created. The DOM node does not exist if the parent
		// is not expanded.
		var node = panel.addTemplate(name, icon, parentNode, cells);
		var installDrag = function(expandedNode)
		{
			if (node.ui.elNode != null)
			{
				// Creates the element that is being shown while the drag is in progress
				var dragPreview = document.createElement('div');
				dragPreview.style.border = 'dashed black 1px';
				dragPreview.style.width = width+'px';
				dragPreview.style.height = height+'px';
				
				mxUtils.makeDraggable(node.ui.elNode, graph, funct, dragPreview, -width / 2, -height / 2,
						graph.autoscroll, true);
			}
		};
		
		if (!node.parentNode.isExpanded())
		{
			panel.on('expandnode', installDrag);
		}
		else
		{
			installDrag(node.parentNode);
		}
		
		return node;
};

// Defines a global functionality for displaying short information messages
Ext.example = function(){
    var msgCt;

    function createBox(t, s){
        return ['<div class="msg">',
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
                '</div>'].join('');
    }
    return {
        msg : function(title, format){
            if(!msgCt){
                msgCt = Ext.DomHelper.append(document.body, {id:'msg-div'}, true);
            }
            msgCt.alignTo(document, 't-t');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, {html:createBox(title, s)}, true);
            m.slideIn('t').pause(1).ghost("t", {remove:true});
        }
    };
}();

/**************************************************************************************************************************************************************************/

/*
 * $Id: MainPanel.js,v 1.86 2011-02-05 19:35:06 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */
MainPanel = function(graph, history)
{
	var executeLayout = function(layout, animate, ignoreChildCount)
	{
		var cell = graph.getSelectionCell();
		
		if (cell == null ||
			(!ignoreChildCount &&
			graph.getModel().getChildCount(cell) == 0))
		{
			cell = graph.getDefaultParent();
		}

		graph.getModel().beginUpdate();
		try
		{
			layout.execute(cell);
		}
		catch (e)
		{
			throw e;
		}
		finally
		{
			// Animates the changes in the graph model except
			// for Camino, where animation is too slow
			if (animate && navigator.userAgent.indexOf('Camino') < 0)
			{
				// New API for animating graph layout results asynchronously
				var morph = new mxMorphing(graph);
				morph.addListener(mxEvent.DONE, function()
				{
					graph.getModel().endUpdate();
				});
				
				morph.startAnimation();
			}
			else
			{
				graph.getModel().endUpdate();
			}
		}
        
	};
	
	// Defines various color menus for different colors
    var fillColorMenu = new Ext.menu.ColorMenu(
    {
    	items: [
    	{
    		text: 'None',
    		handler: function()
    		{
    			graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, mxConstants.NONE);
    		}
    	},
    	'-'
    	],
        handler : function(cm, color)
        {
    		if (typeof(color) == "string")
    		{
				graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#'+color);
			}
        }
    });

    var gradientColorMenu = new Ext.menu.ColorMenu(
    {
		items: [
        {
            text: 'North',
            handler: function()
            {
                graph.setCellStyles(mxConstants.STYLE_GRADIENT_DIRECTION, mxConstants.DIRECTION_NORTH);
            }
        },
        {
            text: 'East',
            handler: function()
            {
                graph.setCellStyles(mxConstants.STYLE_GRADIENT_DIRECTION, mxConstants.DIRECTION_EAST);
            }
        },
        {
            text: 'South',
            handler: function()
            {
                graph.setCellStyles(mxConstants.STYLE_GRADIENT_DIRECTION, mxConstants.DIRECTION_SOUTH);
            }
        },
        {
            text: 'West',
            handler: function()
            {
                graph.setCellStyles(mxConstants.STYLE_GRADIENT_DIRECTION, mxConstants.DIRECTION_WEST);
            }
        },
        '-',
		{
			text: 'None',
			handler: function()
			{
        		graph.setCellStyles(mxConstants.STYLE_GRADIENTCOLOR, mxConstants.NONE);
        	}
		},
		'-'
		],
        handler : function(cm, color)
        {
    		if (typeof(color) == "string")
    		{
    			graph.setCellStyles(mxConstants.STYLE_GRADIENTCOLOR, '#'+color);
			}
        }
    });

    var fontColorMenu = new Ext.menu.ColorMenu(
    {
    	items: [
    	{
    		text: 'None',
    		handler: function()
    		{
    			graph.setCellStyles(mxConstants.STYLE_FONTCOLOR, mxConstants.NONE);
    		}
    	},
    	'-'
    	],
        handler : function(cm, color)
        {
    		if (typeof(color) == "string")
    		{
    			graph.setCellStyles(mxConstants.STYLE_FONTCOLOR, '#'+color);
			}
        }
    });

    var lineColorMenu = new Ext.menu.ColorMenu(
    {
    	items: [
		{
			text: 'None',
			handler: function()
			{
				graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, mxConstants.NONE);
			}
		},
		'-'
		],
        handler : function(cm, color)
        {
    		if (typeof(color) == "string")
    		{
				graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#'+color);
			}
        }
    });

    var labelBackgroundMenu = new Ext.menu.ColorMenu(
    {
		items: [
		{
			text: 'None',
			handler: function()
			{
				graph.setCellStyles(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, mxConstants.NONE);
			}
		},
		'-'
		],
        handler : function(cm, color)
        {
    		if (typeof(color) == "string")
    		{
    			graph.setCellStyles(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, '#'+color);
    		}
        }
    });

    var labelBorderMenu = new Ext.menu.ColorMenu(
    {
		items: [
		{
			text: 'None',
			handler: function()
			{
				graph.setCellStyles(mxConstants.STYLE_LABEL_BORDERCOLOR, mxConstants.NONE);
			}
		},
		'-'
		],
        handler : function(cm, color)
        {
    		if (typeof(color) == "string")
    		{
    			graph.setCellStyles(mxConstants.STYLE_LABEL_BORDERCOLOR, '#'+color);
			}
        }
    });
    
    // Defines the font family menu
    var fonts = new Ext.data.SimpleStore(
    {
        fields: ['label', 'font'],
        data : [['Helvetica', 'Helvetica'], ['Verdana', 'Verdana'],
        	['Times New Roman', 'Times New Roman'], ['Garamond', 'Garamond'],
        	['Courier New', 'Courier New']]
    });
    
    var fontCombo = new Ext.form.ComboBox(
    {
        store: fonts,
        displayField:'label',
        mode: 'local',
        width:120,
        triggerAction: 'all',
        emptyText:'Select a font...',
        selectOnFocus:true,
        onSelect: function(entry)
        {
        	if (entry != null)
        	{
				graph.setCellStyles(mxConstants.STYLE_FONTFAMILY, entry.data.font);
				this.collapse();
        	}
        }
    });
    
	// Handles typing a font name and pressing enter
    fontCombo.on('specialkey', function(field, evt)
    {
    	if (evt.keyCode == 10 ||
    		evt.keyCode == 13)
    	{
    		var family = field.getValue();
    		
    		if (family != null &&
    			family.length > 0)
    		{
    			graph.setCellStyles(mxConstants.STYLE_FONTFAMILY, family);
    		}
    	}
    });

    // Defines the font size menu
    var sizes = new Ext.data.SimpleStore({
        fields: ['label', 'size'],
        data : [['6pt', 6], ['8pt', 8], ['9pt', 9], ['10pt', 10], ['12pt', 12],
        	['14pt', 14], ['18pt', 18], ['24pt', 24], ['30pt', 30], ['36pt', 36],
        	['48pt', 48],['60pt', 60]]
    });
    
    var sizeCombo = new Ext.form.ComboBox(
    {
        store: sizes,
        displayField:'label',
        mode: 'local',
        width:50,
        triggerAction: 'all',
        emptyText:'12pt',
        selectOnFocus:true,
        onSelect: function(entry)
        {
        	if (entry != null)
        	{
				graph.setCellStyles(mxConstants.STYLE_FONTSIZE, entry.data.size);
				this.collapse();
        	}
        }
    });
    
	// Handles typing a font size and pressing enter
    sizeCombo.on('specialkey', function(field, evt)
    {
    	if (evt.keyCode == 10 ||
    		evt.keyCode == 13)
    	{
    		var size = parseInt(field.getValue());
    		
    		if (!isNaN(size) &&
    			size > 0)
    		{
    			graph.setCellStyles(mxConstants.STYLE_FONTSIZE, size);
    		}
    	}
    });
    
    var sizeCombo = new Ext.form.ComboBox(
    {
        store: sizes,
        displayField:'label',
        mode: 'local',
        width:50,
        triggerAction: 'all',
        emptyText:'12pt',
        selectOnFocus:true,
        onSelect: function(entry)
        {
        	if (entry != null)
        	{
				graph.setCellStyles(mxConstants.STYLE_FONTSIZE, entry.data.size);
				this.collapse();
        	}
        }
    });
    
    // Simplified file and modified state handling
    this.filename = null;
    this.modified = false;

	var updateTitle = mxUtils.bind(this, function()
	{
		this.setTitle((this.filename || 'New Diagram') + ((this.modified) ? ' *' : '') + ' ');
	});
    
	var changeHandler = mxUtils.bind(this, function(sender, evt)
	{
		this.modified = true;
		updateTitle();
	});
	
	graph.getModel().addListener(mxEvent.CHANGE, changeHandler);
    
    this.saveDiagram = function(forceDialog)
    {
    	var name = this.filename;
    	
    	if (name == null ||
    		forceDialog)
    	{
        	var defaultValue = this.filename;
        	
        	if (defaultValue == null)
        	{
        		defaultValue = "MyDiagram";
	        	var current = defaultValue;
	        	
	        	// Finds unused filename
	        	var i = 2;
	        	
	        	while (DiagramStore.get(current) != null)
	        	{
	        		current = defaultValue + i++;
	        	}
	        	
	        	defaultValue = current;
        	}
    		
    		do
    		{
	    		name = mxUtils.prompt('Enter filename', defaultValue);
	    		
	    		if (name != null)
	    		{
		    		if (name.length > 0)
		    		{
		    			if (name != this.filename &&
		    				DiagramStore.get(name) != null)
		    			{
		    				alert('File exists, please choose a different name');
		    				defaultValue = name;
		    				name = '';
		    			}
		    		}
		    		else
		    		{
		    			alert('Please choose a name');
		    		}
	    		}
    		}
    		while (name != null && name.length == 0);
    	}
    	
    	if (name != null)
    	{
    		var enc = new mxCodec(mxUtils.createXmlDocument());
			var node = enc.encode(graph.getModel());
			var xml = mxUtils.getXml(node);
			DiagramStore.put(name, xml);
			this.filename = name;
			this.modified = false;
			updateTitle();
			mxUtils.alert('Saved "'+name+'": '+xml.length+' byte(s)');
    	}
    	else
    	{
    		mxUtils.alert('Not saved');
    	}
    };
    
    this.openDiagram = function(name)
    {
    	if (!this.modified ||
    		mxUtils.confirm('Lose changes?'))
   		{
			var xml = DiagramStore.get(name);
			
			if (xml != null && xml.length > 0)
			{
				var doc = mxUtils.parseXml(xml); 
				var dec = new mxCodec(doc); 
				dec.decode(doc.documentElement, graph.getModel());
				history.clear();
				this.filename = name;
				this.modified = false;
				updateTitle();
				mxUtils.alert('Opened "'+name+'": '+xml.length+' byte(s)');
			}
   		}
    };

    this.newDiagram = function()
    {
    	if (!this.modified ||
    		mxUtils.confirm('Lose changes?'))
   		{
	    	var cell = new mxCell();
	    	cell.insert(new mxCell());
	    	graph.getModel().setRoot(cell);
	    	history.clear();
	    	this.filename = null;
			this.modified = false;
	    	updateTitle();
   		}
    };

	this.graphPanel = new Ext.Panel(
    {
    	region: 'center',
    	border:false,
        tbar:[     
        {
            text:'',
            iconCls: 'new-icon',
            tooltip: 'New Diagram',
            handler: function()
            {
        		this.newDiagram();
            },
            scope:this
        },
        {
        	id: 'saveButton',
            text:'',
            iconCls: 'save-icon',
            tooltip: 'Save Diagram',
            handler: function()
            {
        		this.saveDiagram();
            },
            scope:this
        },
        {
        	id: 'saveAsButton',
            text:'',
            iconCls: 'saveas-icon',
            tooltip: 'Save Diagram As',
            handler: function()
            {
        		this.saveDiagram(true);
            },
            scope:this
        },
        '-',
        {
        	id: 'print',
            text:'',
            iconCls: 'print-icon',
            tooltip: 'Print Preview',
            handler: function()
            {
        		var preview = new mxPrintPreview(graph);
        		preview.autoOrigin = false;
        		preview.open();
            },
            scope:this
        },
        {
        	id: 'posterprint',
            text:'',
            iconCls: 'press-icon',
            tooltip: 'Poster Print Preview',
            handler: function()
            {
	        	try
	        	{
	        		var pageCount = mxUtils.prompt('Enter maximum page count', '1');
					
					if (pageCount != null)
					{
						var scale = mxUtils.getScaleForPageCount(pageCount, graph);
						var preview = new mxPrintPreview(graph, scale);
						preview.open();
					}
	        	}
	        	catch (e)
	        	{
	        		// ignore
	        	}
            },
            scope:this
        },
        {
        	id: 'view',
            text:'',
            iconCls: 'preview-icon',
            tooltip: 'Show',
            handler: function()
            {
        		mxUtils.show(graph, null, 10, 10);
            },
            scope:this
        },
        '-',
        {
        	id: 'cut',
            text:'',
            iconCls: 'cut-icon',
            tooltip: 'Cut',
            handler: function()
            {
        		mxClipboard.cut(graph);
        	},
            scope:this
        },{
       		id: 'copy',
            text:'',
            iconCls: 'copy-icon',
            tooltip: 'Copy',
            handler: function()
            {
        		mxClipboard.copy(graph);
        	},
            scope:this
        },{
            text:'',
            iconCls: 'paste-icon',
            tooltip: 'Paste',
            handler: function()
            {
            	mxClipboard.paste(graph);
            },
            scope:this
        },
        '-',
        {
       		id: 'delete',
            text:'',
            iconCls: 'delete-icon',
            tooltip: 'Delete',
            handler: function()
            {
        		graph.removeCells();
        	},
            scope:this
        },
        '-',
        {
        	id: 'undo',
            text:'',
            iconCls: 'undo-icon',
            tooltip: 'Undo',
            handler: function()
            {
            	history.undo();
            },
            scope:this
        },{
        	id: 'redo',
            text:'',
            iconCls: 'redo-icon',
            tooltip: 'Redo',
            handler: function()
            {
        		history.redo();
            },
            scope:this
        },
        '-',
        fontCombo,
        ' ',
        sizeCombo,
        '-',
		{
			id: 'bold',
            text: '',
            iconCls:'bold-icon',
            tooltip: 'Bold',
            handler: function()
            {
        		graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_BOLD);
        	},
            scope:this
        },
		{
			id: 'italic',
            text: '',
            tooltip: 'Italic',
            iconCls:'italic-icon',
            handler: function()
            {
            	graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_ITALIC);
            },
            scope:this
        },
		{
			id: 'underline',
            text: '',
            tooltip: 'Underline',
            iconCls:'underline-icon',
            handler: function()
            {
        		graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_UNDERLINE);
        	},
            scope:this
        },
        '-',
        {
            id: 'align',
            text:'',
            iconCls: 'left-icon',
            tooltip: 'Text Alignment',
            handler: function() { },
            menu:
            {
                id:'reading-menu',
                cls:'reading-menu',
                items: [
                {
                    text:'Left',
                    checked:false,
                    group:'rp-group',
                    scope:this,
                    iconCls:'left-icon',
                    handler: function()
                    {
                		graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT);
                	}
                },
                {
                    text:'Center',
                    checked:true,
                    group:'rp-group',
                    scope:this,
                    iconCls:'center-icon',
                    handler: function()
                    {
                		graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
                	}
                },
                {
                    text:'Right',
                    checked:false,
                    group:'rp-group',
                    scope:this,
                    iconCls:'right-icon',
                    handler: function()
                    {
                		graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_RIGHT);
                	}
                },
                '-',
                {
                    text:'Top',
                    checked:false,
                    group:'vrp-group',
                    scope:this,
                    iconCls:'top-icon',
                    handler: function()
                    {
                		graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP);
                	}
                },
                {
                    text:'Middle',
                    checked:true,
                    group:'vrp-group',
                    scope:this,
                    iconCls:'middle-icon',
                    handler: function()
                    {
                		graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
                	}
                },
                {
                    text:'Bottom',
                    checked:false,
                    group:'vrp-group',
                    scope:this,
                    iconCls:'bottom-icon',
                    handler: function()
                    {
                		graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_BOTTOM);
                    }
                }]
            }
        },
        '-',
		{
			id: 'fontcolor',
            text: '',
            tooltip: 'Fontcolor',
            iconCls:'fontcolor-icon',
            menu: fontColorMenu // <-- submenu by reference
        },
		{
			id: 'linecolor',
            text: '',
            tooltip: 'Linecolor',
            iconCls:'linecolor-icon',
            menu: lineColorMenu // <-- submenu by reference
        },
		{
			id: 'fillcolor',
            text: '',
            tooltip: 'Fillcolor',
            iconCls:'fillcolor-icon',
            menu: fillColorMenu // <-- submenu by reference
        }],
        bbar:[
        {
            text:'Zoom',
            iconCls: 'zoom-icon',
            handler: function(menu) { },
            menu:
            {
                items: [
                {
		            text:'Custom',
		            scope:this,
		            handler: function(item)
		            {
		            	var value = mxUtils.prompt('Enter zoom (%)', parseInt(graph.getView().getScale() * 100));
										            	
		            	if (value != null)
		            	{
			            	graph.getView().setScale(parseInt(value) / 100);
			            }
		            }
		        },
		        '-',
                {
		            text:'400%',
		            scope:this,
		            handler: function(item)
		            {
						graph.getView().setScale(4);
		            }
		        },
                {
		            text:'200%',
		            scope:this,
		            handler: function(item)
		            {
						graph.getView().setScale(2);
		            }
		        },
                {
		            text:'150%',
		            scope:this,
		            handler: function(item)
		            {
						graph.getView().setScale(1.5);
		            }
		        },
		        {
		            text:'100%',
		            scope:this,
		            handler: function(item)
		            {
		                graph.getView().setScale(1);
		            }
		        },
                {
		            text:'75%',
		            scope:this,
		            handler: function(item)
		            {
						graph.getView().setScale(0.75);
		            }
		        },
                {
		            text:'50%',
		            scope:this,
		            handler: function(item)
		            {
						graph.getView().setScale(0.5);
		            }
		        },
                {
		            text:'25%',
		            scope:this,
		            handler: function(item)
		            {
						graph.getView().setScale(0.25);
		            }
		        },
                '-',
                {
		            text:'Zoom In',
		            iconCls: 'zoomin-icon',
		            scope:this,
		            handler: function(item)
		            {
						graph.zoomIn();
		            }
		        },
		        {
		            text:'Zoom Out',
		            iconCls: 'zoomout-icon',
		            scope:this,
		            handler: function(item)
		            {
		                graph.zoomOut();
		            }
		        },
		        '-',
		        {
		            text:'Actual Size',
		            iconCls: 'zoomactual-icon',
		            scope:this,
		            handler: function(item)
		            {
		                graph.zoomActual();
		            }
		        },
		        {
		            text:'Fit Window',
		            iconCls: 'fit-icon',
		            scope:this,
		            handler: function(item)
		            {
		                graph.fit();
		            }
		        }]
            }
        },
        '-',
        {
            text:'Layout',
            iconCls: 'diagram-icon',
            handler: function(menu) { },
            menu:
            {
                items: [
		        {
		            text:'Vertical Partition Layout',
		            scope:this,
		            handler: function(item)
		            {
		        		executeLayout(new mxPartitionLayout(graph, false));
		            }
		        },
		        {
		            text:'Horizontal Partition Layout',
		            scope:this,
		            handler: function(item)
		            {
	        			executeLayout(new mxPartitionLayout(graph));
		            }
		        },
		        '-',
		        {
		            text:'Vertical Stack Layout',
		            scope:this,
		            handler: function(item)
		            {
		                var layout = new mxStackLayout(graph, false);
		                layout.fill = true;
		                executeLayout(layout);
		            }
		        },
		        {
		            text:'Horizontal Stack Layout',
		            scope:this,
		            handler: function(item)
		            {
		                var layout = new mxStackLayout(graph, false);
		                layout.fill = true;
		                executeLayout(layout);
		            }
		        },
		        '-',
		        {
		            text:'Place Edge Labels',
		            scope:this,
		            handler: function(item)
		            {
		        		executeLayout(new mxEdgeLabelLayout(graph));
		            }
		        },
		        {
		            text:'Parallel Edges',
		            scope:this,
		            handler: function(item)
		            {
		        		executeLayout(new mxParallelEdgeLayout(graph));
		            }
		        },
		        '-',
		        {
		            text:'Vertical Hierarchical Layout',
		            scope:this,
		            handler: function(item)
		            {
	        			var layout = new mxHierarchicalLayout(graph);
		        		executeLayout(layout, true);
		            }
		        },
		        {
		            text:'Horizontal Hierarchical Layout',
		            scope:this,
		            handler: function(item)
		            {
		        		var layout = new mxHierarchicalLayout(graph,
	        				mxConstants.DIRECTION_WEST);
		        		executeLayout(layout, true);
		            }
		        },
		        '-',
		        {
		            text:'Vertical Tree Layout',
		            scope:this,
		            handler: function(item)
		            {
		        		var layout = new mxCompactTreeLayout(graph, false);
		        		executeLayout(layout, true, true);
		            }
		        },
		        {
		            text:'Horizontal Tree Layout',
		            scope:this,
		            handler: function(item)
		            {
		        		var layout = new mxCompactTreeLayout(graph);
		        		executeLayout(layout, true, true);
		            }
		        },
		        '-',
		        {
		            text:'Organic Layout',
		            scope:this,
		            handler: function(item)
		            {
		                var layout = new mxFastOrganicLayout(graph);
		                layout.forceConstant = 80;
		        		executeLayout(layout, true);
		            }
		        },
		        {
		            text:'Circle Layout',
		            scope:this,
		            handler: function(item)
		            {
		        		executeLayout(new mxCircleLayout(graph), true);
		            }
		        }]
            }
        },
        '-',
        {
            text:'Options',
            iconCls: 'preferences-icon',
            handler: function(menu) { },
            menu:
            {
                items: [
                {
                    text:'Grid',
                    handler: function(menu) { },
                    menu:
                    {
                    	items: [
        		        {
        		            text:'Grid Size',
        		            scope:this,
        		            handler: function()
        		            {
        						var value = mxUtils.prompt('Enter Grid Size (Pixels)', graph.gridSize);
        										            	
        		            	if (value != null)
        		            	{
        			            	graph.gridSize = value;
        			            }
        		            }
        		        },
        		        {
        		            checked: true,
        		            text:'Grid Enabled',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		                graph.setGridEnabled(checked);
        		            }
        		        }
        		        ]
                    }
                },
                {
	                text:'Stylesheet',
	                handler: function(menu) { },
	                menu:
	                {
	                	items: [
	                	{
				            text:'Basic Style',
				            scope:this,
				            handler: function(item)
				            {
							    var node = mxUtils.load('resources/basic-style.xml').getDocumentElement();
								var dec = new mxCodec(node.ownerDocument);
								dec.decode(node, graph.getStylesheet());    
								graph.refresh();
				            }
				        },
				        {
				            text:'Default Style',
				            scope:this,
				            handler: function(item)
				            {
							    var node = mxUtils.load('resources/default-style.xml').getDocumentElement();
								var dec = new mxCodec(node.ownerDocument);
								dec.decode(node, graph.getStylesheet());    
								graph.refresh();
				            }
				        }]
	                }
                },
                {
                    text:'Labels',
                    handler: function(menu) { },
                    menu:
                    {
                    	items: [
        		        {
        		            checked: true,
        		            text:'Show Labels',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		            	graph.labelsVisible = checked;
        		            	graph.refresh();
        		            }
        		        },
        		        {
        		            checked: true,
        		            text:'Move Edge Labels',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		            	graph.edgeLabelsMovable = checked;
        		            }
        		        },
        		        {
        		            checked: false,
        		            text:'Move Vertex Labels',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		           		graph.vertexLabelsMovable = checked;
        		            }
        		        },
        		        '-',
        		        {
        		            checked: false,
        		            text:'HTML Labels',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		           		graph.setHtmlLabels(checked);
        		           		graph.refresh();
        		            }
        		        }
            	        ]
                    }
                },
                '-',
                {
                    text:'Connections',
                    handler: function(menu) { },
                    menu:
                    {
                    	items: [
                        {
        		            checked: true,
        		            text:'Connectable',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		                graph.setConnectable(checked);
        		            }
        		        },
        		        {
        		            checked: false,
        		            text:'Connectable Edges',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		                graph.setConnectableEdges(checked);
        		            }
        		        },
        		        '-',
                        {
        		            checked: true,
        		            text:'Create Target',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		                graph.connectionHandler.setCreateTarget(checked);
        		            }
        		        },
        		        {
        		            checked: true,
        		            text:'Disconnect On Move',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		                graph.setDisconnectOnMove(checked);
        		            }
        		        },
        		        '-',
        		        {
        		        	checked: false,
        		        	text:'Add/Remove Bends',
        		        	scope:this,
        		        	checkHandler: function(item, checked)
        		        	{
        		        		mxEdgeHandler.prototype.addEnabled = checked;
        		        		mxEdgeHandler.prototype.removeEnabled = checked;
        		        	}
        		        }
            	        ]
                    }
                },
                {
                    text:'Validation',
                    handler: function(menu) { },
                    menu:
                    {
                    	items: [
        		        {
        		            checked: true,
        		            text:'Allow Dangling Edges',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		                graph.setAllowDanglingEdges(checked);
        		            }
        		        },
        		        {
        		            checked: false,
        		            text:'Clone Invalid Edges',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		                graph.setCloneInvalidEdges(checked);
        		            }
        		        },
        		        '-',
        		        {
        		            checked: false,
        		            text:'Allow Loops',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		                graph.setAllowLoops(checked);
        		            }
        		        },
        		        {
        		            checked: true,
        		            text:'Multigraph',
        		            scope:this,
        		            checkHandler: function(item, checked)
        		            {
        		                graph.setMultigraph(checked);
        		            }
        		        }
            	        ]
                    }
                },
                '-',
		        {
		            checked: false,
		            text:'Page Layout',
		            scope:this,
		            checkHandler: function(item, checked)
		            {
						graph.pageVisible = checked;
						graph.preferPageSize = graph.pageBreaksVisible;
						graph.view.validate();
						graph.sizeDidChange();
		            }
		        },
		        {
		            checked: false,
		            text:'Page Breaks',
		            scope:this,
		            checkHandler: function(item, checked)
		            {
						graph.pageBreaksVisible = checked;
						graph.preferPageSize = graph.pageBreaksVisible;
						graph.sizeDidChange();
		            }
		        },
                '-',
		        {
		            checked: true,
		            text:'Strict Scrollarea',
		            scope:this,
		            checkHandler: function(item, checked)
		            {
						graph.useScrollbarsForPanning = checked;
		            }
		        },
		        {
		            checked: true,
		            text:'Allow Negative Coordinates',
		            scope:this,
		            checkHandler: function(item, checked)
		            {
						graph.setAllowNegativeCoordinates(checked);
		            }
		        },
                '-',
		        {
		            text:'Show XML',
		            scope:this,
		            handler: function(item)
		            {
						var enc = new mxCodec(mxUtils.createXmlDocument());
						var node = enc.encode(graph.getModel());
						
						mxUtils.popup(mxUtils.getPrettyXml(node));
		            }
		        },
		        {
		            text:'Parse XML',
		            scope:this,
		            handler: function(item)
		            {
		        		var xml = mxUtils.prompt('Enter XML:', '');
		        		
		        		if (xml != null && xml.length > 0)
		        		{
		        			var doc = mxUtils.parseXml(xml); 
		        			var dec = new mxCodec(doc); 
		        			dec.decode(doc.documentElement, graph.getModel()); 
		        		}
		            }
		        },
		        '-',
		        {
		            text:'Console',
		            scope:this,
		            handler: function(item)
		            {
		            	mxLog.setVisible(!mxLog.isVisible());
		            }
		        }]
            }
        }],

        onContextMenu : function(node, e)
        {
    		var selected = !graph.isSelectionEmpty();

    		this.menu = new Ext.menu.Menu(
    		{
                items: [{
                    text:'Undo',
                    iconCls:'undo-icon',
                    disabled: !history.canUndo(),
                    scope: this,
                    handler:function()
                    {
                        history.undo();
                    }
                },'-',{
                    text:'Cut',
                    iconCls:'cut-icon',
                    disabled: !selected,
                    scope: this,
                    handler:function()
                    {
                    	mxClipboard.cut(graph);
                    }
                },{
                    text:'Copy',
                    iconCls:'copy-icon',
                    disabled: !selected,
                    scope: this,
                    handler:function()
                    {
                    	mxClipboard.copy(graph);
                    }
                },{
                    text:'Paste',
                    iconCls:'paste-icon',
                    disabled: mxClipboard.isEmpty(),
                    scope: this,
                    handler:function()
                    {
                    	mxClipboard.paste(graph);
                    }
                },
                '-',
                {
                    text:'Delete',
                    iconCls:'delete-icon',
                    disabled: !selected,
                    scope: this,
                    handler:function()
                    {
                    	graph.removeCells();
                    }
                },
              	'-',
              	{
		            text:'Format',
		            disabled: !selected,
		            handler: function() { },
		            menu:
		            {
		            	items: [
		            	{
		            		text:'Background',
				            disabled: !selected,
				            handler: function() { },
				            menu:
				            {
				            	items: [
				                {
						            text: 'Fillcolor',
						            iconCls:'fillcolor-icon',
						            menu: fillColorMenu
						        },
				                {
						            text: 'Gradient',
						            menu: gradientColorMenu
						        },
						        '-',
						        {
						            text: 'Image',
						            handler: function()
						            {
						            	var value = '';
						            	var state = graph.getView().getState(graph.getSelectionCell());
						            	
						            	if (state != null)
						            	{
						            		value = state.style[mxConstants.STYLE_IMAGE] || value;
						            	}

					            		value = mxUtils.prompt('Enter Image URL', value);
						            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_IMAGE, value);
							            }
						            }
						        },
						        {
						            text:'Shadow',
						            scope:this,
						            handler: function()
						            {
						                graph.toggleCellStyles(mxConstants.STYLE_SHADOW);
						            }
						        },
						        '-',
						        {
						            text:'Opacity',
						            scope:this,
						            handler: function()
						            {
						            	var value = mxUtils.prompt('Enter Opacity (0-100%)', '100');
						            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_OPACITY, value);
							            }
						            }
						        }]
				            }
		            	},
			            {
		            		text:'Label',
				            disabled: !selected,
				            handler: function() { },
				            menu:
				            {
				            	items: [
								{
						            text: 'Fontcolor',
						            iconCls:'fontcolor-icon',
						            menu: fontColorMenu
						        },
						        '-',
				                {
						            text: 'Label Fill',
						            menu: labelBackgroundMenu
						        },
				                {
						            text: 'Label Border',
						            menu: labelBorderMenu
						        },
						        '-',
								{
						            text:'Rotate Label',
						            scope:this,
						            handler: function()
						            {
						                graph.toggleCellStyles(mxConstants.STYLE_HORIZONTAL, true);
						            }
						        },
						        {
						            text:'Text opacity',
						            scope:this,
						            handler: function()
						            {
						            	var value = mxUtils.prompt('Enter text opacity (0-100%)', '100');
						            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_TEXT_OPACITY, value);
							            }
						            }
						        },
						        '-',
					            {
				            		text:'Position',
						            disabled: !selected,
						            handler: function() { },
						            menu:
						            {
						            	items: [
					            		{
								            text: 'Top',
								            scope:this,
								            handler: function()
								            {
					            				graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_TOP);
					            				graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_BOTTOM);
								            }
								        },
					            		{
								            text: 'Middle',
								            scope:this,
								            handler: function()
								            {
					            				graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
					            				graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
								            }
								        },
					            		{
								            text: 'Bottom',
								            scope:this,
								            handler: function()
								            {
					            				graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_BOTTOM);
					            				graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP);
								            }
								        },
								        '-',
					            		{
								            text: 'Left',
								            scope:this,
								            handler: function()
								            {
					            				graph.setCellStyles(mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_LEFT);
					            				graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_RIGHT);
								            }
								        },
					            		{
								            text: 'Center',
								            scope:this,
								            handler: function()
								            {
				            				graph.setCellStyles(mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
				            				graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
								            }
								        },
					            		{
								            text: 'Right',
								            scope:this,
								            handler: function()
								            {
				            				graph.setCellStyles(mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_RIGHT);
				            				graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT);
								            }
								        }]
						            }
					            },
						        '-',
								{
						            text:'Hide',
						            scope:this,
						            handler: function()
						            {
						                graph.toggleCellStyles(mxConstants.STYLE_NOLABEL, false);
						            }
						        }]
				            }
			            },
			            '-',
			            {
		            		text:'Line',
				            disabled: !selected,
				            handler: function() { },
				            menu:
				            {
				            	items: [
			            		{
						            text: 'Linecolor',
						            iconCls:'linecolor-icon',
						            menu: lineColorMenu
						        },
						        '-',
						        {
						            text:'Dashed',
						            scope:this,
						            handler: function()
						            {
						                graph.toggleCellStyles(mxConstants.STYLE_DASHED);
						            }
						        },
								{
						            text: 'Linewidth',
						            handler: function()
						            {
						            	var value = '0';
						            	var state = graph.getView().getState(graph.getSelectionCell());
						            	
						            	if (state != null)
						            	{
						            		value = state.style[mxConstants.STYLE_STROKEWIDTH] || 1;
						            	}
	
					            		value = mxUtils.prompt('Enter Linewidth (Pixels)', value);
							            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, value);
							            }
						            }
						        }]
				            }
			            },
		            	{
		            		text:'Connector',
		            		menu:
		            		{
		            			items: [
		            			{
						            text: 'Straight',
						            icon: 'images/straight.gif',
						            handler: function()
						            {
						            	graph.setCellStyle('straight');
						            }
						        },
						        '-',
						        {
						            text: 'Horizontal',
						            icon: 'images/connect.gif',
						            handler: function()
						            {
						            	graph.setCellStyle(null);
						            }
						        },
						        {
						            text: 'Vertical',
						            icon: 'images/vertical.gif',
						            handler: function()
						            {
						            	graph.setCellStyle('vertical');
						            }
						        },
						        '-',
						        {
						            text: 'Entity Relation',
						           	icon: 'images/entity.gif',
						            handler: function()
						            {
						            	graph.setCellStyle('edgeStyle=entityRelationEdgeStyle');
						            }
						        },
						        {
						            text: 'Arrow',
						            icon: 'images/arrow.gif',
						            handler: function()
						            {
						            	graph.setCellStyle('arrow');
						            }
						        },
						        '-',
						        {
						            text: 'Plain',
						            handler: function()
						            {
						        		graph.toggleCellStyles(mxConstants.STYLE_NOEDGESTYLE, false);
						            }
						        }]
		            		}
		            	},
				        '-',
		            	{
							text:'Linestart',
							menu:
							{
		            			items: [
		            			{
		            				text: 'Open',
						            icon: 'images/open_start.gif',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_STARTARROW, mxConstants.ARROW_OPEN);
						            }
						        },
						        {
						            text: 'Classic',
						            icon: 'images/classic_start.gif',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_STARTARROW, mxConstants.ARROW_CLASSIC);
						            }
						        },
						        {
						            text: 'Block',
						            icon: 'images/block_start.gif',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_STARTARROW, mxConstants.ARROW_BLOCK);
						            }
						        },
						        '-',
						        {
						            text: 'Diamond',
						            icon: 'images/diamond_start.gif',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_STARTARROW, mxConstants.ARROW_DIAMOND);
						            }
						        },
						        {
						            text: 'Oval',
						            icon: 'images/oval_start.gif',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_STARTARROW, mxConstants.ARROW_OVAL);
						            }
						        },
						        '-',
				                {
						            text: 'None',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_STARTARROW, mxConstants.NONE);
						            }
						        },
				                {
						            text: 'Size',
						            handler: function()
						            {
						            	var size = mxUtils.prompt('Enter Size', mxConstants.DEFAULT_MARKERSIZE);
						            	
						            	if (size != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_STARTSIZE, size);
							            }
						            }
				                }]
							}
						},
						{
							text:'Lineend',
							menu:
							{
								items: [
								{
						            text: 'Open',
						            icon: 'images/open_end.gif',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_ENDARROW, mxConstants.ARROW_OPEN);
						            }
						        },
						        {
						            text: 'Classic',
						            icon: 'images/classic_end.gif',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_ENDARROW, mxConstants.ARROW_CLASSIC);
						            }
						        },
						        {
						            text: 'Block',
						            icon: 'images/block_end.gif',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_ENDARROW, mxConstants.ARROW_BLOCK);
						            }
						        },
						        '-',
						        {
						            text: 'Diamond',
						            icon: 'images/diamond_end.gif',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_ENDARROW, mxConstants.ARROW_DIAMOND);
						            }
						        },
						        {
						            text: 'Oval',
						            icon: 'images/oval_end.gif',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_ENDARROW, mxConstants.ARROW_OVAL);
						            }
						        },
						        '-',
				                {
						            text: 'None',
						            handler: function()
						            {
						            	graph.setCellStyles(mxConstants.STYLE_ENDARROW, 'none');
						            }
				                },
				                {
				                	text: 'Size',
				                	handler: function()
						            {
						            	var size = mxUtils.prompt('Enter Size', mxConstants.DEFAULT_MARKERSIZE);
						            	
						            	if (size != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_ENDSIZE, size);
							            }
						            }
						        }]
							}
						},
						'-',
						{
							text:'Spacing',
							menu:
							{
				                items: [
							    {
						            text: 'Top',
						            handler: function()
						            {
						            	var value = '0';
						            	var state = graph.getView().getState(graph.getSelectionCell());
						            	
						            	if (state != null)
						            	{
						            		value = state.style[mxConstants.STYLE_SPACING_TOP] || value;
						            	}

					            		value = mxUtils.prompt('Enter Top Spacing (Pixels)', value);
							            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_SPACING_TOP, value);
							            }
						            }
						        },
						        {
						            text: 'Right',
						            handler: function()
						            {
						            	var value = '0';
						            	var state = graph.getView().getState(graph.getSelectionCell());
						            	
						            	if (state != null)
						            	{
						            		value = state.style[mxConstants.STYLE_SPACING_RIGHT] || value;
						            	}

					            		value = mxUtils.prompt('Enter Right Spacing (Pixels)', value);
							            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_SPACING_RIGHT, value);
							            }
						            }
						        },
						        {
						            text: 'Bottom',
						            handler: function()
						            {
						            	var value = '0';
						            	var state = graph.getView().getState(graph.getSelectionCell());
						            	
						            	if (state != null)
						            	{
						            		value = state.style[mxConstants.STYLE_SPACING_BOTTOM] || value;
						            	}

					            		value = mxUtils.prompt('Enter Bottom Spacing (Pixels)', value);
							            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_SPACING_BOTTOM, value);
							            }
						            }
						        },
						        {
						            text: 'Left',
						            handler: function()
						            {
						            	var value = '0';
						            	var state = graph.getView().getState(graph.getSelectionCell());
						            	
						            	if (state != null)
						            	{
						            		value = state.style[mxConstants.STYLE_SPACING_LEFT] || value;
						            	}

					            		value = mxUtils.prompt('Enter Left Spacing (Pixels)', value);
							            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_SPACING_LEFT, value);
							            }
						            }
						        },
						        '-',
				                {
						            text: 'Global',
						            handler: function()
						            {
						            	var value = '0';
						            	var state = graph.getView().getState(graph.getSelectionCell());
						            	
						            	if (state != null)
						            	{
						            		value = state.style[mxConstants.STYLE_SPACING] || value;
						            	}

					            		value = mxUtils.prompt('Enter Spacing (Pixels)', value);
							            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_SPACING, value);
							            }
						            }
				                },
				                '-',
						        {
						            text: 'Source spacing',
						            handler: function()
						            {
						            	var value = '0';
						            	var state = graph.getView().getState(graph.getSelectionCell());
						            	
						            	if (state != null)
						            	{
						            		value = state.style[mxConstants.STYLE_SOURCE_PERIMETER_SPACING] || value;
						            	}
	
					            		value = mxUtils.prompt('Enter source spacing (pixels)', value);
							            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_SOURCE_PERIMETER_SPACING, value);
							            }
						            }
						        },
								{
						            text: 'Target spacing',
						            handler: function()
						            {
						            	var value = '0';
						            	var state = graph.getView().getState(graph.getSelectionCell());
						            	
						            	if (state != null)
						            	{
						            		value = state.style[mxConstants.STYLE_TARGET_PERIMETER_SPACING] || value;
						            	}
	
					            		value = mxUtils.prompt('Enter target spacing (pixels)', value);
							            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_TARGET_PERIMETER_SPACING, value);
							            }
						            }
						        },
						        '-',
						        {
						            text: 'Perimeter',
						            handler: function()
						            {
						            	var value = '0';
						            	var state = graph.getView().getState(graph.getSelectionCell());
						            	
						            	if (state != null)
						            	{
						            		value = state.style[mxConstants.STYLE_PERIMETER_SPACING] || value;
						            	}

					            		value = mxUtils.prompt('Enter Perimeter Spacing (Pixels)', value);
							            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_PERIMETER_SPACING, value);
							            }
						            }
						        }]
							}
						},
						{
							text:'Direction',
							menu:
							{
				                items: [
				                {
						            text: 'North',
						            scope:this,
						            handler: function()
						            {
						                graph.setCellStyles(mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_NORTH);
						            }
						        },
						        {
						            text: 'East',
						            scope:this,
						            handler: function()
						            {
						                graph.setCellStyles(mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST);
						            }
						        },
						        {
						            text: 'South',
						            scope:this,
						            handler: function()
						            {
						                graph.setCellStyles(mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_SOUTH);
						            }
						        },
						        {
						            text: 'West',
						            scope:this,
						            handler: function()
						            {
						                graph.setCellStyles(mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_WEST);
						            }
						        },
						        '-',
						        {
						            text:'Rotation',
						            scope:this,
						            handler: function()
						            {
						            	var value = '0';
						            	var state = graph.getView().getState(graph.getSelectionCell());
						            	
						            	if (state != null)
						            	{
						            		value = state.style[mxConstants.STYLE_ROTATION] || value;
						            	}

					            		value = mxUtils.prompt('Enter Angle (0-360)', value);
							            	
						            	if (value != null)
						            	{
							            	graph.setCellStyles(mxConstants.STYLE_ROTATION, value);
							            }
						            }
						        }]
							}
						},
				        '-',
				        {
				            text:'Rounded',
				            scope:this,
				            handler: function()
				            {
				               graph.toggleCellStyles(mxConstants.STYLE_ROUNDED);
				            }
				        },
				       	{
				            text:'Style',
				            scope:this,
				            handler: function()
				            {
				        		var cells = graph.getSelectionCells();

								if (cells != null &&
									cells.length > 0)
								{
									var model = graph.getModel();
									var style = mxUtils.prompt('Enter Style', model.getStyle(cells[0]) || '');
				
									if (style != null)
									{
										graph.setCellStyle(style, cells);
									}
								}
				            }
				        }]
		            }
              	},
              	{
              		split:true,
		            text:'Shape',
		            handler: function() { },
		            menu:
		            {
		                items: [
		                {
		                    text:'Home',
		                    iconCls: 'home-icon',
		                    disabled: graph.view.currentRoot == null,
		                    scope: this,
		                    handler:function()
		                    {
		                    	graph.home();
		                    }
		              	},
		              	'-',
		                {
		                    text:'Exit group',
		                    iconCls:'up-icon',
		                    disabled: graph.view.currentRoot == null,
		                    scope: this,
		                    handler:function()
		                    {
		                    	graph.exitGroup();
		                    }
		              	},
		                {
		                    text:'Enter group',
		                    iconCls:'down-icon',
		                    disabled: !selected,
		                    scope: this,
		                    handler:function()
		                    {
		                    	graph.enterGroup();
		                    }
		              	},
				        '-',
                        {
				            text:'Group',
				            icon: 'images/group.gif',
				            disabled: graph.getSelectionCount() <= 1,
				            scope:this,
				            handler: function()
				            {
				                graph.setSelectionCell(graph.groupCells(null, 20));
				            }
				        },
				        {
				            text:'Ungroup',
				            icon: 'images/ungroup.gif',
				            scope:this,
				            handler: function()
				            {
				        		graph.setSelectionCells(graph.ungroupCells());
				            }
				        },
				        '-',
				       	{
				            text:'Remove from group',
				            scope:this,
				            handler: function()
				            {
				                graph.removeCellsFromParent();
				            }
				        },
				       	{
				            text:'Update group bounds',
				            scope:this,
				            handler: function()
				            {
				        		graph.updateGroupBounds(null, 20);
				            }
				        },
		              	'-',
						{
		                    text:'Collapse',
		                    iconCls:'collapse-icon',
		                    disabled: !selected,
		                    scope: this,
		                    handler:function()
		                    {
		                    	graph.foldCells(true);
		                    }
		              	},
		                {
		                    text:'Expand',
		                    iconCls:'expand-icon',
		                    disabled: !selected,
		                    scope: this,
		                    handler:function()
		                    {
		                    	graph.foldCells(false);
		                    }
		              	},
		              	'-',
		                {
				            text:'To Back',
				            icon: 'images/toback.gif',
				            scope:this,
				            handler: function()
				            {
				                graph.orderCells(true);
				            }
				        },
				        {
				            text:'To Front',
				            icon: 'images/tofront.gif',
				            scope:this,
				            handler: function()
				            {
				                graph.orderCells(false);
				            }
				        },
				        '-',
				        
				        
				        {
							text:'Align',
							menu:
							{
								items: [
								{
						            text: 'Left',
						            icon: 'images/alignleft.gif',
						            handler: function()
						            {
										graph.alignCells(mxConstants.ALIGN_LEFT);
						            }
						        },
						        {
						            text: 'Center',
						            icon: 'images/aligncenter.gif',
						            handler: function()
						            {
						        		graph.alignCells(mxConstants.ALIGN_CENTER);
						            }
						        },
						        {
						            text: 'Right',
						            icon: 'images/alignright.gif',
						            handler: function()
						            {
						        		graph.alignCells(mxConstants.ALIGN_RIGHT);
						            }
						        },
						        '-',
						        {
						            text: 'Top',
						            icon: 'images/aligntop.gif',
						            handler: function()
						            {
						        		graph.alignCells(mxConstants.ALIGN_TOP);
						            }
						        },
						        {
						            text: 'Middle',
						            icon: 'images/alignmiddle.gif',
						            handler: function()
						            {
						        		graph.alignCells(mxConstants.ALIGN_MIDDLE);
						            }
						        },
						        {
						            text: 'Bottom',
						            icon: 'images/alignbottom.gif',
						            handler: function()
						            {
						        		graph.alignCells(mxConstants.ALIGN_BOTTOM);
						            }
						        }]
							}
						},
				        '-',
				       	{
				            text:'Autosize',
				            scope:this,
				            handler: function()
				            {
				            	if (!graph.isSelectionEmpty())
				            	{
				            		graph.updateCellSize(graph.getSelectionCell());
				            	}
				            }
				        }]
		            }
			    },
			    '-',
		       	{
		            text:'Edit',
		            scope:this,
		            handler: function()
		            {
		                graph.startEditing();
		            }
		        },
			    '-',
                {
                    text:'Select Vertices',
                    scope: this,
                    handler:function()
                    {
			    		graph.selectVertices();
                    }
              	},
              	{
                    text:'Select Edges',
                    scope: this,
                    handler:function()
                    {
              			graph.selectEdges();
                    }
              	},
              	'-',
              	{
                    text:'Select All',
                    scope: this,
                    handler:function()
                    {
                    	graph.selectAll();
                    }
              	}]
            });
	            
            this.menu.on('hide', this.onContextHide, this);
            
            
            // Adds a small offset to make sure the mouse released event
            // is routed via the shape which was initially clicked. This
            // is required to avoid a reset of the selection in Safari.
            this.menu.showAt([e.clientX + 1, e.clientY + 1]);
	    },
	
	    onContextHide : function()
	    {
	        if(this.ctxNode)
	        {
	            this.ctxNode.ui.removeClass('x-node-ctx');
	            this.ctxNode = null;
	        }
	    }
    });

    MainPanel.superclass.constructor.call(this,
    {
        region:'center',
        layout: 'fit',
        items: this.graphPanel
    });

    // Redirects the context menu to ExtJs menus
    graph.panningHandler.popup = mxUtils.bind(this, function(x, y, cell, evt)
    {
    	this.graphPanel.onContextMenu(null, evt);
    });

    graph.panningHandler.hideMenu = mxUtils.bind(this, function()
    {
		if (this.graphPanel.menuPanel != null)
    	{
			this.graphPanel.menuPanel.hide();
    	}
    });

    // Fits the SVG container into the panel body
    this.graphPanel.on('resize', function()
    {
        graph.sizeDidChange();
    });
};

Ext.extend(MainPanel, Ext.Panel);

/*************************************************************************************************************************/

/*
 * $Id: LibraryPanel.js,v 1.4 2010-01-02 09:45:15 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */
LibraryPanel = function()
{
    LibraryPanel.superclass.constructor.call(this,
    {
    	title: 'Library',
        region:'center',
        split:true,
        rootVisible:false,
        lines:false,
        autoScroll:true,
        root: new Ext.tree.TreeNode('Graph Editor'),
        collapseFirst:false
    });

	// Adds 3 main categories for shapes and stores a reference to the treenode
    // under templates, images and symbols respectively
    this.templates = this.root.appendChild(
        new Ext.tree.TreeNode({
            text:'Shapes',
            cls:'feeds-node',
            expanded:true
        })
    );

    this.images = this.root.appendChild(
        new Ext.tree.TreeNode({
            text:'Images',
            cls:'feeds-node',
            expanded:false
        })
    );
    
    this.symbols = this.root.appendChild(
        new Ext.tree.TreeNode({
            text:'Symbols',
            cls:'feeds-node',
            expanded:false
        })
    );
};

Ext.extend(LibraryPanel, Ext.tree.TreePanel, {

    addTemplate : function(name, icon, parentNode, cells)
    {
        var exists = this.getNodeById(name);
        
        if(exists)
        {
            if(!inactive)
            {
                exists.select();
                exists.ui.highlight();
            }
            
            return;
        }

        var node = new Ext.tree.TreeNode(
        {
        	text: name,
            icon: icon,
            leaf: true,
            cls: 'feed',
            cells: cells,
            id: name
        });
        
        if (parentNode == null)
        {
        	parentNode = this.templates;
        }

        parentNode.appendChild(node);
        
        return node;
    },

    // prevent the default context menu when you miss the node
    afterRender : function()
    {
        LibraryPanel.superclass.afterRender.call(this);
        /*
        this.el.on('contextmenu', function(e)
        {
            e.preventDefault();
        });
        */
    }
});

/*******************************************************************************************************/


/**
 * $Id: DiagramStore.js,v 1.5 2010-01-04 11:18:26 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 *
 * Class: DiagramStore
 * 
 * A class for storing diagrams. This implementation uses Google Gears, HTML 5
 * (disabled) or a local variable. 
 */
var DiagramStore =
{
	/**
	 * Variable: useLocalStorage
	 * 
	 * Uses localStorage object in HTML 5. The support in browsers for this
	 * feature is still shaky so it's disabled.
	 */
	useLocalStorage: false,
		
	/**
	 * Variable: diagrams
	 * 
	 * Array for in-memory storage of the diagrams. This is not persistent
	 * across multiplace invocations and is only used as a fallback if no
	 * client- or server-side storage is available.
	 */
	diagrams: new Object(),

	/**
	 * Variable: diagrams
	 * 
	 * Array for in-memory storage of the diagrams. This is not persistent
	 * across multiplace invocations and is only used as a fallback if no
	 * client- or server-side storage is available.
	 */
	eventSource: new mxEventSource(this),
	
	/**
	 * Function: isAvailable
	 * 
	 * Returns true if any of the storage mechanisms for driving the diagram
	 * store is available. Currently supported mechanisms are Google Gears
	 * and HTML 5 local storage.
	 */
	isAvailable: function()
	{
		return (DiagramStore.useLocalStorage &&
			typeof(localStorage) != 'undefined') ||
			(window.google &&
			google.gears);
	},

	/**
	 * Function: init
	 * 
	 * Initializes the diagram store. This is invoked at class creation time
	 * and returns the db instance to operate on.
	 */
	db: function()
	{
		var db = null;
		
		try
		{					
			db = google.gears.factory.create('beta.database', '1.0');
			db.open('mxGraphEditor');
			db.execute('CREATE TABLE IF NOT EXISTS Diagrams ('+
				'NAME PRIMARY KEY,'+
				'XML TEXT' +
				');');
			
			return db;
		}
		catch (e)
		{
			// ignore
		}
		
		return db;
	}(),
	
	/**
	 * Function: addListener
	 */
	addListener: function(name, funct)
	{
		DiagramStore.eventSource.addListener(name, funct);
	},

	/**
	 * Function: removeListener
	 */
	removeListener: function(funct)
	{
		DiagramStore.eventSource.removeListener(funct);
	},

	/**
	 * Function: put
	 * 
	 * Puts the given diagram into the store, replacing any existing diagram
	 * for the given name.
	 */
	put: function(name, xml)
	{
		if (DiagramStore.useLocalStorage &&
			typeof(localStorage) != 'undefined')
		{
			return localStorage.setItem(name, xml);
		}
		else if (DiagramStore.db != null)
		{
			DiagramStore.db.execute('DELETE FROM Diagrams WHERE name = ?;', [name]);
			DiagramStore.db.execute('INSERT INTO Diagrams (NAME, XML) VALUES (?, ?);', [name, xml]);
		}
		else
		{
			DiagramStore.diagrams[name] = xml;
		}
		
		DiagramStore.eventSource.fireEvent(new mxEventObject('put'));
	},

	/**
	 * Function: remove
	 * 
	 * Removes the given diagram from the store and returns
	 */
	remove: function(name)
	{
		if (DiagramStore.useLocalStorage &&
			typeof(localStorage) != 'undefined')
		{
			localStorage.removeItem(name);
		}
		else if (DiagramStore.db != null)
		{
			DiagramStore.db.execute('DELETE FROM Diagrams WHERE name = ?;', [name]);
		}
		else
		{
			delete DiagramStore.diagrams[name];
		}

		DiagramStore.eventSource.fireEvent(new mxEventObject('remove'));
	},

	/**
	 * Function: get
	 * 
	 * Returns the given diagram from the store or null of no such diagram
	 * can be found.
	 */
	get: function(name)
	{
		var xml = null;
		
		if (DiagramStore.useLocalStorage &&
			typeof(localStorage) != 'undefined')
		{
			xml = localStorage.getItem(name);
		}
		else if (DiagramStore.db != null)
		{
			var rs = DiagramStore.db.execute('SELECT xml FROM Diagrams WHERE NAME = ?;', [name]);
			
			if (rs.isValidRow())
			{
				xml = rs.field(0);
			}
			
			rs.close();
		}
		else
		{
			xml = DiagramStore.diagrams[name];
		}
		
		return xml; 
	},

	/**
	 * Function: getNames
	 * 
	 * Returns all diagram names in the store as an array.
	 */
	getNames: function()
	{
		var names = [];
		
		if (DiagramStore.useLocalStorage &&
			typeof(localStorage) != 'undefined')
		{
			for (var i = 0; i < localStorage.length; i++)
			{
				names.push(localStorage.key(i));
			}
		}
		else if (DiagramStore.db != null)
		{
			var rs = DiagramStore.db.execute('SELECT name FROM Diagrams;');
	
			while (rs.isValidRow())
			{
				names.push(rs.field(0));
				rs.next();
			}
			
			rs.close();
		}
		else
		{
		    for (var name in DiagramStore.diagrams)
		    {
		    	names.push(name);
		    }
		}
	    
	    return names;
	}

};


/*******************************************************************************************************/


/*
 * $Id: DiagramPanel.js,v 1.2 2010-01-02 09:45:15 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */
DiagramPanel = function(store, mainPanel)
{
	DiagramPanel.superclass.constructor.call(this,
    {
		// TODO: Set initial sorting column and order to name, desc
        title: 'Diagrams',
        store: store,
		hideHeaders: false,
		columnSort: true,
		singleSelect: true,
		reserveScrollOffset: true,
        emptyText: 'No diagrams',

        columns: [{
            header: 'Name',
            width: 1,
            dataIndex: 'name'
        }],
        
        onContextMenu: function(e, node, scope)
        {
			var idx = this.getSelectedIndexes();
			
			if (idx.length > 0)
			{
				var name = store.getAt(idx[0]).get('name');
				
				if (name != null)
				{
		    		var menu = new Ext.menu.Menu(
		    		{
		                items: [{
		                    text:'Open',
		                    iconCls:'open-icon',
		                    scope: this,
		                    handler:function()
		                    {
	                			mainPanel.openDiagram(name);
		                    }
		                },'-',{
		                    text:'Delete',
		                    iconCls:'delete-icon',
		                    scope: this,
		                    handler:function()
		                    {
		                		if (mxUtils.confirm('Delete "'+name+'"?'))
		                		{
		                			DiagramStore.remove(name);
		                		}
		                    }
		                }]
		            });
		
		            menu.showAt([e.browserEvent.clientX, e.browserEvent.clientY]);
				}
			}
        }
    });
};

Ext.extend(DiagramPanel, Ext.ListView);



/*******************************************************************************************************/





/*******************************************************************************************************/




/*******************************************************************************************************/




