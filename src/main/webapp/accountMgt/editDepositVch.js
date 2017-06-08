//<script type="text/javascript">

Ext.define('smartOA.accountMgt.DepositItemModel',{
     extend : 'Ext.data.Model',
    fields: [
         {name: 'saleVchId', type: 'int', defaultValue: -1},
         {name: 'saleVchSeqNum'},
         {name: 'totalAmount', type:'float'},
         {name: 'auditedDate'},
         {name: 'amount', type: 'float'}            
    ]         
});

Ext.define('smartOA.accountMgt.DepositVoucherPanel',
{
    extend : 'smartOA.commonClass.EditVoucherPanel',
    constructor : function()
    {
        Ext.apply(this, {
            loadUrl: 'accountMgt/loadDepositVoucher.action', 
            saveUrl:'accountMgt/saveDepositVoucher.action', 
            updateStateUrl:'accountMgt/updateDepositVoucherState.action',
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
                flex : 1,
                queryMode: 'local',
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
//                margins: '0 0 0 40'
            });                                         
        
        customerCombo.on('select', function(combo, records)    
        {
            
            if(ds.getCount() > 0 && ds.getAt(0).data.saleVchId != 0)
            {   
                ds.removeAll();
                ds.insert( 1, new smartOA.accountMgt.DepositItemModel());
            }
            
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
                                        
        Ext.form.Field.prototype.msgTarget = 'side';
   
        var ds = Ext.create('Ext.data.ArrayStore', {
            model : 'smartOA.accountMgt.DepositItemModel',
            autoLoad : false
        }); 
        
        this.insert(3, {
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                customerCombo,
                {
                    fieldLabel : '结算货币',
                    xtype: 'textfield',
                    name: 'entity.currencyName',
                    readOnly: true,
                    submitValue:false,
                    flex : 1,
                    margins: '0 0 0 30'
                },
                {
                    fieldLabel : '客户预收款',
                    name: 'entity.custDepositAmount',
                    xtype: 'numberfield',
                    allowBlank: false,
                    value:0,
                    flex : 1,
                    margins: '0 0 0 30',
                    minValue:0
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
        
        this.insert(4, {
                xtype: 'gridpanel',
                frame : false,
                store : ds,
                flex: 8,
                title : '订单预收款明细',
                columnLines: true,
                autoScroll : true,
                margins: '10 0 10 0',
                features: [{
                    id: 'summary',
                    ftype: 'summary'                  
                }],                
                columns :[
                {text : '', dataIndex:'saleVchId', hidden: true},
                {xtype: 'rownumberer'},
                {
                    xtype : 'actioncolumn',
                    width : 50,
                    align : 'center',
                    items : [{
                        icon :'images/add.png',
                        tooltip: '增加订单条目',
                        isDisabled: function(grid)
                        {
                            var formPanel = grid.up('form');
                            if(formPanel.stateAudited == true)
                                return true;       
                        },                            
                        handler : function(grid, rowIndex, colIndex) {    
                            var customerCombo = formPanel.down("[name=entity.customer.id]");
                            
                            var custId = customerCombo.getValue();
                            
                            if(custId == null)
                            {
                                Ext.Msg.alert('错误', '请先选择客户');
                                return;
                            }
                            
                            smartOA.util.genWindow({
                            title: ' 订单选择',    
                            loader: {
                                    url: 'accountMgt/selectSalesVch.js',
                                    autoLoad: true,
                                    scripts:true                                   
                                },
                            width    : 800,
                            height   : 340,
                            maximizable: true,
                            modal: true,
                            layout   : 'fit',
                            resizable: true,                    
                            store : grid.store,
                            custId: custId
                        });
                        }},
                        {
                            icon :'images/delete.gif',
                            tooltip: '删除此列',
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
                                store.insert( 1, new smartOA.accountMgt.DepositItemModel());
                            }                       
                        }
                    ]                    
                },
                {text : "销售单据编号" , dataIndex : 'saleVchSeqNum',  width : 150, align : 'center',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '总计:';
                    }                
                },
              {text : "审核日期" , dataIndex : 'auditedDate', sortable : true, width : 160, align : 'center'},
              {text : "总金额" , dataIndex : 'totalAmount',  width : 160, align : 'center', renderer:moneyFormat},
              {text : "操作金额" , dataIndex : 'amount', sortable : true, width : 150, align : 'center',
                    editor: {xtype: 'numberfield', validator: function(value){ if(value > 0) return true; return "金额必须大于零";}},
                    summaryType: 'sum',
                    summaryRenderer: moneyFormat,
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
                            store.insert( 1, new smartOA.accountMgt.DepositItemModel());
                    } 
                }
        });
    },
    convertItem: function(store)
    {      
        var result = {failCause: null, list: null};
        
        var list = new Array();
        
        Ext.define('ItemModel',{
            fields: [
                 {name: 'saleVchId', type: 'int'},
                 {name: 'amount', type: 'float'}
            ]         
        }  
        );        
               
        var list = new Array();
        
        if(store.getCount() == 1 && store.getAt(0).getData().saleVchId == -1)
        {
            var custDeposit = this.down("[name=entity.custDepositAmount]");
            if(custDeposit.getValue() <= 0)
            {
                result.failCause = "客户和订单预收款数额不能同时为零!";
            }    
            
            return result;
        }
        
        for(var i = 0; i<store.getCount(); i++)
        {
            var record = store.getAt(i).getData();
            if( record.amount <= 0)
            {
                result.failCause = "订单预付款金额不能为零!";
                return result;
            }
                        
            var inputItem = new ItemModel();
            
            inputItem.saleVchId = record.saleVchId;
            inputItem.amount = record.amount;

            list.push(inputItem);
        }   
        
        result.list = list;
        return result;
    },
    changeToAuditState: function()
    {
        this.callParent(arguments); 
        
        var formpanel = this;        
        formpanel.down("[name=entity.customer.id]").setReadOnly(true);
        formpanel.down("[name=entity.currencyName]").setReadOnly(true);
        formpanel.down("[name=entity.custDepositAmount]").setReadOnly(true);
    }        
});

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
 
    var win = Ext.WindowMgr.getActive();
    
    win.setSize({width:900, height:500});
    win.center();
  
    var formpanel = Ext.create('smartOA.accountMgt.DepositVoucherPanel', {'initId':win.initId, 'parentStore':win.store}); 
     
    win.add(formpanel);
    win.doLayout();       
      
/*     var formpanel = Ext.create('smartOA.accountMgt.DepositVoucherPanel', 
            {'initId':6, 'parentStore':null 
         }); 
     
     var win = Ext.widget('window',
     {
        closable : true,
        title : '预收款单',
        width    : 680,
        height   : 460,
        maximizable: true,
        modal: true,
        layout   : 'fit',
        items :[formpanel],
        resizable: true
     });
     
     win.show();
     win.center();       */
});
//</script>