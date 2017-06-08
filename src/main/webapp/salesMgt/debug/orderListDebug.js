//<script type="text/javascript">

Ext.namespace('smartOA.basicElem.framework');


Ext.define('smartOA.salesMgt.orderModel',{
     extend : 'Ext.data.Model',
    fields: [
         {name: 'id', type: 'int'},
         {name: 'orderSeqNum'},
         {name: 'customOrderNum'},
         {name: 'createdTime', type:'date', dateFormat: 'Y-m-d'},
         {name: 'state'},
         {name: 'customerName'},
         {name: 'customerArea'},
         {name: 'salesEmpName'},
         {name: 'currencyName'},         
         {name: 'totalPrice', type: 'float'},
         {name: 'totalPriceInCn', type: 'float'},
         {name: 'deliverDeadLine', type:'date', dateFormat: 'Y-m-d'},
         {name: 'paymentDeadLine', type:'date', dateFormat: 'Y-m-d'}                 
    ]         
}  
);

Ext.define("smartOA.salesMgt.OrderListGridPanel",
{   
    extend : "Ext.grid.Panel",
    mytile : '订单列表',
    constructor : function()
    {  
        var orderData = [[1,'20160504001','5654563', '2016-05-04', '已审核', '迪斯尼','美国','赵四','美元',10000,67500,'2016-07-04','2016-07-04'],
                    [2,'20160504002','5654563', '2016-03-04', '已审核', '迪斯尼','美国','赵四','美元',23847.4,15478.67,'2016-06-04','2016-06-04'],
                    [3,'20160504002','5654563', '2016-03-04', '已审核', '迪斯尼','美国','赵四','人民币',23847.4,23847.4,'2016-06-04','2016-06-04']];            
        
        var endDate = new Date();
        var startDate = new Date;
        
        startDate.setFullYear(endDate.getFullYear() -1, endDate.getMonth(), endDate.getDate());
        
        var myStore = Ext.create('Ext.data.Store', {
            model : 'smartOA.salesMgt.orderModel',
            data: orderData,
            sorters: {property: 'createdTime', direction: 'DESC'}
        });           

        Ext.apply(this, {
        
            title : this.mytile,
            columnLines : true,
            autoScroll:true,
            frame : false,
            store : myStore,           
            columns: [
              {xtype: 'rownumberer'},
              {text : '', dataIndex:'id', hidden: true},
              {text : "订单编号" , dataIndex : 'orderSeqNum', sortable : true, width : 120, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '订单数  :  ' + value;
                    }                 
              },
              {text : "客户订单号" , dataIndex : 'customOrderNum', sortable : true, width : 120, align : 'center'
            
              },
              {text : "订单日期" , dataIndex : 'createdTime', filter:true,
              renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
              {text : "状态" , dataIndex : 'state', sortable : true, width : 80, align : 'center'},
              {text : "客户" , dataIndex : 'customerName', sortable : true, width : 150, align : 'center'},
              {text : "客户地区" , dataIndex : 'customerArea', sortable : true, width : 100, align : 'center'},
              {text : "业务员" , dataIndex : 'salesEmpName', sortable : true, width : 100, align : 'center'},
              {text : "结算货币" , dataIndex : 'currencyName', sortable : true, width : 100, align : 'center'
              },
              {text : "订单总额" , dataIndex : 'totalPrice', sortable : true, width : 100, align : 'center',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }              
              },
              {text : "订单总额(¥)" , dataIndex : 'totalPriceInCn', sortable : true, width : 100, align : 'center',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0);
                    }               
              },              
              {text : "交货期限" , dataIndex : 'deliverDeadLine',renderer: Ext.util.Format.dateRenderer('Y-m-d'), sortable : true, width : 100, align : 'center'},
              {text : "付款期限" , dataIndex : 'paymentDeadLine',renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, flex : true, align : 'center'}
              ],            
            selType: 'rowmodel',
            tbar: [{
                    text:mbLocale.addNewItem,
                    icon :'images/add.png',
                    iconCls :'add-icon',
                    handler: this.addNew,
                    scope: this
               },{
                    text: mbLocale.editItem,
                    icon :'images/application_edit.png',
                    iconCls :'delete-icon',
                    handler: this.edit,
                    scope: this
                },
                {
                    text: mbLocale.deleteItem,
                    icon :'images/cross.png',
                    iconCls :'save-icon',
                    handler: this.delSelected,
                    scope: this
                },
                {
                    text: mbLocale.refreshPage,
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: this.refresh,
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
                '->','->',
                {
                    xtype: 'datefield',
                    fieldLabel: '时间范围 开始',
                    name: 'startdt',
                    format: 'Y-m-d',
                    width: 220,
                    labelWidth: 90,
                    value:startDate
                }, 
                {
                    xtype: 'datefield',
                    fieldLabel: '结束',
                    name: 'enddt',
                    format: 'Y-m-d',
                    value : endDate,
                    width: 170,
                    labelWidth: 40
                },
                {
                    xtype: 'button',
                    text:'加载数据',
                    icon :'images/magnifier.png',
                    iconCls :'save-icon',                    
                    handler: function()
                    {
                        var startDate = this.previousSibling('field[name=startdt]').getValue();
                        var endDate = this.previousSibling('field[name=enddt]').getValue();

                        if(endDate.getTime() < startDate.getTime())
                        {
                            Ext.Msg.alert("请重新选择时间", "  结束日期不能小于开始日期!");
                            return;
                        }
                        
                        var store =  this.up('grid').getStore();
                        store.getProxy().setExtraParam('startDate', Ext.util.Format.date(startDate, 'Y-m-d'));
                        store.getProxy().setExtraParam('endDate', Ext.util.Format.date(endDate, 'Y-m-d'))
                        
                        store.reload();
                    }
                    
                }
                ],
                bbar: new Ext.PagingToolbar(
                {
                    store : myStore,
                    pageSize : 1                    
                }),
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
                    id: 'group',
                    ftype: 'groupingsummary',
                    groupHeaderTpl: '{name}'                 
                },
                {
                    ftype: 'filters',
                    local: true,
                    filters : [
                    {
                        type : 'date',
                        dataIndex : 'createdTime',
                        dateFormat : 'Y-m-d'
                    },
                    {
                        type : 'date',
                        dataIndex : 'deliverDeadLine',
                        dateFormat : 'Y-m-d'
                    },
                    {
                        type : 'date',
                        dataIndex : 'paymentDeadLine',
                        dateFormat : 'Y-m-d'
                    }                    
                    ]
                    
                }                
                ]
        });
        
        console.log("constructor");
        this.callParent(arguments);
    },
    listeners:{
        itemdblclick : function(view, record, item, index, e)
        {
            this.openDetailsWin(record.data.id);            
        }
    },
    openDetailsWin : function(id)
    {
             smartOA.util.genWindow({
                    title    : '产品设置',
                    loader: {
                            url: 'salesMgt/editOrder.js',
                            autoLoad: true,
                            scripts:true
                        },
                    width    : 980,
                    height   : 540,
                    maximizable: true,
                    modal: true,
                    layout   : 'fit',
                    resizable: true,
                    initId : id,
                    store : this.store
                });         
    },
    addNew : function()
    {
        this.openDetailsWin(0);
    },
    edit : function()
    {
        var selection = this.getSelectionModel().getSelection();
        
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要编辑的订单信息");
            return;
        }       

        this.openDetailsWin(selection[0].raw.id);
              
    },
    delSelected : function()
    {
        var selection = this.getSelectionModel().getSelection();
        
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要删除的产品信息");
            return;
        }
        
        var order = selection[0].raw;
        
        if(order.state !== '未审核')
         {
            Ext.Msg.alert("错误", "不能删除已审核订单");
            return;
        }       
        
        var delDeptFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                smartOA.util.ajaxRequest(
                {
                    url : 'salesMgt/delOrder.action',
                    params : {'id': order.id},
                    success : function(r, o)
                    {
                        Ext.Msg.alert("成功", "删除成功");
                        this.store.reload();
                    }
                }, this
                );
                
            }
        };
        
        Ext.Msg.show(
        {
           title : mbLocale.infoMsg,
           msg : mbLocale.delConfirmMsg,
           buttons : Ext.Msg.YESNO,
           scope : this,
           fn  : delDeptFun,
           icon :Ext.MessageBox.QUESTION
        });     
    },
    refresh: function()
    {
        this.store.reload();
    }
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    console.log("onready" +
    		""); 
    
    var orderListPanel = Ext.create('smartOA.salesMgt.OrderListGridPanel',
    {
        layout: 'fit'
    });
    
    var contextMenu =  Ext.create('Ext.menu.Menu', {
            width : 20,
            items: [{                
                    text: mbLocale.editItem,
                    icon :'images/application_edit.png',
                    iconCls :'delete-icon',
                    handler:function(){  
                        orderListPanel.edit();  
                    }  
                
            },{
                    text: mbLocale.deleteItem,
                    icon :'images/cross.png',
                    iconCls :'save-icon',
                    handler:function(){  
                        orderListPanel.delSelected();  
                    }  
            }]
    });
    
    orderListPanel.on('itemcontextmenu', function(view, rec, node, index, e)
    {
        e.stopEvent();
        contextMenu.showAt(e.getXY());
        return false;
    }
    );    
    

    var vp = new Ext.Viewport({layout:'fit', items:[orderListPanel]});
            
/*   if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    }
*/    
 

});
//</script>