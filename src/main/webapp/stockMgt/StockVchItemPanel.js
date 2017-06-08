
Ext.define('stockMgt.StockVchItemModel',{
     extend : 'Ext.data.Model',
    fields: [
         {name: 'mtItemId', type: 'int', defautValue: 0},
         {name: 'mtNum'},
         {name: 'mtName'},
         {name: 'custModelNum'},
         {name: 'packageModel'},
         {name: 'unit'},
         {name: 'quantity', type: 'float'},
         {name: 'unitPrice',  type: 'float'},
         {name: 'notes'}
    ]    
}       
);

Ext.define('stockMgt.StockVchItemPanel',
{
    extend : "Ext.grid.Panel",
    currencyField: null,
    constructor : function(conf)
    { 
        var moneyFormat = function(value)
                 {
                    if(conf.currencyField == null)
                    {
                         return Ext.util.Format.currency(value, '¥');
                    }
                    
                    if(conf.currencyField.getValue() === '人民币')
                    {
                        return Ext.util.Format.currency(value, '¥');
                    }else
                    {
                        return Ext.util.Format.usMoney(value);
                    }
                   
                 };   
                        
        var ds = Ext.create('Ext.data.ArrayStore', {
            model : 'stockMgt.StockVchItemModel',
            autoload: false
        }); 
        
        Ext.apply(this, {
                frame : false,
                store : ds,
                flex: 8,
                title : '单据明细',
                columnLines: true,
                autoScroll : true,
                margins: '10 0 10 0',    
                stripeRows: true,
                features: [{
                    id: 'summary',
                    ftype: 'summary'                  
                }],
                columns :[
                {text : '', dataIndex:'orderItemId', hidden: true},
                {text : '', dataIndex:'mtItemId', hidden: true},
                {text : '', dataIndex:'unitPrice', hidden: true},
                {xtype: 'rownumberer', header: 'ID'},
                {
                    xtype : 'actioncolumn',
                    width : 40,
                    items : [{
                        icon :'images/add.png',
                        tooltip: '增加产品',
                        handler : function(grid, rowIndex, colIndex){
                            var formPanel = grid.up('form');
                            formPanel.addProd(grid);
                        },
                        isDisabled: function(grid)
                        {
                            var formPanel = grid.up('form');
                            if(formPanel.stateAudited == true)
                                return true;       
                        }
                        },
                        {
                            icon :'images/delete.gif',
                            tooltip: '删除此列',
                            handler : function(grid, rowIndex, colIndex) {
                                var store = grid.store;
                                store.removeAt(rowIndex);
                                if(store.getCount() == 0)
                                store.insert( 1, new stockMgt.StockVchItemModel());
                            },
                            isDisabled: function(grid)
                            {
                                var formPanel = grid.up('form');
                                if(formPanel.stateAudited == true)
                                    return true;       
                            }                            
                        }
                    ]                    
                },
                {text : "物料号" , dataIndex : 'mtNum',  width : 120, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '总计:  '+ value;
                    }                
                },
                {text : "物料名称" , dataIndex : 'mtName',  width : 150, align : 'center'},                 
                {text : "单位" , dataIndex : 'unit',  width : 80, align : 'center'},
                {text : "数量" , dataIndex : 'quantity', sortable : true, width : 120, align : 'center',
                    editor: {xtype: 'numberfield', submitValue: false, validator: function(value){ if(value > 0) return true; return "数量必须大于零";}},
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  + value  : 0);
                    }                     
                },
/*                {text : "单价" , dataIndex : 'unitPrice',  width : 90, align : 'center',
                renderer: moneyFormat 
                },  
                {text : "合计金额" ,  sortable : true, width : 120, align : 'center',
                    renderer : function(value, metaData, record, rowIdx, colIdx, store, view)
                    {
                        var val = Number(record.get('unitPrice') * record.get('quantity'))
                         return moneyFormat(val.toFixed(2));
                    },                   
                    summaryType: function(records)
                    {
                        var total = 0;
                        var i=0;
                        var record;
                        for(; i < records.length; i++)
                        {
                            record = records[i];
                            total += record.get('unitPrice') * record.get('quantity');
                        }
                        
                        return Number(total).toFixed(2);
                    },
                    summaryRenderer:moneyFormat
                },  */
                {text : "包装方式" , dataIndex : 'packageModel',  width : 120, align : 'center'},  
                {text : "客户型号" , dataIndex : 'custModelNum',  width : 120, align : 'center'},    
                {text : "备注" , dataIndex : 'notes',  flex : 1, editor: {xtype: 'textfield',submitValue: false}}
                ],
                selModel: {
                    selType: 'cellmodel'
                },
                plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1,
                    listeners:{
                        beforeEdit: function(editor)
                        {
                            var formPanel = editor.getCmp().up('form');
                            if(formPanel.stateAudited == true)
                                return false;
                            
                            return true;
                        }
                    }                    
                })],
                listeners: {               
                    afterrender : function(panel)               
                    {       
                        store = panel.getStore();
                        var count = store.getCount();
                        if(count == 0)
                            store.insert( 1, new stockMgt.StockVchItemModel());
                    } 
                }
        
        });
        
        this.callParent(arguments);                         
    },
    reset: function()
    {
        var ds = this.getStore();
        
        if(ds.getCount() > 0 && ds.getAt(0).data.mtItemId != '')
        {   
            ds.removeAll();
            ds.insert( 1, new stockMgt.StockVchItemModel());
        }
    }
});