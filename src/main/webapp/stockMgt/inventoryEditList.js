//<script type="text/javascript">

Ext.define("stockMgt.InventoryEditPanel",
{   
    extend : "smartOA.commonClass.ListViewGridPanel",
    tile : '库存列表',
    constructor : function()
    {                                    
        Ext.define('InventoryModel',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'inventoryId', type: 'int'},
                 {name: 'storeName'},
                 {name: 'mtNum'},
                 {name: 'mtName'},
                 {name: 'mtSource'},
                 {name: 'mtUnit'},
                 {name: 'mtType'},
                 {name: 'mtDscp'},
//                 {name: 'mtUnitCost', type: 'float'},
                 {name: 'quantity', type: 'float'}
            ]         
        }  
        );
        
        Ext.apply(this, {      
            loadUrl: "stockMgt/loadAllInventory.action",
            dataModel: 'InventoryModel', 
            searchField: 'mtNum',
            columns: [
            {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
            {text : '', dataIndex:'inventoryId', hidden: true},
            {
                xtype : 'actioncolumn',
                text: '删除',
                width : 60,
                align: 'center',
                items : [{
                    icon :'images/delete.gif',                   
                    tooltip: '点击删除条目',                       
                    handler : function(grid, rowIndex, colIndex) {
                        
                        var data = grid.getStore().getAt(rowIndex).data;                          
                        
                        if(data.quantity > 0)
                        {
                            Ext.Msg.alert('错误', '库存数量不为零，不允许删除！');
                            return;
                        }
                                     
                        var delFunc = function(buttonId, text, opt)
                        {
                            if(buttonId == "yes")
                            {
                                Ext.Ajax.request(
                                {
                                    url : 'stockMgt/delEmptyInventory.action',
                                    params : {'id': data.inventoryId},
                                    success: function(response, opts)
                                    {
                                        var obj = Ext.JSON.decode(response.responseText);
                                        if(obj.success != true)
                                        {
                                            Ext.Msg.alert("错误", obj.message);
                                            return;
                                        }                       
                                        Ext.Msg.alert('成功', '删除成功！');
                                        grid.getStore().reload();
                                    }
                                }, this
                                );                 
                            }
                        };
                        
                        Ext.Msg.show(
                        {
                           title : '提醒',
                           msg : '确认删除该条库存?',
                           buttons : Ext.Msg.YESNO,
                           scope : this,
                           fn  : delFunc,
                           icon :Ext.MessageBox.QUESTION
                        });                              
                    
                    
                    }}
                ]                    
              },                 
              {text : "仓库名称" , dataIndex : 'storeName', sortable : true, width : 150, align : 'center'},             
              {text : "物料号" , dataIndex : 'mtNum', filter:true, sortable : true, width : 150, align : 'center',
                filterable: true},
              {text : "物料名称" , dataIndex : 'mtName', sortable : true, width : 180, align : 'center',filterable: true},        
              {text : "单位" , dataIndex : 'mtUnit', sortable : true, width : 80, align : 'center',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return "总计:";
                    }     
              },
              {text : "数量" , dataIndex : 'quantity', sortable : true, filter:true, width : 120, align : 'center',
                    summaryType: 'sum' 
              }, 
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
              {text : "物料来源" , dataIndex : 'mtSource',  width : 100, align : 'center',
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
              {text : "物料说明" , dataIndex : 'mtDscp',  flex:1, align : 'center'}
              ],            
            selType: 'rowmodel'
        });
        
        this.callParent(arguments);
    }
});


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    console.log("onready" +
    		""); 
    
    var inventoryListPanel = Ext.create('stockMgt.InventoryEditPanel',
    {
        flex: 1
    });       
    

    var storePanel = Ext.create('js-lib.myapp.ux.TreeListViewPanel',
    {
        width: 200,
        loadUrl: 'basicElem/loadStoreTree.action',
        title: '仓库列表'      
    }    
    );

    var framePanel = Ext.create('Ext.panel.Panel',
                    {   
                        layout: {
                            type: 'hbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items : [storePanel, inventoryListPanel]
                    });     
    
    storePanel.on('itemclick', function(object,record)
    {
        var data = record.getData();
        
        var proxy = inventoryListPanel.getStore().getProxy();
        
        Ext.apply(proxy, {
        url : 'stockMgt/loadInventoryByStore.action',
        extraParams : {'storeId': data.id}
        });
        
        inventoryListPanel.refresh();
    }
    );      
    
   if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    }
 

});
//</script>