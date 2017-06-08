<script type="text/javascript">

Ext.namespace("smartOA.basicElem.framework");

Ext.define('smartOA.basicElem.Product', {
     extend: 'Ext.data.Model',
     fields: [
         {name: 'entityId', type: 'int'},
         {name: 'cost', type: 'number'},
         {name: 'description',  type: 'string'},
         {name: 'maxPrice',  type: 'number'},
         {name: 'minPrice',  type: 'number'},
         {name: 'modelNum',  type: 'string'},
         {name: 'subModelNum',  type: 'string'},
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
    loadUrl: 'basicElem/loadAllProduct.action',
    loadPara: null,
    constructor : function(conf)
    {   
        if(conf.loadUrl != undefined )
            this.loadUrl = conf.loadUrl;
        if(conf.loadPara != undefined)
            this.loadPara = conf.loadPara;
            
        var myStore = Ext.create('Ext.data.Store', {
            model : 'smartOA.basicElem.Product',
            proxy: {
                type: 'ajax',
                url: this.loadUrl,
                extraParams: {id: this.loadPara}, 
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
            columnLines : true,
            autoScroll:true,            
            frame : true,
            store : myStore,
            columns: [
              {xtype: 'rownumberer'},
              {text : '', dataIndex:'entityId', hidden: true},              
              {text : "产品型号" , dataIndex : 'modelNum', sortable : true, width : 120, align : 'center'},
              {text : "产品子型号" , dataIndex : 'subModelNum', sortable : true, width : 150, align : 'center'},              
              {text : "产品类别" , dataIndex : 'category', sortable : true, width : 120, align : 'center'},
//              {text : "产品性质" , dataIndex : 'type', sortable : true, width : 90, align : 'center'},
              {text : "基础售价" , dataIndex : 'cost', sortable : true, width : 100, align : 'center',
                renderer: Ext.util.Format.cnMoney},
              {text : "最高售价" , dataIndex : 'maxPrice', sortable : true, width : 100, align : 'center',
                renderer: Ext.util.Format.cnMoney},
              {text : "最低售价" , dataIndex : 'minPrice', sortable : true, width : 100, align : 'center',
                renderer: Ext.util.Format.cnMoney},                 
              {text : "产品名称" , dataIndex : 'name', sortable : true, width : 120, align : 'center'},
              {text : "产品描述" , dataIndex : 'description', sortable : true, flex : true, align : 'center'}
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
                checkIndexes: ['modelNum'],
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

            var convRec = {productId:data.entityId,  modelNum:data.modelNum, subModelNum:data.subModelNum, 
                            name:data.name, unit:data.unit, ctgName:data.category};
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
    
    var framePanel = Ext.create('smartOA.basicElem.selectProductGridPanel',
                        {
                            parentStore : win.store,
                            loadUrl: win.loadUrl,
                            loadPara: win.loadPara
                        });
//    var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});

    win.add(framePanel);
    win.doLayout(); 

});
</script>