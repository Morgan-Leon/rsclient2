Rs.define('rs.demo.tree.PagingSearchPlugin', {

    constructor : function(config) {
        this.initConfig(config);
        this.keyWorkEl = new Ext.form.TextField( {
            columnWidth : 1,
            enableKeyEvents : true,
            listeners : {
                'keydown' : {
                    scope : this,
                    fn : function(f, e) {
                        if (e && e.keyCode == 13) {
                            this.search();
                        }
                    }
                }
            }
        });
        this.toolbar = new Ext.Toolbar( {
            layout : "column",
            defaults : {
                border : false
            },
            items : [ this.keyWorkEl, {
                iconCls : 'rs-action-query',
                handler : this.search,
                scope : this
            } ]
        });
    },

    getToolbar : function() {
        return this.toolbar;
    },

    init : function(tree) {
        this.tree = tree;
    },

    search : function() {
        var tree = this.tree, kw = this.keyWorkEl.getValue();
        tree.fireEvent('query', tree, kw, this);
        Rs.Service.call({
            url : '/rsc/js/examples/app/demo/tree/pagingTree/dataservice.rsc',
            method : 'search',
            params : {
                keyWord : kw
            }
        }, this.doSearch, this);
    },

    doSearch : function(list) {
        var tree = this.tree, root = tree.getRootNode(), node = root.firstChild;
        while (node) {
            root.removeChild(node, true);
            node = root.firstChild;
        }
        this.pathList = list;
        if (list && list.length > 0) {
            tree.on('beforeappend', this.checkPath, this);
            root.loaded = false;
            root.expand(true);
        } else {
            tree.un('beforeappend', this.checkPath, this);
            root.loaded = false;
            root.expand(false);
        }
    },

    checkPath : function(t, p, n) {
        var list = this.pathList, path = p.getPath('code')
                + '/' + n.attributes.code;
        for ( var i = 0, len = list.length; i < len; i++) {
            if (list[i].indexOf(path) == 0) {
                return true;
            }
        }
        return false;
    }

});