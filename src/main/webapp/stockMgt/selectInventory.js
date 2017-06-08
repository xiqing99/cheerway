<script type="text/javascript">


Ext.define('smartOA.stockMgt.InventoryModel',{
     extend : 'Ext.data.Model',
     fields: [
                 {name: 'inventoryId', type: 'int', defaultValue: 0},
                 {name: 'storeName'},
                 {name: 'mtItemId', type: 'int', defaultValue: 0},
                 {name: 'mtNum'},
                 {name: 'mtName'},
                 {name: 'mtSource'},
                 {name: 'mtUnit'},
                 {name: 'mtType'},
                 {name: 'mtDscp'},
                 {name: 'mtUnitCost', type: 'float'},
                 {name: 'quantity', type: 'float'}
      ]         
}  
); 
 
Ext.define("smartOA.stockMgt.selectInventoryGridPanel",
{   
    extend : "Ext.grid.Panel",
    parentStore : ' ',
    constructor : function(conf)
    {               
        var myStore = Ext.create('Ext.data.Store', {
            model : 'smartOA.stockMgt.InventoryModel',
            proxy: {
                type: 'ajax',
                url: 'stockMgt/loadInventoryByStore.action',
                extraParams: {storeId:conf.storeId}, 
                reader: {
                    type: 'json'
                }
            },
            autoLoad : true
        });     

        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            listeners: {
                selectionchange: function(sm, selections) {
    //                grid4.down('#removeButton').setDisabled(selections.length === 0);
                }
            }
        });        
        
        Ext.apply(this, {
            
            autoScroll:true,            
            frame : true,
            columnLines : true,
            store : myStore,
            columns: [
              {xtype: 'rownumberer'},
              {text : '', dataIndex:'inventoryId', hidden: true},
              {text : "仓库名称" , dataIndex : 'storeName', sortable : true, width : 120, align : 'center'},             
              {text : "物料号" , dataIndex : 'mtNum', filter:true, sortable : true, width : 120, align : 'center',
                filterable: true},
              {text : "物料名称" , dataIndex : 'mtName', sortable : true, width : 120, align : 'center',filterable: true},      
              {text : "物料类型" , dataIndex : 'mtType', sortable : true, filter:true, width : 120,  align : 'center',filterable: true,
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
              {text : "物料来源" , dataIndex : 'mtSource',  width : 120, align : 'center',
                renderer:function(data)
                {
                    switch (data)
                    {
                        case 'PURCHASE':
                            return '采购';
                        case 'PRODUCE':
                            return '自制';
                        case 'OUTSOURCE':
                            return '外包';
                    }                        
                }              
              },  
              {text : "单位" , dataIndex : 'mtUnit', sortable : true, width : 60, align : 'center',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return "总计:";
                    }     
              },
              {text : "数量" , dataIndex : 'quantity', sortable : true, filter:true, width : 100, align : 'center',
                    summaryType: 'sum' 
              },            
              {text : "单价" , dataIndex : 'mtUnitCost',  width : 120, align : 'center'} ,
               {text : "物料说明" , dataIndex : 'mtDscp',  flex:1, align : 'center'}
              ],            
            selModel: selModel,
            features:[
            {
                ftype : 'searching',
                minChars : 2,
                width : 100,
                position : 'top',
                iconCls: 'Zoom',
                menuStyle: 'radio',
                showSelectAll : false,
                checkIndexes: ['mtNum'],
                align : 'right',
                mode : 'local'
            }],
            tbar: ['->','->',
               {
                    text:'选择',
                    icon :'images/accept.png',
                    iconCls :'add-icon',
                    handler: this.saveAndReturn,
                    scope: this
               },
               {
                    text:'取消',
                    icon :'images/cross.png',
                    iconCls :'add-icon',
                    handler: function()
                    {
                        Ext.WindowMgr.getActive().close();
                    },
                    scope: this
               }               
                ]
        });

        this.callParent(arguments);
    },
    saveAndReturn: function()
    {
        var records = this.getSelectionModel().getSelection();
        if(records.length < 1)
        {
             Ext.Msg.alert('提醒', '请先选择数据行!');
             return;
        }
        
        var convRecords = new Array();
        for(var rec in records)
        {
            var data = records[rec].data;
            
            for(var i =0; i<this.parentStore.getCount(); i++)
            {
                var oldRec = this.parentStore.getAt(i).getData();
                
                if(data.inventoryId == oldRec.inventoryId)
                {
                    Ext.Msg.alert('提醒', ' 已经存在, 请不要重复选择');
                    return;
                }
            }
            
            var convRec = {inventoryId:data.inventoryId, mtItemId:data.mtItemId, mtNum:data.mtNum, mtName:data.mtName, mtSource:data.mtSource, mtUnit:data.mtUnit,
                            expQuantity:data.quantity, actQuantity:data.quantity, mtType:data.mtType, mtDscp:data.mtDscp, quantity: data.quantity,
                            mtUnitCost:data.mtUnitCost};
            convRecords.push(convRec);
        }                
        if(this.parentStore.getCount() == 1 && this.parentStore.getAt(0).data.mtNum == '')
        {
             this.parentStore.removeAt(0);
        }
        
        this.parentStore.insert(this.parentStore.getCount(), convRecords);
        
        Ext.WindowMgr.getActive().close();
    }    
}
    
);


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side'

    var win = Ext.WindowMgr.getActive();    
    
    var framePanel = Ext.create('smartOA.stockMgt.selectInventoryGridPanel',
                        {
                            parentStore : win.store,
                            storeId: win.storeId
                        });
//    var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});

    win.add(framePanel);
    win.doLayout(); 

});
</script>