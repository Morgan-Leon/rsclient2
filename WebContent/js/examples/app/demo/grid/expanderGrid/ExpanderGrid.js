Rs.define('rs.demo.grid.ExpanderGrid', {
   
    extend : Ext.grid.GridPanel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
    
        var dummyData = [
             ['3m Co',71.72,0.02,0.03,'9/1 12:00am', 'Manufacturing'],
             ['Alcoa Inc',29.01,0.42,1.47,'9/1 12:00am', 'Manufacturing'],
             ['Altria Group Inc',83.81,0.28,0.34,'9/1 12:00am', 'Manufacturing'],
             ['American Express Company',52.55,0.01,0.02,'9/1 12:00am', 'Finance'],
             ['American International Group, Inc.',64.13,0.31,0.49,'9/1 12:00am', 'Services'],
             ['AT&T Inc.',31.61,-0.48,-1.54,'9/1 12:00am', 'Services'],
             ['Boeing Co.',75.43,0.53,0.71,'9/1 12:00am', 'Manufacturing'],
             ['Caterpillar Inc.',67.27,0.92,1.39,'9/1 12:00am', 'Services'],
             ['Citigroup, Inc.',49.37,0.02,0.04,'9/1 12:00am', 'Finance'],
             ['E.I. du Pont de Nemours and Company',40.48,0.51,1.28,'9/1 12:00am', 'Manufacturing'],
             ['Exxon Mobil Corp',68.1,-0.43,-0.64,'9/1 12:00am', 'Manufacturing'],
             ['General Electric Company',34.14,-0.08,-0.23,'9/1 12:00am', 'Manufacturing']
         ];
     
         for(var i = 0; i < dummyData.length; i++){
             dummyData[i].push('Ich kann Deutsch, aber spreche schlecht. Ich denke niemand here kann diese Saetze verstehen, so schreibe ich die. Ich liebe ein man wer hat eine freudin, was soll ich tun? wer kann mir sagen?');
         };
     
         var reader = new Ext.data.ArrayReader({}, [
            {name: 'company'},
            {name: 'price', type: 'float'},
            {name: 'change', type: 'float'},
            {name: 'pctChange', type: 'float'},
            {name: 'lastChange', type: 'date'},
            {name: 'industry'},
            {name: 'desc'}
         ]);
 
         var expander = new Rs.ext.grid.RowExpander({
             tpl : new Ext.Template(
                 '<p><b>Company:</b> {company}</p><br>',
                 '<p><b>Summary:</b> {desc}</p>'
             )
         });
     
         config = Rs.apply(config || {}, {
             store : new Ext.data.Store({
                 reader: reader,
                 data: dummyData
             }),
             cm : new Ext.grid.ColumnModel({
                 defaults: {
                     width: 20,
                     sortable: true
                 },
                 columns: [
                     expander,
                     {id:'company', header: "Company", width: 40, dataIndex: 'company'},
                     {header: "Price", dataIndex: 'price'},
                     {header: "Change", dataIndex: 'change'},
                     {header: "% Change", dataIndex: 'pctChange'},
                     {header: "Last Updated", dataIndex: 'lastChange'}
                 ]
             }),
             viewConfig: {
                 forceFit:true
             },        
             plugins: expander,
             collapsible: true,
             animCollapse: false
         });
         rs.demo.grid.ExpanderGrid.superclass.constructor.call(this, config);
    }
    
});