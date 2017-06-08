<script type="text/javascript">


Ext.define('smartOA.stockMgt.StockItemModel',{
     extend : 'Ext.data.Model',
    fields: [
         {name: 'mtItemId', type: 'int', defaultValue: 0},
         {name: 'mtNum'},
         {name: 'mtName'},
         {name: 'packageModel'},
         {name: 'unit'},
         {name: 'quantity', type: 'float'},
         {name: 'unitPrice',  type: 'float'},
         {name: 'custModelNum'},
         {name: 'ctgName'}       
    ]}  
);

Ext.define("smartOA.stockMgt.selectProductGridPanel",
{   
    extend : "Ext.grid.Panel",
    parentStore : ' ',
    constructor : function(conf)
    {                   
        var myStore = Ext.create('Ext.data.Store', {
            model : 'smartOA.stockMgt.StockItemModel',
            proxy: {
                type: 'ajax',
                url: conf.loadUrl,
                extraParams: {id: conf.salesVchId}, 
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
                {text : '', dataIndex:'mtItemId', hidden: true},  
                {text : '', dataIndex:'unitPrice', hidden: true},  
                {text : "物料号" , dataIndex : 'mtNum', filter:true, sortable : true, width : 150, align : 'center',filterable: true},
                {text : "物料名称" , dataIndex : 'mtName', sortable : true, width : 150, align : 'center',filterable: true},                
                {text : "单位" , dataIndex : 'unit',  width : 80, align : 'center'},
                {text : "数量" , dataIndex : 'quantity', value: 1, sortable : true, width : 120, align : 'center'},                
//                {text : "单价" , dataIndex : 'unitPrice', width : 80, align : 'center'},
                {text : "包装方式" , dataIndex : 'packageModel',  width : 150, align : 'center'},
                {text : "客户型号" , dataIndex : 'custModelNum',  flex:1, align : 'center'}
//                {text : "产品类别" , dataIndex : 'ctgName',  flex:1, align : 'center'}
              ],            
            selModel: selModel,
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
                
                if(data.mtItemId === oldRec.mtItemId)
                {
                    Ext.Msg.alert('提醒', data.mtNum +' 已经存在, 请不要重复选择');
                    return;
                }
            }
            
            var convRec = {mtItemId:data.mtItemId, mtNum:data.mtNum, mtName:data.mtName, ctgName:data.ctgName, unit:data.unit,
                            quantity:data.quantity, unitPrice:data.unitPrice, packageModel:data.packageModel, custModelNum:data.custModelNum};
            convRecords.push(convRec);
        }                
        if(this.parentStore.getCount() == 1 && this.parentStore.getAt(0).data.mtItemId == 0)
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
    
    var framePanel = Ext.create('smartOA.stockMgt.selectProductGridPanel',
                        {
                            parentStore : win.store,
                            loadUrl: win.loadUrl,
                            salesVchId: win.salesVchId
                        });

    win.add(framePanel);
    win.doLayout(); 

});
</script>