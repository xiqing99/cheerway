//<script type="text/javascript">

Ext.define('smartOA.stockMgt.StockTakenItem',{
     extend : 'Ext.data.Model',
    fields: [
         {name: 'id', type: 'int'},
         {name: 'inventoryId', type: 'int', defaultValue: 0},
         {name: 'mtNum'},
         {name: 'mtName'},
         {name: 'mtUnit'},
         {name: 'mtType'},
//         {name: 'mtUnitCost', type: 'float'},
         {name: 'expQuantity', type: 'float'},
         {name: 'actQuantity', type: 'float'},
         {name: 'diffQuantity', type: 'float'}
    ]    
}       
);

Ext.define('smartOA.stockMgt.StockTakenVchPanel',
{
    extend: 'smartOA.commonClass.EditVoucherPanel',
    constructor : function()
    {
        Ext.apply(this, {
            loadUrl: 'stockMgt/loadStockTakenVch.action', 
            saveUrl:'stockMgt/saveStockTakenVch.action', 
            updateStateUrl:'stockMgt/updateStateForStockTakenVch.action',
            deptRootId: smartOA.csn.getValue('DEPT_STOCK_ROOT_ID'),
            auditorGroupId: smartOA.csn.getValue('PROD_STOCKTAKEN_AUDITOR_GROUP_ID')
        });        
        
        
        this.callParent(arguments); 
        
        var warehouseStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadStoreListForCombo.action',
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var warehouseCombo = new Ext.form.ComboBox({
                name:'entity.store.id',
                valueField:'id',
                hiddenName:'entity.store.id',
                displayField:'name',
                fieldLabel: '仓库名称',
                emptyText:'请选择仓库',
                editable:true,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:warehouseStore,
                typeAhead: true,
                width : 240,
                queryMode: 'local', 
                margins: '5 0 0 0'
            });            

         warehouseCombo.on('select', function(combo, records, eOpts)
         {     
                if(ds.getCount() > 0 && ds.getAt(0).data.inventoryId != '')
                {
                    ds.removeAll();
                    ds.insert( 1, new smartOA.stockMgt.ProdStockTakenItem());
                }
         });                
            
        var ds = Ext.create('Ext.data.ArrayStore', {
            model : 'smartOA.stockMgt.StockTakenItem',
            autoload: false
        }); 
        
        this.insert(3, {       
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 
                {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaultType: 'textfield',
                items : [
                warehouseCombo
                ]           
        });
        
        this.insert(4, {
                xtype: 'gridpanel',
                frame : false,
                store : ds,
                flex: 11,
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
                {text : '', dataIndex:'id', hidden: true},
                {text : '', dataIndex:'inventoryId', hidden: true},
                {xtype: 'rownumberer'},
                {
                    xtype : 'actioncolumn',
                    width : 50,                  
                    items : [{
                            icon :'images/add.png',
                            tooltip: '增加产品',
                            handler : this.addProd,
                            scope: this,
                            isDisabled: function(grid)
                            {
                                if(this.stateAudited == true)
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
                                store.insert( 1, new smartOA.stockMgt.StockTakenItem());
                            },
                            scope: this,
                            isDisabled: function(grid)
                            {
                                if(this.stateAudited == true)
                                    return true;       
                            }
                        }
                    ]                    
                },
              {text : "物料号" , dataIndex : 'mtNum', filter:true, sortable : true, width : 150, align : 'center',
                filterable: true},
              {text : "物料名称" , dataIndex : 'mtName', sortable : true, width : 150, align : 'center',filterable: true},        
              {text : "单位" , dataIndex : 'mtUnit', sortable : true, width : 80, align : 'center'  },
//              {text : "单价" , dataIndex : 'mtUnitCost',  width : 80, align : 'center'},
              {text : "物料类型" , dataIndex : 'mtType', sortable : true, filter:true, width : 100,  align : 'center',filterable: true ,
                renderer:function(data)
                {
                    switch (data)
                    {
                        case 'PRODUCT':
                            return '成品';
                        case 'SEMI_PRODUCT':
                            return '半成品';
                        case 'RAW_MATERIAL':
                            return '原材料';
                    }                        
                }
              },
                {text : "库存数量" , dataIndex : 'expQuantity', sortable : true, width : 100, align : 'center',
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  + value  : 0);
                    }                     
                },               
                {text : "盘点数量" , dataIndex : 'actQuantity', sortable : true, width : 100, align : 'center',
                    editor: {xtype: 'numberfield', decimalPrecision:0, validator: function(value){ if(value >= 0) return true; return "数量必须大于等于零";}},
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  + value  : 0);
                    }                     
                },   
                {text : "数量差" , dataIndex : 'diffQuantity', sortable : true, width : 100, align : 'center',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        return(record.get('actQuantity') - record.get('expQuantity'));
                    }
                },
                {text : "备注" , dataIndex : 'notes', flex : 1, editor: {xtype: 'textfield'}}
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
                            store.insert( 1, new smartOA.stockMgt.StockTakenItem());
                    } 
                }
            });
        
    },
    convertItem: function(store)
    {
        Ext.define('WHVoucherItemModel',{
            fields: [
                 {name: 'inventoryId', type: 'int'},
                 {name: 'expQuantity', type: 'float'},
                 {name: 'diffQuantity', type: 'float'}
            ]         
        }  
        );        
        
        var result = {failCause: null, list: null};
        var list = new Array();
        for(var i = 0; i<store.getCount(); i++)
        {
            var record = store.getAt(i).getData();     
            
            if(record.inventoryId == 0)
            {
                result.failCause = "单据明细不能为空!"
                return result;
            }
            
            var item = new WHVoucherItemModel();
            
            item.inventoryId = record.inventoryId;
            item.expQuantity = record.expQuantity;
            item.diffQuantity = record.actQuantity - record.expQuantity;
            
            list.push(item);
        }  
        
        result.list = list;
        return result;
    },
    addProd : function(grid, rowIndex, colIndex) 
    {  

        var storeId = this.down("[name=entity.store.id]").getValue();
        
        if(storeId == null)
        {
            Ext.Msg.alert('提醒', "请先选择仓库!");
            return;
        }      
        
        smartOA.util.genWindow({
            loader: {
                    url: 'stockMgt/selectInventory.js',
                    autoLoad: true,
                    scripts:true
                },
            width    : 1100,
            height   : 600,
            maximizable: true,
            modal: true,
            layout   : 'fit',
            resizable: true,                    
            store : grid.store,
            storeId: storeId,
            title: "选择盘点产品"
        });
     },    
    changeToAuditState: function()
    {
        this.callParent(arguments); 
        
        var formpanel = this;        
        formpanel.down("[name=entity.store.id]").setReadOnly(true);
        
    }      

});

Ext.onReady(function(){

    Ext.tip.QuickTipManager.init();
     
    Ext.form.Field.prototype.msgTarget = 'side';

    var win = Ext.WindowMgr.getActive();
    
    win.setSize({width:1000, height:640});
    win.center();
      
    var formpanel = Ext.create('smartOA.stockMgt.StockTakenVchPanel', 
                                {
                                'initId':win.initId, 
                                'parentStore':win.store
                                });           
        
    win.add(formpanel);
    win.doLayout();      
      
});
//</script>