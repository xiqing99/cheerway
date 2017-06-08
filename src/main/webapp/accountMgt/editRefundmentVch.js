//<script type="text/javascript">

Ext.define('smartOA.accountMgt.RefundmentItemModel',{
     extend : 'Ext.data.Model',
    fields: [
         {name: 'id', type: 'int'},
         {name: 'refundPerStockRtId', type: 'int', defaultValue:0},
         {name: 'stockRtVchSeqNum'},
         {name: 'createdDate'},
         {name: 'currencyName'}, 
         {name: 'totalAmount', type:'float'},
         {name: 'amount', type: 'float', defaultValue:0}            
    ]         
});

Ext.define('smartOA.accountMgt.RefundmentVchPanel',
{
    extend : 'smartOA.commonClass.EditVoucherPanel',
    constructor : function()
    {
        Ext.apply(this, {
            loadUrl: 'accountMgt/loadRefundmentVch.action', 
            saveUrl:'accountMgt/saveRefundmentVch.action', 
            updateStateUrl:'accountMgt/updateRefundmentVchState.action',
            deptRootId: smartOA.csn.getValue('DEPT_ACCOUNT_ROOT_ID'),
            auditorGroupId: smartOA.csn.getValue('ACCOUNT_AUDITOR_GROUP_ID')            
        });
        
        this.callParent(arguments); 
        
        var customerStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadCustomerForCombo.action',
                reader: {
                    type: 'json',
                    root: 'list'
                }
            } 
        });
        
        var customerCombo = new Ext.form.ComboBox({
                name:'entity.customer.id',
                submitValue: false,
                valueField:'id',
                displayField:'name',
                fieldLabel: '客户名称',
                emptyText:'请选择客户',
                editable:true,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:customerStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local',
                margins: '0 0 0 0',
                listeners : {  
                   'beforequery':function(e){  
                        var combo = e.combo;    
                        if(!e.forceAll){    
                            var input = e.query;     
                            var regExp = new RegExp(".*" + input + ".*");   
                            combo.store.filterBy(function(record,id){     
                                var text = record.get(combo.displayField);    
                                return regExp.test(text);   
                            });  
                            combo.expand();    
                            return false;  
                        }  
                    }
                }
            });                                  

        var orderStore = Ext.create('Ext.data.Store',
        {
            autoLoad: false,  
            autoSync: false,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'salesMgt/loadSaleVchComboListByState.action',
                extraParams : {'state': 'AUDITED'},
                reader: {
                    type: 'json',
                    root: 'list'
                }
            }
        }); 
        
        var custOrderCombo = new Ext.form.ComboBox({
                name:'entity.saleVch.id',
                valueField:'id',
                hiddenName:'entity.saleVch.id',
                displayField:'name',
                fieldLabel: '订单号',
                emptyText:'请选择订单',
                editable:true,
                allowBlank:false,
                forceSelection:false,
                triggerAction:'all',
                store:orderStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local',
                margins: '0 0 0 30',
                labelAlign: 'left',
                labelStyle: 'font-weight:bold'                
            });              

        customerCombo.on('select', function(combo, records)
        {

            Ext.apply(orderStore.getProxy(), {
                    url : 'salesMgt/loadSaleVchComboListByCustIdAndState.action',
                    extraParams : {'custId': combo.getValue(), 'state': 'AUDITED'}
            });
            
            custOrderCombo.enable();
            orderStore.load();           
            
            smartOA.util.ajaxRequest(
            {
                url : 'basicElem/loadCurrencyByCustId.action',
                params : {'id': combo.getValue()},
                success : function(r, o)
                {
                    var obj = Ext.JSON.decode(r.responseText);
                    
                    if(obj.success == true) 
                    {
                        var formPanel = this.up('form');
                        
                        var currency = formPanel.down("[name=entity.currencyName]");
                        currency.setValue(obj.data.curName);                                                                        
                    }
                }
            }, this
            );              
        });                                            
 
        custOrderCombo.on('select', function(combo, records)
        {
            
            if(ds.getCount() > 0 && ds.getAt(0).data.osVoucherSeqNum != '')
            {
                ds.removeAll();
                ds.insert( 1, new smartOA.accountMgt.RefundmentItemModel());
            }
                                                         
        });             
        
        var ds = Ext.create('Ext.data.ArrayStore', {
            model : 'smartOA.accountMgt.RefundmentItemModel',
            autoLoad : false
        }); 
        
/*        var formPanel = this;
        ds.on("add", function(store, records)
        {
            formPanel.setPaidAmount();
        });

        ds.on("remove", function(store, record)
        {
            formPanel.setPaidAmount();
        });        
*/
        this.insert(3, {
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                customerCombo,
                custOrderCombo,
                {
                    fieldLabel : '结算货币',
                    xtype: 'textfield',
                    name: 'entity.currencyName',
                    readOnly: true,
                    submitValue:false,
                    flex : 1,
                    margins: '0 0 0 30'
                }           
                ]
            });                     
            
        this.insert(4, {
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                    {
                        fieldLabel : '转客户预收款',
                        name: 'entity.custDepositAmount',
                        xtype: 'numberfield',
                        allowBlank: false,
                        minValue: 0,                        
                        labelWidth: 80,
                        value:0,
                        flex : 1,
                        margins: '0 0 0 0'
                    },
                    {
                        fieldLabel : '转订单预收款',
                        name: 'entity.orderDepositAmount',
                        xtype: 'numberfield',
                        allowBlank: false,
                        minValue: 0,                        
                        labelWidth: 80,
                        value:0,
                        flex : 1,
                        margins: '0 0 0 30'
                    },
                    {
                        fieldLabel : '实付金额',
                        name: 'entity.paidAmount',
                        xtype: 'numberfield',
                        allowBlank: false,
                        minValue: 0,                        
                        value:0,
                        flex : 1,
                        margins: '0 0 0 30'
                    }                                  
                ]
            });            
       
        var formPanel = this;

        var moneyFormat = function(value)
        {
            var currencyName = formPanel.down("[name=entity.currencyName]");
          
            if(currencyName.getValue() === '人民币')
            {
                return Ext.util.Format.currency(value, '¥');
            }else
            {
                return Ext.util.Format.usMoney(value);
            }
        };
        
        this.insert(5, {
                xtype: 'gridpanel',
                frame : false,
                store : ds,
                id : 'itemsGrid',
                flex: 7,
                title : '单据明细',
                columnLines: true,
                autoScroll : true,
                margins: '10 0 10 0',
                features: [{
                    id: 'summary',
                    ftype: 'summary'                  
                }],                
                columns :[
                {text : '', dataIndex:'id', hidden: true},
                {text : '', dataIndex:'refundPerStockRtId', hidden: true},
                {xtype: 'rownumberer'},
                {
                    xtype : 'actioncolumn',
                    width : 50,
                    align : 'center',
                    items : [{
                        icon :'images/add.png',
                        tooltip: '增加条目',
                        isDisabled: function(grid)
                        {
                            var formPanel = grid.up('form');
                            if(formPanel.stateAudited == true)
                                return true;       
                        },                         
                        handler : function(grid, rowIndex, colIndex) {    
                            var orderCombo = formPanel.down("[name=entity.saleVch.id]");
                            
                            var orderId = orderCombo.getValue();
                            
                            if(orderId == null)
                            {
                                Ext.Msg.alert('错误', '请先选择客户和订单号!');
                                return;
                            }
                            
                            smartOA.util.genWindow({
                            title: ' 退款选择',    
                            loader: {
                                    url: 'accountMgt/selectRefundableBySalesVch.js',
                                    autoLoad: true,
                                    scripts:true                                   
                                },
                            width    : 900,
                            height   : 400,
                            maximizable: true,
                            modal: true,
                            layout   : 'fit',
                            resizable: true,                    
                            store : grid.store,
                            saleVchId: orderId,
                            loadUrl: 'accountMgt/loadRefundPerStRtListBySaleVch.action'
                        });
                        }},
                        {
                            icon :'images/delete.gif',
                            tooltip: '删除此行',
                            isDisabled: function(grid)
                            {
                                var formPanel = grid.up('form');
                                if(formPanel.stateAudited == true)
                                    return true;       
                            },                             
                            handler : function(grid, rowIndex, colIndex) {
                                var store = grid.store;
                                store.removeAt(rowIndex);
                                if(store.getCount() == 0)
                                store.insert( 1, new smartOA.accountMgt.RefundmentItemModel());
                            }                       
                        }
                    ]                    
                },
                {text : "退货单编号" , dataIndex : 'stockRtVchSeqNum',  width : 150, align : 'center',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '总计:';
                    }                
                },
                {text : "退货日期" , dataIndex : 'createdDate',  width : 150, align : 'center'},
                {text : "应付总金额" , dataIndex : 'totalAmount',  width : 150, align : 'center',
                    renderer:moneyFormat
                },
                {text : "操作金额" , dataIndex : 'amount', sortable : true, width : 150, align : 'center',
                    editor: {xtype: 'numberfield', 
                        validator: function(value){ if(value > 0) return true; return "操作金额必须大于零";}
 /*                       listeners:{
                            change: function(editor, newValue, oldValue)
                            {      
                                var paidField = editor.up('form').down("[name=entity.paidAmount]");
                                paidField.setValue(paidField.getValue() + (newValue - oldValue));
                            }
                        }*/
                        },
                    summaryType: 'sum',
                    summaryRenderer:moneyFormat,
                    renderer:moneyFormat
                },             
                {text : "备注" , dataIndex : 'notes', flex : 1, editor: {xtype: 'textfield'}}
                ],
                selModel: {
                    selType: 'cellmodel'
                },
                plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1,
                    pluginId : 'cellEditPlugin',
                    listeners:{
                        beforeEdit: function(editor)
                        {
                            var formPanel = editor.getCmp().up('form');
                            if(formPanel.stateAudited == true)
                                return false;
                            
                            return true;
                        }
                    }
                })],
                listeners: {               
                    afterrender : function(panel)               
                    {       
                        store = panel.getStore();
                        var count = store.getCount();
                        if(count == 0)
                            store.insert( 1, new smartOA.accountMgt.RefundmentItemModel());
                    } 
                }
        });
    },
    onLoadSuc: function(form, action)
    {
        this.callParent(arguments); 
        
        var formPanel = form.owner;
 
        var custId = formPanel.down("[name=entity.customer.id]").getValue();
        
        var obj = Ext.JSON.decode(action.response.responseText, true);
        var orderId =  Object.getOwnPropertyDescriptor(obj.data,'entity.saleVch.id').value;
        
        var orderCombo = formPanel.down("[name=entity.saleVch.id]");
        var orderStore = orderCombo.getStore();
        
        if(!formPanel.stateAudited)
        {
            Ext.apply(orderStore.getProxy(), {
                url : 'salesMgt/loadSaleVchComboListByCustIdAndState.action',
                extraParams : {'custId': custId, 'state': 'AUDITED'}
            });                               
            
        }else
        {
               Ext.apply(orderStore.getProxy(), {
                    url : 'salesMgt/loadSaleVchComboListByCust.action',
                    extraParams : {'custId': custId}
                });            
        }
        
        orderStore.load({scope: this,
            callback: function(records, operation, success)
            {
                orderCombo.setValue(orderId);
            }
        });                
    },     
    convertItem: function(store)
    {
        var formPanel = this;
        var custDepositAmount = formPanel.down("[name=entity.custDepositAmount]");
        var paidAmount = formPanel.down("[name=entity.paidAmount]");  
        var orderDepositAmount = formPanel.down("[name=entity.orderDepositAmount]");
        var inputValue = paidAmount.getValue() + custDepositAmount.getValue() + orderDepositAmount.getValue();
        
        Ext.define('ItemModel',{
            fields: [
                 {name: 'refundPerStockRtId', type: 'int'},
                 {name: 'amount', type: 'float'}               
            ]         
        }  
        );        
               
        var result = {failCause: null, list: null};
        var list = new Array();
        var amount = 0.0;
        for(var i = 0; i<store.getCount(); i++)
        {
            var record = store.getAt(i).getData();
            if(record.refundPerStockRtId == 0 || record.amount <= 0)
                return null;   
                
            if(record.refundPerStockRtId == 0)
            {
                result.failCause = "单据明细不能为空!"
                return result;
            }
            
            if(record.amount <= 0)
            {
                result.failCause = "操作金额不能为零";
                return result;
            }           
            
            var inputItem = new ItemModel();
            
            inputItem.refundPerStockRtId = record.refundPerStockRtId;
            inputItem.amount = record.amount;

            list.push(inputItem);
            
            amount += record.amount;
        }   
        
        if(amount != inputValue)
        {
            result.failCause = "明细金额与输入付款金额不符!";
            return result;
        }
        
        result.list = list;
        return result;
    },
    changeToAuditState: function()
    {
        this.callParent(arguments); 
        
        var formpanel = this;        
        formpanel.down("[name=entity.customer.id]").setReadOnly(true);
        formpanel.down("[name=entity.saleVch.id]").setReadOnly(true);
        formpanel.down("[name=entity.paidAmount]").setReadOnly(true);
        formpanel.down("[name=entity.custDepositAmount]").setReadOnly(true);
        formpanel.down("[name=entity.orderDepositAmount]").setReadOnly(true);
    }        
});

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
 
    var win = Ext.WindowMgr.getActive();
    win.setSize({width:900, height:540});
    win.center();
  
    var formpanel = Ext.create('smartOA.accountMgt.RefundmentVchPanel', {'initId':win.initId, 'parentStore':win.store}); 
     
    win.add(formpanel);
    win.doLayout();       
     
/*     var formpanel = Ext.create('smartOA.accountMgt.RefundmentVchPanel', 
            {'initId':2, 'parentStore':null 
         }); 
     
     var win = Ext.widget('window',
     {
        closable : true,
        title : '收款单',
        width    : 720,
        height   : 480,
        maximizable: true,
        modal: true,
        layout   : 'fit',
        items :[formpanel],
        resizable: true
     });
     
     win.show();
     win.center();        */
});
//</script>