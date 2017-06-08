
Ext.namespace("smartOA.basicElem");


Ext.define('smartOA.stockMgt.VoucherItemModel',{
     extend : 'Ext.data.Model',
    fields: [
         {name: 'id', type: 'int'},
         {name: 'modelNum'},
         {name: 'subModelNum'},
         {name: 'name'},
         {name: 'unit'},
         {name: 'quantity', type: 'float'},
         {name: 'notes'}
    ]         
}       
);

Ext.define('smartOA.stockMgt.editWHVoucherPanel',
{
    extend : 'Ext.form.Panel',

    constructor : function()
    {   
        
        var warehouseData = {
        lists: [
        {
            id : '1',
            name : '成品仓库'           
        },
         {
            id : '2',
            name : '原材料仓库'
         }     
        ]};
        
        var warehouseStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: warehouseData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var warehouseCombo = new Ext.form.ComboBox({
                name:'entity.store.id',
                valueField:'id',
                hiddenName:'entity.store.id',
                displayField:'name',
                fieldLabel: '仓库名称',
                emptyText:'请选择仓库',
                editable:true,
                allowBlank:false,
//                forceSelection:true,
                triggerAction:'all',
                store:warehouseStore,
                typeAhead: true,
                flex : 1,
                margins: '4 0 0 0'
            });        
            
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
                name:'entity.rspEmp.dept.id',
                valueField:'id',
//                hiddenName:'entity.rspEmp.dept.id',
                displayField:'name',
                fieldLabel: '负责部门',
                emptyText:'请选择部门',
                editable:false,
                allowBlank:false,
//                forceSelection:true,
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
                name:'entity.rspEmp.id',
                valueField:'id',
                hiddenName:'entity.rspEmp.id',
                displayField:'name',
                fieldLabel: '负责员工',
                emptyText:'请选择员工',
                editable:false,
                allowBlank:false,
//                forceSelection:true,
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
//                name:'entity.auditEmp.id',
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
                        
 
          

            
            
            
        Ext.form.Field.prototype.msgTarget = 'side';

        var voucherItemData = [
        [1,'TRICYCLE001','蓝色', '三轮车', '辆', 20],
        [2,'TRICYCLE002', '红色','三轮车二', '辆', 20]
        ];
        var ds = Ext.create('Ext.data.ArrayStore', {
            model : 'smartOA.stockMgt.VoucherItemModel',
            data: voucherItemData
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
//                flex : 1,
                layout: 
                {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaultType: 'textfield',
                items : [
                {
                  flex : 1,
                  xtype : 'datefield',
                  fieldLabel: '单据日期',
                  name: 'entity.createdDate',
                  disabled : true,
                  format: 'Y /m /d ',
                  value : new Date()
                },
                 {
                  flex : 1,
                  fieldLabel: '单据编号',
                  name: 'entity.sequenceNum',
                  margins: '0 0 0 40'
                }
                ]
            },
            {
                xtype: 'fieldcontainer',
 //               flex : 1,
                layout: 
                {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaultType: 'textfield',
                items : [
                warehouseCombo,
                {
                    fieldLabel : '库位号',
                    name: 'entity.divisionNum',
                    flex : 1,
                    margins: '5 0 0 40'
                }
                ]
            },  
/*            {
                xtype: 'fieldcontainer',
//                flex : 1,
                layout: 
                {
                    type: 'hbox',
                    align: 'stretch'
                },
                items : [
                customerCombo,
                custOrderCombo
                ]
            }, */
            {
                xtype: 'gridpanel',
                frame : false,
                store : ds,
                height : 300,
                flex: 10,
                title : '订单明细',
                columnLines: true,
                autoScroll : true,
                margins: '10 0 10 0',    
                stripeRows: true,
                                features: [{
                    id: 'summary',
                    ftype: 'summary'                  
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
                {text : "产品型号" , dataIndex : 'modelNum',  width : 100, align : 'center',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '总计:';
                    }                
                },
                {text : "产品色号" , dataIndex : 'subModelNum',  width : 80, align : 'center'},
                {text : "产品名称" , dataIndex : 'name',  width : 100, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '产品数  :  ' + value;
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
                layout: 
                {
                    type: 'hbox',
                    align: 'stretch'
                },
                items : [
                    deptCombo,
                    empCombo,
                    auditorCombo
                ]
            }                         
            ],
                    tbar : [{
                    text: '审核' + '单据',
                    name: 'auditBtn',
                    tooltip: '审核反审核单据',
                    enableToggle: true,
                    icon :'images/accept.png',
                    iconCls :'add-icon',
                    handler: function(button, state)
                    {
                        var formpanel = this.up('form');
                        
                        var audited = !formpanel.stateAudited;                   
                        var newState = audited? 'AUDITED':'PROPOSED'; 
                       
                        var id = formpanel.down("[name=entity.id]").value;
                        var saveBtn = formpanel.down("[name=saveBtn]");
                        var stateField = formpanel.down("[name=entity.state]");
                        
                        Ext.Ajax.request(
                        {
                            url : 'salesMgt/updateOrderState.action',
                            params : {'id': id, 'newState': newState},
                            success: function(response, opts)
                            {
                                var obj = Ext.JSON.decode(response.responseText);
                                if(obj.success != true)
                                {
                                    Ext.Msg.alert("服务器异常", "单据审核/反审核失败");
                                    return;
                                }
                                var text;
                                formpanel.stateAudited = audited;
                                if(formpanel.stateAudited === true)
                                {
                                    button.setText('反审核');
                                    stateField.value = '已审核';
                                    saveBtn.disable();
                                    text = '单据审核成功';
                                }else
                                {                                
                                    button.setText('审核');
                                    stateField.value = '未审核';   
                                    saveBtn.enable();
                                    text = '单据反审核成功';
                                }
                                Ext.Msg.alert("成功", text);
                            }
                        }, this
                        ); 
                    }
                    
               },
               {
                    text: '保存',
                    name: 'saveBtn',
                    icon :'images/accept.png',
                    iconCls :'add-icon',
                    handler: this.save,
                    scope: this
               },
               {
                    text: '退出',
                    icon :'images/cross.png',
                    iconCls :'add-icon',
                    handler: function(){
                            Ext.WindowMgr.getActive().close();
                            },
                    scope: this
               },
               '->',
                {
                    xtype: 'tbtext',
                    text: '未审核单据',
                    name: 'complete'
               }]
        });
        
        this.callParent(arguments); 
    },
    onrender : function(panel, ept)
    {
        
        
        this.callParent(arguments); 
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
     
     var formpanel = new smartOA.stockMgt.editWHVoucherPanel();

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
//                hiddenName:'entity.customer.id',
                displayField:'name',
                fieldLabel: '客户名称',
                emptyText:'请选择客户',
                editable:true,
                allowBlank:false,
//                forceSelection:true,
                triggerAction:'all',
                store:customerStore,
                typeAhead: true,
                flex : 1,
                margins: '5 0 0 0',
                    labelAlign: 'left',
                    labelWidth: 60,
                    labelStyle: 'font-weight:bold'                
            });               

        var orderData = {
        lists: [
        {
            id : '1',
            name : 'OR20160430'           
        },
         {
            id : '2',
            name : 'OR20160230'
         }     
        ]};
        
        var orderStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: orderData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var custOrderCombo = new Ext.form.ComboBox({
                name:'entity.custOrder.id',
                valueField:'id',
                hiddenName:'entity.custOrder.id',
                displayField:'name',
                fieldLabel: '订单号',
                emptyText:'请选择订单',
                editable:true,
                allowBlank:false,
//                forceSelection:true,
                triggerAction:'all',
                store:orderStore,
                typeAhead: true,
                flex : 1,
                margins: '5 0 0 40',
                    labelAlign: 'left',
                    labelWidth: 60,
                    labelStyle: 'font-weight:bold'                
            });   
     
     var container = new Ext.form.FieldContainer( {
            layout: 
            {
                type: 'hbox',
                align: 'stretch'
            },
            items : [
                customerCombo, custOrderCombo]});
    
        
        formpanel.items.insert(3,container);
        formpanel.doLayout();

        
        
     var win = Ext.widget('window',
     {
        closable : true,
        title : '入库单',
        width    : 650,
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