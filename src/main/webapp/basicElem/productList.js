//<script type="text/javascript">

Ext.define("smartOA.basicElem.ProductListGridPanel",
{   
    extend : "smartOA.commonClass.EditListViewGridPanel",
    title : '产品列表',
    constructor : function()
    {  
        
        Ext.define('Product', {
             extend: 'Ext.data.Model',
             fields: [
                 {name: 'entityId', type: 'int'},
                 {name: 'cost', type: 'number'},
                 {name: 'description',  type: 'string'},
                 {name: 'modelNum',  type: 'string'},
                 {name: 'subModelNum',  type: 'string'},
                 {name: 'name',  type: 'string'},
                 {name: 'category',  type: 'string'},
                 {name: 'unit', type: 'string'},
                 {name: 'type', type: 'string'},
                 {name: 'disabled'}
             ]
         });             
               
        Ext.apply(this, {
            dataModel: 'Product',
            loadUrl: 'basicElem/loadAllProduct.action',
            delUrl : 'basicElem/delProduct.action',
            loadDisabledUrl: 'basicElem/loadDisabledProduct.action',      
            flex:1,
            searchField: 'modelNum',
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'entityId', hidden: true},
              {text : "产品型号" , dataIndex : 'modelNum', sortable : true, width : 150, align : 'center'},
              {text : "子型号" , dataIndex : 'subModelNum', sortable : true, width : 150, align : 'center'},              
              {text : "产品类别" , dataIndex : 'category', sortable : true, width : 150, align : 'center'},
              {text : "产品性质" , dataIndex : 'type', sortable : true, width : 100, align : 'center'},
              {text : "计价单位" , dataIndex : 'unit', sortable : true, width : 100, align : 'center'},
              {text : "参考价(¥)" , dataIndex : 'cost', sortable : true, width : 100, align : 'center',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    }
              },            
              {text : "产品名称" , dataIndex : 'name', sortable : true, flex:1, align : 'center'},
              {text : "停用" , dataIndex : 'disabled', sortable : true, 
                    align : 'center',
                    width: 60,
                    renderer: function(data)
                    {
                        if(data == true)
                            return '是';
                        else
                            return '否';
                    }
              }      
              ]
        });
        
        this.callParent(arguments);
    },
    openDetailsWin : function(id)
    {
             smartOA.util.genWindow({
                    loader: {
                            url: 'basicElem/editProduct.js',
                            autoLoad: true,
                            scripts:true
                        },
                    width    : 660,
                    height   : 440,
                    maximizable: true,
                    modal: true,
                    layout   : 'fit',
                    resizable: true,
                    initId : id,
                    store : this.store,
                    title : '产品编辑'
                });         
    },
    openProdUnitEdit : function()
    {
             smartOA.util.genWindow({
                    title: '产品单位管理',
                    loader: {
                            url: 'basicElem/prodUnitList.js',
                            autoLoad: true,
                            scripts:true
                        },
                    width    : 480,
                    height   : 360,
                    maximizable: true,
                    modal: true,
                    layout   : 'fit',
                    resizable: true
                });         
    },
    openProdTypeEdit : function()
    {
             smartOA.util.genWindow({
                    title: '产品类别管理',
                    loader: {
                            url: 'basicElem/prodTypeList.js',
                            autoLoad: true,
                            scripts:true
                        },
                    width    : 480,
                    height   : 360,
                    maximizable: true,
                    modal: true,
                    layout   : 'fit',
                    resizable: true
                });         
    },
    afterRender: function(panel)
    {
        var bar = this.down('toolbar');
        
        bar.insert(4, [                 
                {
                    text  : '类别管理',
                    handler: this.openProdTypeEdit,
                    scope : this
                },
                '-',
                {
                    text : '单位管理',
                    handler : this.openProdUnitEdit,
                    scope : this
                },
                '-'
                ]);
                
        this.callParent(arguments);        
    }
  
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var ctgPanel = Ext.create('smartOA.commonClass.EditTreeViewPanel',{
            loadUrl : 'basicElem/loadProdCtgTree.action',
            editJs : 'basicElem/editProdCtg.js',
            delUrl : 'basicElem/delProdCtg.action',
            width: 220,
            resizable : true,
            title : '产品类别'
    }); 
    
    var prodListPanel = Ext.create('smartOA.basicElem.ProductListGridPanel');
    
    var framePanel = Ext.create('Ext.panel.Panel',
            {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items : [ctgPanel, prodListPanel]
            });  
            
   if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    }
   
    ctgPanel.on('itemclick', function(object,record)
    {
        var data = record.getData();
        
        var proxy = prodListPanel.getStore().getProxy();
        
        Ext.apply(proxy, {
        url : 'basicElem/loadProductByCtg.action',
        extraParams : {'ctgId': data.id}
        });
        
        prodListPanel.getStore().reload();
    }
    );    

});
//</script>