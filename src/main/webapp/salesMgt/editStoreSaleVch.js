<script type="text/javascript">

Ext.define('smartOA.salesMgt.StoreSaleVchItemModel',{
     extend : 'Ext.data.Model',
    fields: [
         {name: 'mtItemId', type: 'int'},
         {name: 'modelNum'},
         {name: 'subModelNum'},
         {name: 'unit'},
         {name: 'quantity', type: 'float'},
         {name: 'unitPrice',  type: 'float'},
         {name: 'stdUnitPrice',  type: 'float'},
         {name: 'stdUnitPriceInCn',  type: 'float'},
         {name: 'notes'},
         {name: 'mtNum'},
         {name: 'colorModel'},
         {name: 'packageModel'},
         {name: 'ctgName'},
         {name: 'totalPrice',  type: 'float'}                 
    ]         
}  
);

Ext.define('smartOA.salesMgt.editStoreSaleVchPanel',
{
    extend: 'smartOA.commonClass.EditVoucherPanel',
    constructor : function()
    {
        Ext.apply(this, 
        {
            loadUrl: 'salesMgt/loadStoreSaleVch.action', 
            saveUrl:'salesMgt/saveStoreSaleVch.action', 
            updateStateUrl:'salesMgt/updateStateForStoreSaleVch.action',            
            deptRootId: smartOA.csn.getValue('DEPT_SALES_ROOT_ID'),
            auditorGroupId: smartOA.csn.getValue('STORESALE_AUDITOR_GROUP_ID')
        });        
        
        this.callParent(arguments); 
        
        var customerStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadCustByMAForCombo.action',
                extraParams:{'areaId': smartOA.csn.getValue('CUST_AREA_DOMESTIC_ID')},
                reader: {
                    type: 'json',
                    root: 'list'
                }
            } 
        }); 
        
        var customerCombo = new Ext.form.ComboBox({
                name:'entity.customer.id',
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
                margins: '5 0 0 0',
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

         customerCombo.on('select', function(combo, records, eOpts)
         {
                smartOA.util.ajaxRequest(
                {
                    url : 'basicElem/loadCurrencyByCustId.action',
                    params : {'id': records[0].data.id},
                    success : function(r, o)
                    {
                        var obj = Ext.JSON.decode(r.responseText);
                        
                        if(obj.success == true) 
                        {
                            var formPanel = this.up('form');
                            
                            var currency = formPanel.down("[name=entity.currencyName]");
                            var exchangeRate = formPanel.down("[name=entity.exchangeRate]");
                            currency.setValue(obj.data.curName);
                            exchangeRate.setValue(obj.data.exchangeRate);
                        }
                    }
                }, this
                ); 
                
                if(ds.getCount() > 0 && ds.getAt(0).data.mtItemId != '')
                {                 
                    ds.removeAll();
                    ds.insert( 1, new smartOA.salesMgt.StoreSaleVchItemModel());
                }
         });            
        var paymentModeStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url :  'salesMgt/loadPaymentModeForCombo.action',
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        
        
        var paymentModeCombo = new Ext.form.ComboBox({
                name:'entity.paymentMode.id',
                valueField:'id',
                hiddenName:'entity.paymentMode.id',
                displayField:'name',
                fieldLabel: '支付方式',
                editable:false,
                forceSelection:true,
                allowBlank:false,
                triggerAction:'all',
                store:paymentModeStore,
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
                defaultType: 'textfield',
                items : [
                customerCombo,
                paymentModeCombo,
                {
                    xtype: 'datefield',
                    fieldLabel: '结算期限',
                    name: 'entity.paymentDeadLine',
                    flex : 1,
                    margins: '5 0 0 30',
                    format: 'Y-m-d',
                    value : new Date(),
                    editable: false   
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
                defaultType: 'textfield',
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
                    fieldLabel : '汇率',
                    xtype: 'numberfield',
                    allowBlank:false,
                    validator: function(value){ if(value > 0) return true; return "汇率必须大于零";}, 
                    value: 1,
                    name: 'entity.exchangeRate',
                    flex : 1,
                    margins: '5 0 0 30'
                },                
                {
                    xtype: 'numberfield',
                    fieldLabel : '其他费用',
                    value: 0,
                    allowBlank:false,
                    name: 'entity.otherExpense',
                    flex : 1,
                    margins: '5 0 0 30'
                }
                ]           
        });        
 
        var ds = Ext.create('Ext.data.ArrayStore', {
            model : 'smartOA.salesMgt.StoreSaleVchItemModel',
            autoload: false
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
                height : 240,
                title : '单据明细',
                columnLines: true,
                autoScroll : true,
                margins: '10 0 10 0',
                features: [{
                    id: 'summary',
                    ftype: 'summary'                  
                }],                
                columns :[
                {text : '', dataIndex:'mtItemId', hidden: true},
                {xtype: 'rownumberer'},
                {
                    xtype : 'actioncolumn',
                    width : 50,
                    items : [{
                        icon :'images/add.png',
                        tooltip: '增加产品',                      
                        handler : this.addProd,
                        scope: this,
                        isDisabled: function(grid)
                        {
                            if(this.stateAudited == true)
                                return true;       
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
                                store.insert( 1, new smartOA.salesMgt.StoreSaleVchItemModel());
                            }                       
                        }
                    ]                    
                },
                {text : "产品型号" , dataIndex : 'modelNum',  width : 120, align : 'center',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '总计:';
                    }                
                },
                {text : "子型号" , dataIndex : 'subModelNum',  width : 150, align : 'center'},     
                {text : "物料号" , dataIndex : 'mtNum',  width : 120, align : 'center'},
//                {text : "色号" , dataIndex : 'colorModel',  width : 100, align : 'center'},
//                {text : "包装方式" , dataIndex : 'packageModel',  width : 100, align : 'center'},
                {text : "单位" , dataIndex : 'unit',  width : 80, align : 'center'},
                {text : "数量" , dataIndex : 'quantity', value: 1, sortable : true, width : 100, align : 'center',
                    editor: {xtype: 'numberfield',  validator: function(value){ if(value > 0) return true; return "数量必须大于零";}},   
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  + value  : 0);
                    }                     
                },                
                {text : "单价" , dataIndex : 'unitPrice', width : 100, align : 'center',
                 editor: {xtype: 'numberfield',  validator: function(value){ if(value > 0) return true; return "单价必须大于零";}},
                 renderer: moneyFormat
                },
                {text : "合计金额" ,  sortable : true, width : 150, align : 'center',
                    renderer : function(value, metaData, record, rowIdx, colIdx, store, view)
                    {
                        var val = Number(record.get('unitPrice') * record.get('quantity'));
                        return moneyFormat(val);
                    },                   
                    summaryType: function(records)
                    {
                        var total = 0;
                        var i=0;
                        var record;
                        for(; i < records.length; i++)
                        {
                            record = records[i];
                            total += record.get('unitPrice') * record.get('quantity');
                        }
                        
                        return Number(total).toFixed(2);                       
                    },
                    summaryRenderer: moneyFormat
                                   
                }, 
/*                {text : "定价" , dataIndex : 'stdUnitPrice', width : 80, align : 'center',     
                    editor: {xtype: 'numberfield',  validator: function(value){ if(value > 0) return true; return "定价必须大于零";}},
                    renderer:function(value)
                    {
                        var exchangeRate = formPanel.down("[name=entity.exchangeRate]");     
                        var calValue = value/exchangeRate.getValue();
                        
                        return formPanel.moneyFormat(calValue);
                    }
                },  */
                {text : "备注" , dataIndex : 'notes', flex:1, editor: {xtype: 'textfield'}}
                ],
                selModel: {
                    selType: 'cellmodel'
                },
                plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1,
                    pluginId : 'cellEditPlugin'
                })],
                listeners: {               
                    afterrender : function(panel)               
                    {       
                        store = panel.getStore();
                        var count = store.getCount();
                        if(count == 0)
                            store.insert( 1, new smartOA.salesMgt.StoreSaleVchItemModel());
                    } 
                }
        });
        
    },
    convertItem: function(store)
    {
        Ext.define('WHVoucherItemModel',{
            fields: [
                 {name: 'mtItemId', type: 'int'},
                 {name: 'quantity', type: 'float'},
                 {name: 'unitPrice', type: 'float'},
                 {name: 'stdUnitPrice', type:'float'},
                 {name: 'notes'} 
            ]         
        }  
        );        
        
        var result = {failCause: null, list: null};
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
                result.failCause = "单据明细错误， 产品数量必须大于零!";
                return result;
            }    
            
            if(record.unitPrice <= 0)
            {
                result.failCause = "单据明细错误， 产品单价必须大于零!";
                return result;
            } 
            
            var item = new WHVoucherItemModel();    
            item.mtItemId = record.mtItemId;
            item.quantity = record.quantity;
            item.unitPrice = record.unitPrice;
            item.stdUnitPrice = record.unitPrice;
            item.notes = record.notes;
            list.push(item);
        }  
        
        result.list = list;
        return result;
    },
    addProd : function(grid) 
    {                             
        var custId = this.down("[name=entity.customer.id]").getValue();
        
        if(custId == null)
        {
            Ext.Msg.alert('错误', '请先选择客户!');
            return;
        }
        
        var exchangeRate = this.down("[name=entity.exchangeRate]").getValue();
        
        smartOA.util.genWindow({
            loader: {
                    url: 'salesMgt/selStoreSaleProd.js',
                    autoLoad: true,
                    scripts:true
                },
            width    : 1150,
            height   : 400,
            maximizable: true,
            modal: true,
            layout   : 'fit',
            resizable: true,                    
            store : grid.store,
            exchangeRate: exchangeRate,
            title: "产品选择"
        });
     },    
    changeToAuditState: function()
    {
        this.callParent(arguments); 
        
        var formpanel = this;        
        formpanel.down("[name=entity.customer.id]").setReadOnly(true);
        formpanel.down("[name=entity.otherExpense]").setReadOnly(true);   
        formpanel.down("[name=entity.paymentMode.id]").setReadOnly(true); 
        formpanel.down("[name=entity.exchangeRate]").setReadOnly(true); 
        formpanel.down("[name=entity.paymentDeadLine]").setReadOnly(true); 
        
    }      
});

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
 
    var win = Ext.WindowMgr.getActive();
    
    win.setSize({width:1020, height:520});
    win.center();
  
    var formpanel = Ext.create('smartOA.salesMgt.editStoreSaleVchPanel', {'initId':win.initId, 'parentStore':win.store}); 
     
    win.add(formpanel);
    win.doLayout();           
});
</script>