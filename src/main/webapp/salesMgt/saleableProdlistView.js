//<script type="text/javascript">

Ext.define("smartOA.manuMgt.ProdMtItemViewPanel",
{   
    extend : "smartOA.commonClass.ListViewGridPanel",
    title: '产品列表',
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
                 {name: 'stdUnitPrice', type:'float'},                                 
                 {name: 'modelNum',  type: 'string'},
                 {name: 'subModelNum',  type: 'string'},
                 {name: 'orderSeqNum'},
                 {name: 'colorModel'},  
                 {name: 'packageModel'},
                 {name: 'custModelNum'},
                 {name: 'ctgName'},
                 {name: 'qtyInStore',  type: 'float'},
                 {name: 'saleable', type: 'boolean'}
             ]
         });        
                          
        Ext.apply(this, {      
            loadUrl: 'manuMgt/loadAllSlbProdMtItem.action',
            dataModel: 'ProdMtItem', 
            flex:1,
            searchField: 'mtNum',
            columns: [            
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},        
              {text : '', dataIndex:'mtItemId', hidden: true},
              {text : "产品目录" , dataIndex : 'ctgName', filter:true, sortable : true, width : 100, align : 'center',filterable: true
              },
              {text : "基准售价" , dataIndex : 'stdUnitPrice',  width : 100, align : 'center',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');

                    }              
              },              
              {text : "物料号" , dataIndex : 'mtNum', filter:true, sortable : true, width : 150, align : 'center',filterable: true
              },
              {text : "物料名称" , dataIndex : 'mtName', sortable : true, width : 200, align : 'center',filterable: true           
              }, 
              {text : "单位" , dataIndex : 'unit', sortable : true, width : 80, align : 'center'},    
              {text : "库存数量" , dataIndex : 'qtyInStore', sortable : true, width : 100, align : 'center'},             
              {text : "定制订单号" , dataIndex : 'orderSeqNum',  width : 120, align : 'center', filter:true},
              {text : "定制色号" , dataIndex : 'colorModel',  width : 100, align : 'center'},
              {text : '包装方式', dataIndex : 'packageModel',  width : 150, align : 'center'},
              {text : "客户型号" , dataIndex : 'custModelNum',  width : 100, align : 'center'}, 
              {text : "物料说明" , dataIndex : 'mtDscp',  flex:1, align : 'center'}    
              ]             
        });
        
        this.callParent(arguments);
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
             url: "manuMgt/loadSlbProdMtItemByCtg.action",
             extraParams : {'ctgId': data.id}
        });
        
        prodListPanel.getStore().reload();
    }
    );      
});
//</script>