
Ext.namespace("smartOA.basicElem");


Ext.define('smartOA.salesMgt.orderItemModel',{
     extend : 'Ext.data.Model',
    fields: [
         {name: 'id', type: 'int'},
         {name: 'modelNum'},
         {name: 'name'},
         {name: 'unit'},
         {name: 'quantity', type: 'float'},
         {name: 'unitPrice',  type: 'float'},
         {name: 'trunkNum',  type: 'float'},
         {name: 'notes'},
         {name: 'taxRate',  type: 'float'},
         {name: 'totalPriceBeforeTax',  type: 'float', convert: function(value, record) {
            var unitPrice = record.get('unitPrice');
            var quantity = record.get('quantity');
            return unitPrice * quantity;
          }},                
         {name: 'tax',  type: 'float', convert: function(value, record) {
            var totalPriceBeforeTax = record.get('totalPriceBeforeTax');
            var taxRate = record.get('taxRate');
            return totalPriceBeforeTax * taxRate % 100;
          }},                 
         {name: 'totalPrice',  type: 'float', convert: function(value, record) {
            var totalPriceBeforeTax = record.get('totalPriceBeforeTax');
            var tax = record.get('tax');
            return totalPriceBeforeTax + tax;
          }}                   
    ]         
}

   
    
);

Ext.define('smartOA.salesMgt.editOrderPanel',
{
    extend : 'Ext.form.Panel',

    constructor : function()
    {                        
        var deptData = {
        lists: [
        {
            id : '1',
            name : '内销部'           
        },
         {
            id : '2',
            name : '外销部'
         }     
        ]};
        
        var deptStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: deptData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var deptCombo = new Ext.form.ComboBox({
                name:'product.category.id',
                valueField:'id',
                hiddenName:'product.category.id',
                displayField:'name',
                fieldLabel: '负责部门',
                emptyText:'请选择部门',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:deptStore,
                typeAhead: true,
                flex : 1
            });        

        var empData = {
        lists: [
        {
            id : '1',
            name : '张三'           
        },
         {
            id : '2',
            name : '李四'
         }     
        ]};
        
        var empStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: empData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var empCombo = new Ext.form.ComboBox({
                name:'product.category.id',
                valueField:'id',
                hiddenName:'product.category.id',
                displayField:'name',
                fieldLabel: '负责员工',
                emptyText:'请选择员工',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:empStore,
                typeAhead: true,
                flex : 1,
                margins: '0 0 0 40'
            });            

        var auditorData = {
        lists: [
        {
            id : '1',
            name : '张三总'           
        },
         {
            id : '2',
            name : '李四总'
         }     
        ]};
        
        var auditorStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: auditorData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var auditorCombo = new Ext.form.ComboBox({
                name:'entity.auditEmp.id',
                valueField:'id',
                hiddenName:'entity.auditEmp.id',
                displayField:'name',
                fieldLabel: '审核人',
                editable:false,
                forceSelection:true,
                triggerAction:'all',
                store:auditorStore,
                typeAhead: true,
                flex : 1,
                margins: '0 0 0 40'
            });             
            
        var stateData = {
        lists: [
        {
            id : '1',
            name : '未审核'           
        },
         {
            id : '2',
            name : '已审核'
         },
         {
            id : '3',
            name : '已结束'
         }
        ]};
        
        var stateStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: stateData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });

        var stateCombo = new Ext.form.ComboBox({
                name:'entity.state',
                valueField:'id',
                hiddenName:'entity.state',
                displayField:'name',
                fieldLabel: '订单状态',
//                emptyText:'未审核',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:stateStore,
                typeAhead: true,
                flex : 1,
                margins: '0 0 0 40',
                listeners :
                {
                    afterRender : function(combo){
                        combo.setValue(1);
                    }
                }
            });               
 
        var customerData = {
        lists: [
        {
            id : '1',
            name : '美达'           
        },
         {
            id : '2',
            name : '亚娜'
         }     
        ]};
        
        var customerStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: customerData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var customerCombo = new Ext.form.ComboBox({
                name:'entity.customer.id',
                valueField:'id',
                hiddenName:'entity.customer.id',
                displayField:'name',
                fieldLabel: '客户名称',
                emptyText:'请选择客户',
                editable:true,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:customerStore,
                typeAhead: true,
                flex : 1
//                margins: '0 0 0 40'
            });             
            
        Ext.form.Field.prototype.msgTarget = 'side';

        var orderItemData = [
        [1,'TRICYCLE001', '三轮车', '辆', 20, 28.5, 2, '', 17],
        [2,'TRICYCLE002', '三轮车二', '辆', 20, 28.5, 0.5, '', 17]
        ];
        var ds = Ext.create('Ext.data.ArrayStore', {
            model : 'smartOA.salesMgt.orderItemModel',
            data: orderItemData
        });        
        
        Ext.apply(this, 
        {
            buttonAlign : 'center',
            layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                bodyPadding: 10,
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 60,
                    labelStyle: 'font-weight:bold'
//                    margins: '5 0 0 5'
                },                
            items: [
            {
              xtype: 'hidden',
              name: 'entity.id'
            },
        	{
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                {
                  flex : 1,
                  xtype : 'datefield',
                  fieldLabel: '订单日期',
                  name: 'entity.createdTime',
                  disabled : true,
                  format: 'Y /m /d ',
                  value : new Date()
                },
                {
                  flex : 1,
                  fieldLabel: '客户单号',
                  name: 'entity.custOrderNum',
                  margins: '0 0 0 40'
                },
                 {
                  flex : 1,
                  fieldLabel: '订单编号',
                  name: 'entity.orderSeqNum',
                  margins: '0 0 0 40'
                }
                ]
            },
            {
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                customerCombo,
                {
                    fieldLabel : '客户区域',
                    name: 'entity.customer.aera.name',
                    flex : 1,
                    margins: '0 0 0 40'
                },
                {
                    fieldLabel : '客户地址',
                    name: 'entity.customer.address',
                    flex : 1,
                    margins: '0 0 0 40'
                }
                ]
            },  
            {
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                {
                  flex : 1,
                  fieldLabel: '结算货币',
                  name: 'entity.currency',
                  allowBlank : false
                },
                {
                    xtype: 'datefield',
                    fieldLabel: '交付期限',
                    name: 'entity.deliverDeadline',
                    minValue: new Date(),
                    flex : 1,
                    margins: '0 0 0 40',
                    format: 'Y /m /d '
                },
                {
                    xtype: 'datefield',
                    fieldLabel: '结算期限',
                    name: 'entity.paymentDeadline',
                    minValue: new Date(),
                    flex : 1,
                    margins: '0 0 0 40',
                    format: 'Y /m /d '
                }                
                ]
            },            
            {
                xtype: 'gridpanel',
                frame : false,
                store : ds,
                height : 300,
                title : '订单明细',
                columnLines: true,
                autoScroll : true,
                margins: '10 0 10 0',
                features: [{
                    id: 'group',
                    ftype: 'groupingsummary',
//                    groupHeaderTpl: '{name}',
                    hideGroupedHeader: true,
                    enableGroupingMenu: false
                }],                
                columns :[
                {text : '', dataIndex:'id', hidden: true},
                {xtype: 'rownumberer'},
                {
                    xtype : 'actioncolumn',
                    width : 50,
                    items : [{
                        icon :'images/add.png',
                        tooltip: '增加产品',
                        handler : function(grid, rowIndex, colIndex) {                            
                            smartOA.util.genWindow({
                            loader: {
                                    url: 'basicElem/debug/selectProductDebug.js',
                                    autoLoad: true,
                                    scripts:true
                                },
                            width    : 800,
                            height   : 340,
                            maximizable: true,
                            modal: true,
                            layout   : 'fit',
                            resizable: true,                    
                            store : grid.store
                        });
                        }},
                        {
                            icon :'images/delete.gif',
                            tooltip: '删除此列',
                            handler : function(grid, rowIndex, colIndex) {
                                var store = grid.store;
                                store.removeAt(rowIndex);
                                if(store.getCount() == 0)
                                store.insert( 1, new smartOA.salesMgt.orderItemModel());
                            }                       
                        }
                    ]                    
                },
                {text : "产品型号" , dataIndex : 'modelNum',  width : 100, align : 'center'},
                {text : "产品名称" , dataIndex : 'name',  width : 100, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ? '(' + value + ' 产品)' : '(1 产品)');
                    }
                },
                {text : "单位" , dataIndex : 'unit',  width : 50, align : 'center'},
                {text : "数量" , dataIndex : 'quantity', sortable : true, width : 60, align : 'center',
                    editor: {xtype: 'numberfield'},
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  + value  : 0);
                    }                     
                },
                {text : "货柜量" , dataIndex : 'trunkNum', sortable : true, width : 60, align : 'center',
                 editor: {xtype: 'numberfield', summaryType: 'sum'}   
                },                
                {text : "单价" , dataIndex : 'unitPrice', width : 80, align : 'center',
                 editor: {xtype: 'numberfield'}   
                },
                {text : "税前总价" , dataIndex : 'totalPriceBeforeTax', sortable : true, width : 80, align : 'center',
                    summaryType: 'sum'},
                {text : "税率%" , dataIndex : 'taxRate', width : 60, align : 'center',
                 editor: {xtype: 'numberfield'}   
                },
                {text : "税额" , dataIndex : 'tax', width : 80, align : 'center', summaryType: 'sum'},
                {text : "合计金额" , dataIndex : 'totalPrice', sortable : true, width : 80, align : 'center',summaryType: 'sum'},
                {text : "备注" , dataIndex : 'notes', flex : 1, editor: {xtype: 'textfield'}}
                ],
                selModel: {
                    selType: 'cellmodel'
                },
                plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })],
                listeners: {               
                    afterrender : function(panel)               
                    {       
                        store = panel.getStore();
                        var count = store.getCount();
                        if(count == 0)
                            store.insert( 1, new smartOA.salesMgt.orderItemModel());
                    } 
                }
            },
            {
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                items : [
                    deptCombo,
                    empCombo,
                    auditorCombo
                ]
            }                         
            ],
                tbar : [
                {
                    text: '审核订单',
                    icon :'images/accept.png',
                    iconCls :'add-icon',
                    handler: this.approve,
                    scope: this
               },
                {
                    text: '完成订单',
                    icon :'images/accept.png',
                    iconCls :'add-icon',
                    handler: this.complete,
                    scope: this
               },  
               {
                    text: '保存',
                    icon :'images/accept.png',
                    iconCls :'add-icon',
                    handler: this.save,
                    scope: this
               },
               {
                    text: '取消',
                    icon :'images/cross.png',
                    iconCls :'add-icon',
                    handler: function(){
                            Ext.WindowMgr.getActive().close();
                            },
                    scope: this
               }               
                ]
        });
        
        this.callParent(arguments); 
    },
    approve : function()
    {
        
    },
    complete : function()
    {
        
    },    
    save : function(){
        var form =  this.getForm();
        if(form.isValid())
        {
            form.submit({
            url: 'basicElem/addNewDept.action',
            method: 'POST',
            disabled:true,
            waitMsg: mbLocale.waitingMsg,
            success: function(form, action) {      
                    Ext.WindowMgr.getActive().close();
                    Ext.getCmp('deptTreePanelId').refresh();
                    Ext.Msg.alert('成功', action.result.message);
            },
            failure: function(form, action) {
                var obj = Ext.util.JSON.decode(action.response.responseText);
                Ext.Msg.alert('失败', obj.message);
            }
        });
        }else
        {
            Ext.Msg.alert('输入错误', '请输入正确内容');
        }
    }
});

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
     
     var formpanel = new smartOA.salesMgt.editOrderPanel();
     
     var win = Ext.widget('window',
     {
        closable : true,
        title : '销售订单',
        width    : 900,
        height   : 540,
        maximizable: true,
        modal: true,
        layout   : 'fit',
        items :[formpanel],
        resizable: true
     });
     
     win.show();
     win.center();     

});
//</script>