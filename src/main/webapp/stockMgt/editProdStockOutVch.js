//<script type="text/javascript">

Ext.define('smartOA.stockMgt.EditProdStockOutVchPanel',
{
    extend: 'smartOA.commonClass.EditVoucherPanel',
    constructor : function()
    {
        
        Ext.apply(this, 
        {
            deptRootId: smartOA.csn.getValue('DEPT_STOCK_ROOT_ID'),
            auditorGroupId: smartOA.csn.getValue('PROD_STOCKOUT_AUDITOR_GROUP_ID')
        });
        
        
        this.callParent(arguments); 
        
        var warehouseStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadStoreListForCombo.action',
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
                forceSelection:true,
                triggerAction:'all',
                store:warehouseStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local', 
                margins: '5 0 0 0'
            });                                          
            
        var orderStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,  
            autoSync: true,     
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
                forceSelection:true,
                triggerAction:'all',
                store:orderStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local',
                margins: '5 0 0 30',
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

         custOrderCombo.on('select', function(combo, records, eOpts)
         {
                smartOA.util.ajaxRequest(
                {
                    url : 'salesMgt/loadCustInfoBySaleVchId.action',
                    params : {'id': records[0].data.id},
                    success : function(r, o)
                    {
                        var obj = Ext.JSON.decode(r.responseText);
                        
                        if(obj.success == true) 
                        {
                            var formPanel = this.up('form');
                            
                            var currency = formPanel.down("[name=entity.currencyName]");
                            currency.setValue(obj.data.currencyName);
                            
                            var custName = formPanel.down("[name=entity.custName]");
                            custName.setValue(obj.data.custName);
                        }
                    }
                }, this
                );           
         });             
            
        var accountRspEmpStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadEmpGIByDeptForCombo.action',
                extraParams : {'deptId': smartOA.csn.getValue('DEPT_ACCOUNT_ROOT_ID')},
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var accountRspEmpCombo = new Ext.form.ComboBox({
                name:'entity.accountRspEmp.id',
                valueField:'id',
                hiddenName:'entity.accountRspEmp.id',
                displayField:'name',
                fieldLabel: '财务负责人',
                editable:false,
                forceSelection:true,
                allowBlank:false,
                triggerAction:'all',
                store:accountRspEmpStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local', 
                margins: '5 0 0 30'
            });  
        
        this.insert(3, {       
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 
                {
                    type: 'hbox',
                    align: 'stretch'
                },
                items : [
                warehouseCombo,
                custOrderCombo,
                {
                    fieldLabel : '客户名称',
                    xtype: 'textfield',
                    name: 'entity.custName',
                    readOnly: true,
                    submitValue: false,
                    flex : 1,
                    margins: '5 0 0 30'
                }                
                ]           
        });

        this.insert(4, {       
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 
                {
                    type: 'hbox',
                    align: 'stretch'
                },
                items : [
                {
                    fieldLabel : '结算货币',
                    xtype: 'textfield',
                    name: 'entity.currencyName',
                    readOnly: true,
                    submitValue: false,
                    flex : 1,
                    margins: '5 0 0 0'
                },                
                {
                    xtype: 'numberfield',
                    value: 0,
                    fieldLabel: '其他费用',
                    allowBlank:false,
                    flex:1,
                    name: 'entity.extraExpense',
                    margins: '5 0 0 30'
                },
                accountRspEmpCombo
                ]           
        });        
        
        var currency = this.down("[name=entity.currencyName]");
        this.insert(5, Ext.create('stockMgt.StockVchItemPanel', {currencyField: currency}));
        
        var grid = this.down('grid');
        
        custOrderCombo.on('select', function(combo, newValue)
        {
            grid.reset();
            custOrderCombo.enable();
                                  
        });
        
    },
    convertItem: function(store)
    {
        var result = {failCause: null, list: null};
        
        Ext.define('WHVoucherItemModel',{
            fields: [
                 {name: 'mtItemId', type: 'int'},
                 {name: 'quantity', type: 'float'},
                 {name: 'unitPrice', type: 'float'},
                 {name: 'notes'} 
            ]         
        }  
        );        
        
        var list = new Array();
        for(var i = 0; i<store.getCount(); i++)
        {
            var record = store.getAt(i).getData();  
            
            if(record.mtItemId == 0)
            {
                result.failCause = "单据明细不能为空!"
                return result;
            }
            
            if(record.quantity <= 0)
            {
                result.failCause = "入库数量不能为零";
                return result;
            }
            
            var item = new WHVoucherItemModel();
            item.mtItemId = record.mtItemId;
            item.quantity = record.quantity;
            item.unitPrice = record.unitPrice;
            item.notes = record.notes;
            list.push(item);
        }  
        
        result.list = list;
        return result;
    },
    addProd : function(grid) 
    {  
        var orderCombo = this.down("[name=entity.saleVch.id]");
        
        if(orderCombo.getValue() == null)
        {
            Ext.Msg.alert('提醒', "请先选择订单号!");
            return;
        }   
        
        console.log(orderCombo.getValue());

        smartOA.util.genWindow({
            loader: {
                    url: 'stockMgt/selectProdBySalesVch.js',
                    autoLoad: true,
                    scripts:true
                },
            title: '选择订单内产品',
            width    : 900,
            height   : 420,
            maximizable: true,
            modal: true,
            layout   : 'fit',
            resizable: true,                    
            store : grid.store,
            salesVchId: orderCombo.getValue(),
            loadUrl: 'salesMgt/loadProdListBySaleVchId.action'
        });
     },    
    changeToAuditState: function()
    {
        this.callParent(arguments); 
        
        var formpanel = this;        
        formpanel.down("[name=entity.store.id]").setReadOnly(true);       
        formpanel.down("[name=entity.saleVch.id]").setReadOnly(true);
        formpanel.down("[name=entity.accountRspEmp.id]").setReadOnly(true);
        formpanel.down("[name=entity.extraExpense]").setReadOnly(true);
    },
    print: function()
    {
        var formpanel = this;
        
        var headerArray = [];
        
        var customer = formpanel.down("[name=entity.custName]");
        var createdDate = formpanel.down("[name=entity.approvedTime]");
        var seqNum = formpanel.down("[name=entity.sequenceNum]");
        var order = formpanel.down("[name=entity.saleVch.id]");
        
        headerArray.push({text: customer.getFieldLabel() + "： " + customer.getValue( ), align: 'left'});   
        headerArray.push({text: order.getFieldLabel() + "： " + order.getRawValue( ), align: 'left'});   
        headerArray.push({text: createdDate.getFieldLabel() + "： " + createdDate.getRawValue(), align: 'left'});
        headerArray.push({text: seqNum.getFieldLabel() + "： " + seqNum.getValue(), align: 'right'});
        
        var footArray = [];
        
        var store = formpanel.down("[name=entity.store.id]");
        var rspEmp = formpanel.down("[name=entity.rspEmp.id]");
        var auditEmp = formpanel.down("[name=entity.auditEmp.id]");
        
        footArray.push({text: store.getFieldLabel() + "： " + store.getRawValue( ), align: 'left'});   
        footArray.push({text: rspEmp.getFieldLabel() + "： " + rspEmp.getRawValue( ), align: 'center'});   
        footArray.push({text: auditEmp.getFieldLabel() + "： " + auditEmp.getRawValue( ), align: 'right'});   
        
        var vch = {
            h1Title: '<font size="2">山东祺月童车有限公司</font>',
            h3Title: '<font size="2">出库单</font>',
            header: headerArray,
            foot: footArray
        };
        
        var grid = formpanel.down('grid');
        
        if(grid.getStore().getCount() == 1)
        {
            Ext.ux.grid.VchPrinter.print(grid, grid.getStore().getRange(), vch);
            return;
        }
        
        smartOA.util.genWindow({
            loader: {
                    url: 'stockMgt/selectPrintItems.js',
                    autoLoad: true,
                    scripts:true
                },
            title: '打印条目选择',
            width    : 900,
            height   : 420,
            maximizable: true,
            modal: true,
            layout   : 'fit',
            resizable: true,                    
            store : grid.store,
            vchInfo: vch,
            vchGrid: grid
            
        });        
        
       
    }

});

Ext.onReady(function(){

    Ext.tip.QuickTipManager.init();
     
    Ext.form.Field.prototype.msgTarget = 'side';
     
     var win = Ext.WindowMgr.getActive();
    
    win.setSize({width:920, height:500});
    win.center();
      
    var formpanel = Ext.create('smartOA.stockMgt.EditProdStockOutVchPanel', 
                                {
                                    initId:win.initId, 
                                    parentStore:win.store,
                                    loadUrl:'stockMgt/loadProdOutstockVch.action',
                                    saveUrl: 'stockMgt/saveProdOutstockVch.action',
                                    updateStateUrl: 'stockMgt/updateStateForProdOutstockVch.action'}
                                );          
        
    win.add(formpanel);
    win.doLayout();   
   
/*    var formpanel = Ext.create('smartOA.stockMgt.EditProdStockOutVchPanel', 
                                {
                                    initId:109, 
                                    parentStore:null,
                                    loadUrl:'stockMgt/loadProdOutstockVch.action',
                                    saveUrl: 'stockMgt/saveProdOutstockVch.action',
                                    updateStateUrl: 'stockMgt/updateStateForProdOutstockVch.action'}
                                );          
                                
     var vp = new Ext.Viewport({layout:'fit', items:[formpanel]});
*/
});
//</script>