<script type="text/javascript">



Ext.define('smartOA.stockMgt.StockTsfItem',{
     extend : 'Ext.data.Model',
    fields: [
             {name: 'mtItemId', type: 'int', defaultValue: 0},
             {name: 'mtItemNum'},
             {name: 'mtNum'},
             {name: 'mtName'},
             {name: 'mtUnit'},
             {name: 'mtType'},
//             {name: 'mtUnitCost', type: 'float'},
             {name: 'quantity', type: 'float'}
    ]    
}       
);

Ext.define('smartOA.stockMgt.StockTsfVch',
{
    extend: 'smartOA.commonClass.EditVoucherPanel',
    constructor : function()
    {
        Ext.apply(this, 
        {
            deptRootId: smartOA.csn.getValue('DEPT_STOCK_ROOT_ID'),
            auditorGroupId: smartOA.csn.getValue('PROD_TSF_AUDITOR_GROUP_ID')
        });        
        
        this.callParent(arguments); 
        
        var srcWarehouseStore = Ext.create('Ext.data.Store',
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
        
        var srcWarehouseCombo = new Ext.form.ComboBox({
                name:'entity.srcStore.id',
                valueField:'id',
                hiddenName:'entity.dstStore.id',
                displayField:'name',
                fieldLabel: '移出库名称',
                emptyText:'请选择仓库',
                editable:true,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:srcWarehouseStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local', 
                margins: '5 0 0 0'
            });                          
            
        var dstWarehouseCombo = new Ext.form.ComboBox({
                name:'entity.dstStore.id',
                valueField:'id',
                hiddenName:'entity.dstStore.id',
                displayField:'name',
                fieldLabel: '移入库名称',
                emptyText:'请选择仓库',
                editable:true,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:srcWarehouseStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local', 
                margins: '5 0 0 30'
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
                srcWarehouseCombo,
                dstWarehouseCombo,
                {fieldLabel: '', margins: '5 0 0 30', flex:1, disabled:true}
                ]           
        });                  
        
         srcWarehouseCombo.on('select', function(combo, records, eOpts)
         {     
                if(ds.getCount() > 0 && ds.getAt(0).data.inventoryId != '')
                {
                    ds.removeAll();
                    ds.insert( 1, new smartOA.stockMgt.StockTsfItem());
                }
         });                
            
        var ds = Ext.create('Ext.data.ArrayStore', {
            model : 'smartOA.stockMgt.StockTsfItem',
            autoload: false
        }); 
        
        this.insert(4, {
                xtype: 'gridpanel',
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
                {text : '', dataIndex:'id', hidden: true},
                {text : '', dataIndex:'custProdId', hidden: true},
                {xtype: 'rownumberer'},
                {
                    xtype : 'actioncolumn',
                    width : 40, 
                    align : 'center',
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
                                store.insert( 1, new smartOA.stockMgt.StockTsfItem());
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
//              {text : "单价(¥)" , dataIndex : 'mtUnitCost',  width : 100, align : 'center'},
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
                {text : "操作数量" , dataIndex : 'quantity', sortable : true, width : 120, align : 'center',
                    editor: {xtype: 'numberfield', decimalPrecision:0, validator: function(value){ if(value >= 0) return true; return "数量必须大于等于零";}},
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  + value  : 0);
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
                            store.insert( 1, new smartOA.stockMgt.StockTsfItem());
                    } 
                }
            });        
        
    },
    convertItem: function(store)
    {
        Ext.define('WHVoucherItemModel',{
            fields: [
                 {name: 'mtItemId', type: 'int'},
                 {name: 'quantity', type: 'float'},
                 {name: 'notes'} 
            ]         
        }  
        );        
        
        var result = {failCause: null, list: null};
        var list = new Array();
        for(var i = 0; i<store.getCount(); i++)
        {
            var record = store.getAt(i).getData();  

            if(record.mtItemId == 0)
            {
                result.failCause = "单据明细不能为空!"
                return result;
            }
            
            if(record.quantity <= 0)
            {
                result.failCause = "产品数量不能为零";
                return result;
            }                 
            
            var item = new WHVoucherItemModel();
            item.mtItemId = record.mtItemId;
            item.quantity = record.quantity;
            item.notes = record.notes;
            list.push(item);
        } 
        
        result.list = list;
        return result;
    },
    addProd : function(grid) 
    {  
        var storeId = this.down("[name=entity.srcStore.id]").getValue();
        
        if(storeId == null)
        {
            Ext.Msg.alert('提醒', "请先选择移出库!");
            return;
        }      
        
        smartOA.util.genWindow({
            loader: {
                    url: 'stockMgt/selectInventory.js',
                    autoLoad: true,
                    scripts:true
                },
            width    : 1020,
            height   : 400,
            maximizable: true,
            modal: true,
            layout   : 'fit',
            resizable: true,                    
            store : grid.store,
            storeId: storeId,
            title: "选择移出产品"
        });
     },    
    changeToAuditState: function()
    {
        this.callParent(arguments); 
        
        var formpanel = this;        
        formpanel.down("[name=entity.srcStore.id]").setReadOnly(true);
        formpanel.down("[name=entity.dstStore.id]").setReadOnly(true);     
    }      

});

Ext.onReady(function(){

    Ext.tip.QuickTipManager.init();
     
    Ext.form.Field.prototype.msgTarget = 'side';
     
    var win = Ext.WindowMgr.getActive();
    
    win.setSize({width:900, height:500});
    win.center();
      
    var formpanel = Ext.create('smartOA.stockMgt.StockTsfVch', 
                                {
                                    initId:win.initId, 
                                    parentStore:win.store,
                                    loadUrl:'stockMgt/loadStockTsfVch.action',
                                    saveUrl: 'stockMgt/saveStockTsfVch.action',
                                    updateStateUrl: 'stockMgt/updateStateForStockTsfVch.action'}
                                );          
        
        
    win.add(formpanel);
    win.doLayout();        

});
</script>