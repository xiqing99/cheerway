//<script type="text/javascript">

Ext.define("smartOA.basicElem.CustomerGridPanel",
{   
   extend : "smartOA.commonClass.EditListViewGridPanel",
   title : '客户信息',
    constructor : function()
    {                                       
        Ext.define('CustomerInfo', {
             extend: 'Ext.data.Model',
             fields: [
                 {name: 'entityId', type: 'int'},
                 {name: 'name', type: 'string'},
                 {name: 'fullName', type: 'string'},
                 {name: 'email',  type: 'string'},
                 {name: 'description',  type: 'string'},
                 {name: 'area',  type: 'string'},
                 {name: 'currencyName'},
                 {name: 'priority',  type: 'string'},
                 {name: 'address',  type: 'string'},
                 {name: 'credit',  type: 'string'},
                 {name: 'respDept',  type: 'string'},
                 {name: 'respEmp',  type: 'string'},
                 {name: 'phone',  type: 'string'},
                 {name: 'fax',  type: 'string'},
                 {name: 'startDate',  type: 'date'},
                 {name: 'sortIndex'},
                 {name: 'disabled', type:'boolean'}
             ]
         }); 
         
        Ext.apply(this, {
            dataModel: 'CustomerInfo',
            loadUrl: 'basicElem/loadAllCustomer.action',
            delUrl : 'basicElem/delCustomer.action',
            loadDisabledUrl: 'basicElem/loadDisabledCustomer.action',
            flex:1,
            searchField: 'name',
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'entityId', hidden: true},
              {text : "客户名称" , dataIndex : 'name', sortable : true,width : 200, align : 'center'},
              {text : "搜索码" , dataIndex : 'sortIndex', sortable : true,width : 120, align : 'center'},
              {text : "所属区域" , dataIndex : 'area', sortable : true, width : 150, align : 'center'},
              {text : "结算货币" , dataIndex : 'currencyName', sortable : true,  width : 100, align : 'center'},                          
              {text : "负责员工" , dataIndex : 'respEmp', sortable : true, width : 100,  align : 'center'},
              {text : "公司名称" , dataIndex : 'fullName', sortable : true,width : 220, align : 'center'},
              {text : "公司电话" , dataIndex : 'phone', sortable : true, width : 150, align : 'center'},
              {text : "公司传真" , dataIndex : 'fax', sortable : true, width : 150, align : 'center'},
              {text : "公司邮箱" , dataIndex : 'email', sortable : true, width : 150, align : 'center'},
              {text : "公司地址" , dataIndex : 'address', sortable : true,  align : 'center',width: 200},
              {text : "客户级别" , dataIndex : 'priority', sortable : true, width : 150, align : 'center'},  
              {text : "停用" , dataIndex : 'disabled', sortable : true, align : 'center', width: 50,
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
                            url: 'basicElem/editCustomer.js',
                            autoLoad: true,
                            scripts:true
                        },
                    width    : 880,
                    height   : 480,
                    maximizable: true,
                    modal: true,
                    layout   : 'fit',
                    resizable: true,
                    initId : id,
                    store : this.store,
                    title : '客户编辑'
                });         
    }    
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';

    var areaPanel = Ext.create('js-lib.myapp.ux.EditTreeViewPanel',{
            loadUrl : 'basicElem/loadMarketAreaTree.action',
            editJs : 'basicElem/editMarketArea.js',
            delUrl : 'basicElem/delMarketArea.action',
            itemName : '客户区域',
            width: 200,
            resizable : true,
            title : '客户区域'
    });    
    
    var custPanel = Ext.create('smartOA.basicElem.CustomerGridPanel');

    areaPanel.on('itemclick', function(object,record)
    {
        var data = record.getData();
        
        var proxy = custPanel.getStore().getProxy();
        
        Ext.apply(proxy, {
        url : 'basicElem/loadCustomerByArea.action',
        extraParams : {'areaId': data.id}
        });
        
        custPanel.getStore().reload();
    }
    );  

    var framePanel = Ext.create('Ext.panel.Panel',
            {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items : [areaPanel, custPanel]
            });    
    
    if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    }
});
//</script>