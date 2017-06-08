//<script type="text/javascript">

Ext.define("smartOA.manuMgt.ProdMtItemViewPanel",
{   
    extend : "Ext.grid.Panel",
    title: '物料列表',
    constructor : function()
    {                                    
        Ext.define('ProdMtItem', {
             extend: 'Ext.data.Model',
             fields: [
                 {name: 'mtItemId', type: 'int'},
                 {name: 'mtNum'},
                 {name: 'mtName'},
                 {name: 'unit'},
                 {name: 'mtDscp'},
                 {name: 'unitPrice', type:'float'},
                 {name: 'modelNum',  type: 'string'},
                 {name: 'subModelNum',  type: 'string'},
                 {name: 'orderSeqNum'},
                 {name: 'colorModel'},  
                 {name: 'packageModel'},
                 {name: 'custModelNum'},                
                 {name: 'qtyInStore',  type: 'float'},
                 {name: 'disabled', type: 'boolean'}
             ]
         });        
 
          var myStore = Ext.create('Ext.data.Store', {
             model: 'ProdMtItem',
             proxy: {
                 type: 'ajax',
                 url: "manuMgt/loadAllProdMtItem.action",
                 reader: {
                     type: 'json',
                     root: 'lists'
                 }
             },
             autoLoad: false,
             autoSync: false
         });          
         
         
        Ext.apply(this, {      
            autoScroll:true,
            columnLines : true,
            frame : false, 
            store : myStore,  
            flex:1,
            columns: [            
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},        
              {text : '', dataIndex:'mtItemId', hidden: true},
              {text : "停用" , dataIndex : 'disabled', width : 50, align : 'center',
                    renderer: function(data)
                    {
                        if(data == true)
                            return '是';
                        else
                            return '否';
                    }
              },              
              {text : "物料号" , dataIndex : 'mtNum', filter:true, sortable : true, width : 150, align : 'center',filterable: true
              },
              {text : "物料名称" , dataIndex : 'mtName', sortable : true, width : 150, align : 'center',filterable: true          
              }, 
              {text : "色号" , dataIndex : 'colorModel',  width : 100, align : 'center'},
              {text : "单位" , dataIndex : 'unit', sortable : true, width : 80, align : 'center'},  
              {text : "基准售价(¥)" , dataIndex : 'unitPrice',  width : 120, align : 'center',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    }              
              } ,   
              {text : "物料说明" , dataIndex : 'mtDscp',  width : 200, align : 'center'},                        
              {text : "产品型号" , dataIndex : 'modelNum', sortable : true, width : 120, align : 'center', filter:true},
              {text : "产品子型号" , dataIndex : 'subModelNum', sortable : true, width : 120, align : 'center', filter:true},
              {text : '包装方式', dataIndex : 'packageModel',  width : 150, align : 'center'},
              {text : "定制订单号" , dataIndex : 'orderSeqNum',  width : 120, align : 'center', filter:true},
              {text : "客户型号" , dataIndex : 'custModelNum',  width : 100, align : 'center'}
              ],                
            selType: 'rowmodel',
            features:[
                {
                    ftype : 'searching',
                    minChars : 2,
                    width : 100,
                    position : 'top',
                    iconCls: 'Zoom',
                    menuStyle: 'radio',
                    showSelectAll : false,
                    checkIndexes: ['name'],
                    align : 'right',
                    mode : 'local'
                },
                {
                    ftype: 'filters',
                    local: true      
                } 
            ],
            tbar: [
                {
                    text: '已停用列表',
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: this.loadDisabled,
                    scope: this
                },
                {
                    text: '导出到Excel',
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: function(btn)
                    {
                       btn.up('grid').downloadExcelXml(); 
                    }
                },
                {
                    text: '打印表单',
                    icon :'images/printer.png',
                    iconCls :'save-icon',
                    handler: function(btn)
                    {
                       var grid = btn.up('grid');
                       Ext.ux.grid.Printer.printAutomatically = false;
                       Ext.ux.grid.Printer.print(grid);
                    }
                }                
            ]                 
            
        });
        
        this.callParent(arguments);
    },
    refresh: function()
    {
        console.log("refresh");
        this.store.reload();
    },
    loadDisabled: function()
    {
        var proxy = this.store.getProxy();
        
        Ext.apply(proxy, {
        url : 'manuMgt/loadAllDisabledProdMtItem.action',
        extraParams : {}
        });
        
        this.store.reload();        
    }
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var ctgPanel = Ext.create('js-lib.myapp.ux.TreeListViewPanel',{
            loadUrl : 'basicElem/loadProdCtgTree.action',
            editJs : 'basicElem/editProdCtg.js',
            delUrl : 'basicElem/delProdCtg.action',
            itemName : '产品目录',
            width: 180,
            resizable : true,
            title : '产品目录'
    });              
 
    var prodListPanel = Ext.create('smartOA.manuMgt.ProdMtItemViewPanel');
    
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
        url : 'manuMgt/loadProdMtItemByCtg.action',
        extraParams : {'ctgId': data.id}
        });
        
        prodListPanel.getStore().reload();
    }
    );      
});
//</script>