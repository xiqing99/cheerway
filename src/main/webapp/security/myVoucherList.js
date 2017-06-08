//<script type="text/javascript">


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    Ext.define("VoucherListView",
    {   
        extend : "Ext.grid.Panel",
        title: '单据列表',
        editUrl: '',
        loadUrl: '',
        editTitle: '',
        flex:1,
        constructor : function()
        {                                    
            Ext.define('VoucherInfo', {
                 extend: 'Ext.data.Model',
                 fields: [
                     {name: 'voucherId', type: 'int'},
                     {name: 'sequenceNum'},
                     {name: 'state'},
                     {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
                     {name: 'approvedDate', type:'date', dateFormat: 'Y-m-d'},
                     {name: 'notes'},
                     {name: 'rspEmpName'},
                     {name: 'auditEmpName'}
                 ]
             });        
            
             var myStore = Ext.create('Ext.data.ArrayStore', {
                   model : 'VoucherInfo', 
                   proxy: {
                        type: 'ajax',
                        url : this.loadUrl,
                        reader: {
                            type: 'json'
                        }
                    },                    
                    autoLoad : false,
                    autoSync: false
                });  

            myStore.on('load', function(store, records, successful, eOpts)
            {
                console.log(records.length);
                
                if(records.length == 0)
                {
                    Ext.Msg.alert("加载成功", '没有待处理的单据!');
                }
            }
            );                
                
            Ext.apply(this, {      
                store: myStore,
                autoScroll:true,
                frame : false, 
                columnLines : true,
                columns: [
                  {xtype: 'rownumberer'},
                  {text : '', dataIndex:'voucherId', hidden: true},
                  {text : "单据编号" , dataIndex : 'sequenceNum', sortable : true, width : 150, align : 'center'
                  },
                  {text : "单据状态" , dataIndex : 'state', sortable : true, width : 150, align : 'center',
                    renderer:function(data)
                    {
                        switch (data)
                        {
                            case 'PROPOSED':
                                return '未审核';
                            case 'AUDITED':
                                return '已审核';
                            case 'COMPLETED':
                                return '已完成';
                            case 'FL_AUDITED':
                                return '财务待审核';                                
                        }                        
                    }
                  },
                  {text : "单据生成日期" , dataIndex : 'createdDate', filter:true,
                  renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 150, align : 'center'},
                  {text : "负责人" , dataIndex : 'rspEmpName', sortable : true, width : 150, align : 'center'},
                  {text : "审核人" , dataIndex : 'auditEmpName', sortable : true, width : 150, align : 'center'},
                  {text : "审核日期" , dataIndex : 'approvedDate',
                  renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 150, align : 'center'},
                  {text : "备注" , dataIndex : 'notes', sortable : true, flex:1,align : 'center'}
                  ],            
                selType: 'rowmodel'
            });
            
            this.callParent(arguments);
        }
    });

    
    Ext.define('MenuTreePanel',
    {
        extend : 'Ext.TreePanel',
        title: '我的待处理单据',
        width: 200,
        constructor : function()
        {   
            Ext.define('VoucherMenu', {
                 extend: 'Ext.data.NodeInterface',
                 fields: [
                     {name: 'loadUrl'},
                     {name: 'editUrl'}
                 ]
             }); 
       
            var mystore = Ext.create('Ext.data.TreeStore',
            {
                autoLoad: true,  
                model: 'VoucherMenu',
                proxy: {
                    type: 'ajax',
                    url : 'security/loadVchListMenu.action',
                    reader: {
                        type: 'json',
                        root : 'Children'
                    }
                },
                root: {
                text : 'allModulesRoot',        
                expanded: true
               } 
            });       
        
            Ext.apply(this,
            {
                rootVisible:false,
                autoScroll:true,
                resizable: true,
                store : mystore ,
                tbar: [
                    {
                        text: mbLocale.refreshPage,
                        icon :'images/arrow_refresh.png',
                        iconCls :'save-icon',
                        handler: function()
                        {
                            mystore.reload();
                        },
                        scope: this
                    }
                    ] 
            });
       
            this.callParent(arguments);
        }
    });    

    
    var menuPanel = Ext.create('MenuTreePanel');    
    
    var voucherListPanel = Ext.create('VoucherListView');
    
    var framePanel = Ext.create('Ext.panel.Panel',
            {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items : [menuPanel, voucherListPanel]
            });    

    menuPanel.on('itemclick', function(object,record)
    {
        var data = record.raw;        
        
        if(data.leaf == false)
            return;
        
        voucherListPanel.editUrl = data.editUrl;
        voucherListPanel.editTitle = data.text;
        
        var proxy = voucherListPanel.getStore().getProxy();
        
        Ext.apply(proxy, {
            url : data.loadUrl
        });
        
        voucherListPanel.getStore().reload();
        
    }
    );    
    
    voucherListPanel.on('itemdblclick', function(view, record, item, index, e)
    {
        var voucherId = record.data.voucherId;
             
         smartOA.util.genWindow({
                title    : voucherListPanel.editTitle,
                loader: {
                        url: voucherListPanel.editUrl,
                        autoLoad: true,
                        scripts:true
                    },
                constrain: true,
                initId : voucherId
            });              
    
    });
    
//    var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
     
   if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    } 

});
//</script>