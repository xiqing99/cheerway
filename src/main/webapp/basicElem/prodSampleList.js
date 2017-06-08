//<script type="text/javascript">

Ext.define("smartOA.basicElem.ProdSampleListPanel",
{   
    extend : "smartOA.commonClass.EditListViewGridPanel",
    title : '样品列表',
    constructor : function()
    {   
        Ext.define('ProdSample', {
             extend: 'Ext.data.Model',
             fields: [
                 {name: 'entityId', type: 'int'},
                 {name: 'name'},
                 {name: 'custName',  type: 'string'},
                 {name: 'packDes',  type: 'string'},
                 {name: 'type',  type: 'string'},
                 {name: 'rspEmpName',  type: 'string'},
                 {name: 'lendEmpName',  type: 'string'},
                 {name: 'lendDate', type: 'string'},
                 {name: 'notes', type: 'string'}
             ]
         });             
               
        Ext.apply(this, {
            dataModel: 'ProdSample',
            loadUrl: 'basicElem/loadAllProdSample.action',
            delUrl : 'basicElem/delProdSample.action',
            loadDisabledUrl: 'basicElem/loadDisabledProdSample.action',      
            flex:1,
            searchField: 'name',
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'entityId', hidden: true},
                {
                    xtype : 'actioncolumn',
                    text: '领用样品',
                    width : 80,
                    align: 'center',
                    altText: '领用',
                    items : [{
                        icon :'images/accept.png',
                        tooltip: '点击领用样品',                       
                        handler : function(grid, rowIndex, colIndex) {
                            
                            var data = grid.getStore().getAt(rowIndex).data;  

                            var id = data.entityId;

                            var lendFunc = function(buttonId, text, opt)
                            {
                                if(buttonId == "yes")
                                {
                                    Ext.Ajax.request(
                                    {
                                        url : 'basicElem/lendProdSample.action',
                                        params : {'id': id},
                                        success: function(response, opts)
                                        {
                                            var obj = Ext.JSON.decode(response.responseText);
                                            if(obj.success != true)
                                            {
                                                Ext.Msg.alert("错误", obj.message);
                                                return;
                                            }                       
                                            Ext.Msg.alert('成功', '成功领用该样品！');
                                            grid.getStore().reload();
                                        }
                                    }, this
                                    );                 
                                }
                            };
                            
                            Ext.Msg.show(
                            {
                               title : '提醒',
                               msg : '确认领用该样品?',
                               buttons : Ext.Msg.YESNO,
                               scope : this,
                               fn  : lendFunc,
                               icon :Ext.MessageBox.QUESTION
                            });                              
                        
                        
                        }}
                    ]                    
                },              
              {text : "样品名称" , dataIndex : 'name', sortable : true, width : 150, align : 'center'},
              {text : "客户名称" , dataIndex : 'custName', sortable : true, width : 150, align : 'center'},              
              {text : "负责员工" , dataIndex : 'rspEmpName', sortable : true, width : 100, align : 'center'},
              {text : "领用员工" , dataIndex : 'lendEmpName', sortable : true, width : 100, align : 'center'},
              {text : "领用日期" , dataIndex : 'lendDate', sortable : true, width : 100, align : 'center'},           
              {text : "包装方式" , dataIndex : 'packDes', sortable : true, width : 150, align : 'center'},
              {text : "样品归属" , dataIndex : 'type', align : 'center',width: 120,
                    renderer: function(data)
                    {
                        if(data == 'KEEP_IN')
                            return '公司留用';
                        else
                            return '归还客户';
                    }
              },
              {text : "备注" , dataIndex : 'notes', sortable : true, flex:1, align : 'center'}
              ]
        });
        
        this.callParent(arguments);
    },
    openDetailsWin : function(id)
    {
             smartOA.util.genWindow({
                    loader: {
                            url: 'basicElem/editProdSample.js',
                            autoLoad: true,
                            scripts:true
                        },
                    width    : 900,
                    height   : 500,
                    maximizable: true,
                    modal: true,
                    layout   : 'fit',
                    resizable: true,
                    initId : id,
                    store : this.store,
                    title : '样品编辑'
                });         
    } 
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var ctgPanel = Ext.create('smartOA.commonClass.TreeListViewPanel',{
            loadUrl : 'basicElem/loadProdCtgTree.action',
            width: 180,
            resizable : true,
            title : '产品类别'
    }); 
    
    var sampleListPanel = Ext.create('smartOA.basicElem.ProdSampleListPanel');
    
    var framePanel = Ext.create('Ext.panel.Panel',
            {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items : [ctgPanel, sampleListPanel]
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
        
        var proxy = sampleListPanel.getStore().getProxy();
        
        Ext.apply(proxy, {
        url : 'basicElem/loadProdSampleByCtg.action',
        extraParams : {'ctgId': data.id}
        });
        
        sampleListPanel.getStore().reload();
    }
    );    

});
//</script>