<script type="text/javascript">

Ext.namespace("smartOA.basicElem.framework");

Ext.define('smartOA.basicElem.Product', {
     extend: 'Ext.data.Model',
     fields: [
         {name: 'id', type: 'int'},
         {name: 'cost', type: 'number'},
         {name: 'description',  type: 'string'},
         {name: 'maxPrice',  type: 'number'},
         {name: 'minPrice',  type: 'number'},
         {name: 'modelNum',  type: 'string'},
         {name: 'name',  type: 'string'},
         {name: 'category',  type: 'string'},
         {name: 'unit', type: 'string'},
         {name: 'type', type: 'string'}
     ]
 });

Ext.define("smartOA.basicElem.selectProductGridPanel",
{   
    extend : "Ext.grid.Panel",
    parentStore : ' ',
    constructor : function()
    {                   
        var myStore = Ext.create('Ext.data.Store', {
            model : 'smartOA.basicElem.Product',
            data:{'lists':[
                {'id': 1, 'cost': 5.55, 'description':'  ', "maxPrice":6.77,  "minPrice":6.33, 'modelNum':'TR54345435',
                'name' : '米奇三轮车', 'category' : '三轮车', 'unit' : '辆', 'type' : '销售类'}, 
                {'id': 2, 'cost': 5.55, 'description':'  ', "maxPrice":6.77,  "minPrice":6.33, 'modelNum':'TR54345436',
                'name' : '麦昆三轮车', 'category' : '三轮车', 'unit' : '辆', 'type' : '销售类'}, 
                {'id': 3, 'cost': 5.55, 'description':'  ', "maxPrice":6.77,  "minPrice":6.33, 'modelNum':'TR54345437',
                'name' : '老鼠三轮车', 'category' : '三轮车', 'unit' : '辆', 'type' : '销售类'}
            ]},
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
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
            title : '产品列表选择',
            frame : true,
            store : myStore,
            columns: [
              {xtype: 'rownumberer'},
              {text : '', dataIndex:'id', hidden: true},              
              {text : "产品型号" , dataIndex : 'modelNum', sortable : true, width : 120, align : 'center'},
              {text : "产品名称" , dataIndex : 'name', sortable : true, width : 150, align : 'center'},
              {text : "产品类别" , dataIndex : 'category', sortable : true, width : 90, align : 'center'},
              {text : "产品性质" , dataIndex : 'type', sortable : true, width : 90, align : 'center'},
              {text : "成本" , dataIndex : 'cost', sortable : true, width : 60, align : 'center',
                renderer: Ext.util.Format.cnMoney},
              {text : "最高售价" , dataIndex : 'maxPrice', sortable : true, width : 60, align : 'center',
                renderer: Ext.util.Format.cnMoney},
              {text : "最低售价" , dataIndex : 'minPrice', sortable : true, width : 60, align : 'center',
                renderer: Ext.util.Format.cnMoney},                
              {text : "产品描述" , dataIndex : 'description', sortable : true, flex : true, align : 'center'}
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
        
        console.log("constructor seclected.");
        
        this.callParent(arguments);
        
        console.log(this.parentStore);
    },
    saveAndReturn: function()
    {
        var records = this.getSelectionModel().getSelection();
        
        var convRecords = new Array();
        for(var rec in records)
        {
            var data = records[rec].data;
            var convRec = {modelNum : data.modelNum, name:data.name, unit:data.unit, unitPrice:data.maxPrice};
            convRecords.push(convRec);
        }                
        if(this.parentStore.getCount() == 1 && this.parentStore.getAt(0).data.modelNum == '')
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
    
/*    var ctgPanel = Ext.create('smartOA.Util.GeneTreePanel',{
            loadUrl : 'basicElem/loadProdCtgTree.action',
            editJs : 'basicElem/editProdCtg.js',
            delUrl : 'basicElem/delProdCtg.action',
            itemName : '产品目录',
            region : 'west',
            width: 200,
            collapsible: true,
            resizable : true,
            layout: 'fit',
            title : '产品目录'
    });
    
    var prodListPanel = Ext.create('smartOA.basicElem.selectProductGridPanel',
    {
        region: 'center',
        layout: 'fit'
    });
    
    var framePanel = Ext.create('Ext.panel.Panel',
            {
                layout : 'border',
                items : [ctgPanel, prodListPanel]
            });    
            
    ctgPanel.on('itemclick', function(object,record)
    {
        var data = record.getData();
        
        var proxy = prodListPanel.getStore().getProxy();
        
        Ext.apply(proxy, {
        url : 'basicElem/loadProductByCtg.action',
        extraParams : {'ctgId': data.id}
        });
        
        prodListPanel.refresh();
    }
    );             
*/  
    var win = Ext.WindowMgr.getActive();
    
    console.log(win.store);   
    
    var framePanel = Ext.create('smartOA.basicElem.selectProductGridPanel',
                        {
                            parentStore : win.store
                        });
//    var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    
        win.add(framePanel);
    win.doLayout(); 

});
</script>