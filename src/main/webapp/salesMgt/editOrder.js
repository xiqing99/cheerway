<script type="text/javascript">

Ext.define('smartOA.salesMgt.orderItemModel',{
     extend : 'Ext.data.Model',
    fields: [
         {name: 'productId', type: 'int'},
         {name: 'modelNum'},
         {name: 'subModelNum'},
         {name: 'name'},
         {name: 'unit'},
         {name: 'quantity', type: 'float'},
         {name: 'unitPrice',  type: 'float'},
         {name: 'stdUnitPrice',  type: 'float'},
         {name: 'notes'},
         {name: 'colorModel'},
         {name: 'packageModel'},
         {name: 'custModelNum'},
         {name: 'ctgName'},
         {name: 'totalPrice',  type: 'float'},
         {name: 'mtItemId', type: 'int', defaultValue: 0}
    ]         
}  
);

Ext.define('smartOA.salesMgt.editOrderPanel',
{
    extend : 'Ext.form.Panel',
    name: 'editOrderPanel',
    initId : 0,
    parentStore : '',
    stateAudited : false,
    stateCompleted: false,
    constructor : function()
    {     
        var formPanel = this;
        
        var deptStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadDeptSubComboList.action',
                extraParams : {'id': smartOA.csn.getValue('DEPT_SALES_ROOT_ID')},
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }           
        }); 
        
        deptStore.on('load', function(store)
        {
            if(formPanel.initId == 0)
            {
                deptCombo.setValue(mainPanel.userDeptId);
            }
            
        });            
        
        var deptCombo = new Ext.form.ComboBox({
                name:'entity.dept.id',
                valueField:'id',
                hiddenName:'entity.dept.id',
                displayField:'name',
                fieldLabel: '负责部门',
                emptyText:'请选择部门',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                queryMode: 'local', 
                store:deptStore,
                typeAhead: true,
                margins: '5 0 0 0',
                flex : 1
            });        

        var empStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url :  'basicElem/loadEmpGeneInfoForCombo.action',
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 

        empStore.on('load', function(store)
        {
            if(formPanel.initId == 0)
            {
                empCombo.setValue(mainPanel.userEmpId);
            }
            
        });           
        
        deptCombo.on('select', function(combo, records, eOpts)
        {

            Ext.apply(empStore.getProxy(), {
                    url : 'basicElem/loadEmpGIByDeptForCombo.action',
                    extraParams : {'deptId': records[0].data.id}
            });
            
            empCombo.enable();
            empStore.load();
        });
        
        deptCombo.on('change', function(combo, newValue)
        {

            Ext.apply(empStore.getProxy(), {
                    url : 'basicElem/loadEmpGIByDeptForCombo.action',
                    extraParams : {'deptId': newValue}
            });
            
            empCombo.enable();
            empStore.load();
        });                 
        
        var empCombo = new Ext.form.ComboBox({
                name:'entity.rspEmp.id',
                valueField:'id',
                hiddenName:'entity.rspEmp.id',
                displayField:'name',
                fieldLabel: '业务员',
                emptyText:'请选择员工',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:empStore,
                typeAhead: true,
                flex : 1,
                disabled: true,
                queryMode: 'local',
                margins: '5 0 0 20'
            });            

        var auditorStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url :  'basicElem/loadEmpComboListByGroupId.action',
                extraParams:{'id': smartOA.csn.getValue('ORDER_ACOUNT_AUDITOR_GROUP_ID')},
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
                fieldLabel: '财务审核',
                editable:false,
                forceSelection:true,
                allowBlank:false,
                triggerAction:'all',
                store:auditorStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local', 
                margins: '5 0 0 20'
            });                                

        var salesAuditorStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url :  'basicElem/loadEmpComboListByGroupId.action',
                extraParams:{'id': smartOA.csn.getValue('ORDER_AUDITOR_GROUP_ID')},
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var salesAuditorCombo = new Ext.form.ComboBox({
                name:'entity.firstLevelAuditEmp.id',
                valueField:'id',
                hiddenName:'entity.firstLevelAuditEmp.id',
                displayField:'name',
                fieldLabel: '业务审核',
                editable:false,
                forceSelection:true,
                allowBlank:false,
                triggerAction:'all',
                store:salesAuditorStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local', 
                margins: '5 0 0 20'
            });             
            
            
        var merchandiserStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url :  'basicElem/loadEmpGIByDeptForCombo.action',
                extraParams:{'deptId': smartOA.csn.getValue('DEPT_SALES_ROOT_ID')},
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });             
            
        var merchandiserCombo = new Ext.form.ComboBox({
                name:'entity.merchandiser.id',
                valueField:'id',
                hiddenName:'entity.merchandiser.id',
                displayField:'name',
                fieldLabel: '跟单员',
                forceSelection:true,
                allowBlank:true,
                triggerAction:'all',
                store:merchandiserStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local', 
                margins: '5 0 0 20',
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
            
        var customerStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadCustByMAForCombo.action',
                extraParams:{'areaId': smartOA.csn.getValue('CUST_AREA_ABOARD_ID')},
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
                forceSelection:true,
                editable:true,
                allowBlank:false,
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
                            var currency = formPanel.down("[name=entity.currencyName]");
                            var exchangeRate = formPanel.down("[name=entity.exchangeRate]");
                            currency.setValue(obj.data.curName);
                            exchangeRate.setValue(obj.data.exchangeRate);
                        }
                    }
                }, this
                ); 
                
                if(ds.getCount() > 0 && ds.getAt(0).data.productId != '')
                {
                    ds.removeAll();
                    ds.insert( 1, new smartOA.salesMgt.orderItemModel());
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
                margins: '0 0 0 30'
            });            
            
/*        var freightCmpStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url :  'salesMgt/loadFreightCmpForCombo.action',
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var freightCmpCombo = new Ext.form.ComboBox({
                name:'entity.freightCmp.id',
                valueField:'id',
                hiddenName:'entity.freightCmp.id',
                displayField:'name',
                fieldLabel: '货代公司',
                editable:false,
                forceSelection:true,
                triggerAction:'all',
                store:freightCmpStore,
                typeAhead: true,
                queryMode: 'local', 
                flex : 1
//                margins: '0 0 0 40'
            });          

        var shippingCmpStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url :  'salesMgt/loadShippingCmpForCombo.action',
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var shippingCmpCombo = new Ext.form.ComboBox({
                name:'entity.shippingCmp.id',
                valueField:'id',
                hiddenName:'entity.shippingCmp.id',
                displayField:'name',
                fieldLabel: '船务公司',
                editable:false,
                forceSelection:true,
                triggerAction:'all',
                store:shippingCmpStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local', 
                margins: '0 0 0 30'
            });            
*/            
            
/*        var currenyFormat = Ext.util.Format.cnMoney;
        currencyCombo.on('select', function(combo, records, eOpts)
        {
            if(records[0].data.name === '美元')
            {
                currencyFormat = Ext.util.Format.usMoney;
            }else if(records[0].data.name === '人民币')
            {
                currenyFormat = Ext.util.Format.cnMoney;
            }
        });             
*/            
        Ext.form.Field.prototype.msgTarget = 'side';
        
        var ds = Ext.create('Ext.data.ArrayStore', {
            model : 'smartOA.salesMgt.orderItemModel',
//            data: orderItemData,
            autoLoad : false
        });               
        
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
                 
        Ext.apply(this, 
        {
            buttonAlign : 'center',
            frame: true,
            layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
//                bodyPadding: 10,
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
              xtype: 'hidden',
              name: 'entity.state',
              value : 'PROPOSED'
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
                  name: 'entity.createdDate',
                  editable : false,
                  format: 'Y-m-d',
                  value : new Date()
                },
                {
                  flex : 1,
                  fieldLabel: '客户单号',
                  name: 'entity.custOrderNum',
                  margins: '0 0 0 30'       
                },
                 {
                  flex : 1,
                  fieldLabel: '订单编号',
                  name: 'entity.sequenceNum',
                  margins: '0 0 0 30',
                  readOnly: true
                },
                {
                    xtype : 'datefield',
                    fieldLabel : '审核日期',
                    name: 'entity.approvedTime',
                    readOnly : true,
                    format: 'Y-m-d',
                    flex : 1,
                    margins: '0 0 0 30'
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
                paymentModeCombo,
                {
                    xtype: 'datefield',
                    fieldLabel: '交付期限',
                    name: 'entity.deliverDeadLine',
                    flex : 1,
                    margins: '0 0 0 30',
                    format: 'Y-m-d',
                    value : new Date(),
                    editable: false,
                    validator : function(value)
                    {
                        var createdDate = createdDate = formPanel.down("[name=entity.createdDate]").getRawValue();
                        return(value >= createdDate) ? true : '交货期限不能早于订单创建日期';
                    }
                },
                {
                    xtype: 'datefield',
                    fieldLabel: '结算期限',
                    name: 'entity.paymentDeadLine',
                    flex : 1,
                    margins: '0 0 0 30',
                    format: 'Y-m-d',
                    value : new Date(),
                    editable: false   
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
                    fieldLabel : '结算货币',
                    xtype: 'textfield',
                    name: 'entity.currencyName',
                    readOnly: true,
                    submitValue:false,
                    flex : 1,
                    margins: '0 0 0 0'
                },      
                {
                    fieldLabel : '汇率',
                    xtype: 'numberfield',
                    allowBlank:false,
                    validator: function(value){ if(value > 0) return true; return "汇率必须大于零";},                    
                    value: 1,
                    name: 'entity.exchangeRate',
                    flex : 1,
                    margins: '0 0 0 30'
                },                
                {
                    xtype: 'numberfield',
                    fieldLabel : '其他费用',
                    allowBlank:false,
                    value: 0,
                    name: 'entity.otherExpense',
                    flex : 1,
                    margins: '0 0 0 30'
                },
                {
                    xtype: 'numberfield',
                    fieldLabel : '货柜量',
                    allowBlank:false,
                    value: 0,
                    minValue: 0,
                    name: 'entity.containerNum',
                    flex : 1,
                    margins: '0 0 0 30'
                }                
                ]
            },   
/*            {
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                freightCmpCombo,                
                {
                    fieldLabel : '货代费',
                    xtype: 'numberfield',
                    allowBlank:false,
                    value: 0,
                    minValue: 0,
                    name: 'entity.freightCharge',
                    flex : 1,
                    margins: '0 0 0 30'
                },
                shippingCmpCombo,
                {
                    xtype: 'numberfield',
                    fieldLabel : '拖柜费',
                    name: 'entity.transportCharge',
                    value: 0,
                    minValue: 0,
                    allowBlank:false,
                    flex : 1,
                    margins: '0 0 0 30'
                }                
                ]
            },           */ 
            {
                xtype: 'gridpanel',
                frame : false,
                store : ds,
                id : 'itemsGrid',
                flex:9,
                title : '订单明细',
                columnLines: true,
                autoScroll : true,
                margins: '10 0 10 0',
                features: [{
                    id: 'summary',
                    ftype: 'summary'                  
                }],                
                columns :[
                {text : '', dataIndex:'id', hidden: true},
                {text : '', dataIndex:'mtItemId', hidden: true},
                {xtype: 'rownumberer'},
                {
                    xtype : 'actioncolumn',
                    width : 50,
                    items : [{
                        icon :'images/add.png',
                        tooltip: '增加产品',
                       isDisabled: function(grid)
                        {
                            if(formPanel.stateAudited == true)
                                return true;       
                        },                        
                        handler : function(grid, rowIndex, colIndex) {     
                            var custId = formPanel.down("[name=entity.customer.id]").getValue();
                            
                            if(custId == null)
                            {
                                Ext.Msg.alert('错误', '请先选择客户!');
                                return;
                            }
                            
                            smartOA.util.genWindow({
                            title: '产品选择',    
                            loader: {
                                    url: 'basicElem/selectProduct.js',
                                    autoLoad: true,
                                    scripts:true                                   
                                },
                            width    : 1050,
                            height   : 440,
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
                            isDisabled: function(grid)
                            {
                                if(formPanel.stateAudited == true)
                                    return true;       
                            },                            
                            handler : function(grid, rowIndex, colIndex) {
                                
                                var store = grid.store;
                                store.removeAt(rowIndex);
                                if(store.getCount() == 0)
                                {
                                    store.insert( 1, new smartOA.salesMgt.orderItemModel());
                                }
                            }                       
                        }
                    ]                    
                },
                {text : "产品型号" , dataIndex : 'modelNum',  width : 100, align : 'center',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '总计:';
                    }                
                },
                {text : "产品子型号" , dataIndex : 'subModelNum',  width : 100, align : 'center'},             
                {text : "色号" , dataIndex : 'colorModel',  width : 100, align : 'center', editor: {xtype: 'textfield'}},               
                {text : "单位" , dataIndex : 'unit',  width : 50, align : 'center'},
                {text : "数量" , dataIndex : 'quantity', value: 1, sortable : true, width : 90, align : 'center',
                    editor: {xtype: 'numberfield', validator: function(value){ if(value > 0) return true; return "数量必须大于零";}},
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  + value  : 0);
                    }                     
                },                
                {text : "单价" , dataIndex : 'unitPrice', width : 90, align : 'center',
                 editor: {xtype: 'numberfield',  validator: function(value){ if(value > 0) return true; return "数量必须大于零";}},
                 renderer: moneyFormat              
                },                
                {text : "合计金额" ,  sortable : true, width : 100, align : 'center',
                    renderer : function(value, metaData, record, rowIdx, colIdx, store, view)
                    {
                        var val = Number(record.get('unitPrice') * record.get('quantity'));
                        
                        var currencyName = formPanel.down("[name=entity.currencyName]");
                        if(currencyName.getValue() === '人民币')
                        {
                            return Ext.util.Format.currency(val.toFixed(2), '¥');
                        }else
                        {
                            return Ext.util.Format.usMoney(val.toFixed(2));
                        }                        
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
                {text : "定价" , dataIndex : 'stdUnitPrice', width : 90, align : 'center',
                 editor: {xtype: 'numberfield',  validator: function(value){ if(value > 0) return true; return "数量必须大于零";}} ,
                     renderer: moneyFormat              
                },
                {text : "包装方式" , dataIndex : 'packageModel',  width : 150, align : 'center', editor: {xtype: 'textfield'}},
                {text : "客户型号" , dataIndex : 'custModelNum',  width : 100, align : 'center', editor: {xtype: 'textfield'}},
                {text : "备注" , dataIndex : 'notes', width : 200, editor: {xtype: 'textfield'}}
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
                    merchandiserCombo,
                    salesAuditorCombo,
                    auditorCombo
                ]
            }                 
            ],
            tbar : [
            {
                text: '保存订单',
                name: 'saveBtn',
                icon :'images/accept.png',
                iconCls :'add-icon',
                handler: this.save,
                scope: this
           },           
            {
                text: '业务审核',
                name: 'salesAuditBtn',
                tooltip: '审核反审核订单',
                enableToggle: true,
                icon :'images/accept.png',
                iconCls :'add-icon',
                disabled : true,
                handler: this.salesAudit,
                scope: this                
           },
            {
                text: '财务审核',
                name: 'accountAuditBtn',
                icon :'images/accept.png',
                iconCls :'add-icon',
                disabled : true,
                handler: this.accountAudit,
                scope: this                
           },           
           {
                text: '打印单据',
                icon :'images/printer.png',
                iconCls :'add-icon',
                handler: this.print,
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
                text: '完成订单',
                name: 'cmplBtn',
                icon :'images/accept.png',
                iconCls :'add-icon',
                disabled : true,
                handler: this.completeOrder,
                scope: this
           },           
            {
                xtype: 'tbtext',
                text: '未完成订单',
                name: 'stateLabel'
           }]
                    
        });

        this.callParent(arguments); 
        
        var panel = this;
        Ext.getCmp('itemsGrid').getPlugin("cellEditPlugin").on("beforeEdit", function(editor, e)
        {           
            if(e.field == 'quantity' || e.field == 'stdUnitPrice' || e.field == 'unitPrice')
                return true;
                
            if(panel.stateAudited == true)
                return false;
            
            return true;
        }
        );
        
    },  
    save : function(){
        
        var formpanel = this;
        var form =  this.getForm();        
        var grid = this.down('grid');
        
        var gridStore = grid.getStore();
        
        if(gridStore.getCount() == 0)
        {
            Ext.Msg.alert('输入错误', '订单明细不能为空');
            return;
        }
        
        Ext.define('OrderItemModel',{
            fields: [
                 {name: 'productId', type: 'int'},
                 {name: 'mtItemId', type: 'int'},
                 {name: 'quantity', type: 'float'},
                 {name: 'unitPrice',  type: 'float'},
                 {name: 'stdUnitPrice',  type: 'float'},
                 {name: 'colorModel'},
                 {name: 'packageModel'},
                 {name: 'custModelNum'},
                 {name: 'notes'}                
            ]         
        }  
        );        
               
        var list = new Array();
        for(var i = 0; i<gridStore.getCount(); i++)
        {
            var record = gridStore.getAt(i).getData();

            if(record.productId == 0)
            {
                Ext.Msg.alert('输入错误', '单据明细不能为空!');
                return;
            }

            if(!record.quantity > 0)
            {
                Ext.Msg.alert('输入错误', '单据明细错误， 产品数量必须大于零!');
                return;
            }            

            if(!record.unitPrice > 0)
            {
                Ext.Msg.alert('输入错误', '单据明细错误， 产品单价必须大于零!');
                return;
            }              

            if(!record.stdUnitPrice > 0)
            {
                Ext.Msg.alert('输入错误', '单据明细错误， 产品定价价必须大于零!');
                return;
            }              
            
            var inputItem = new OrderItemModel();
            inputItem.mtItemId = record.mtItemId;
            inputItem.productId = record.productId;
            inputItem.quantity = record.quantity;
            inputItem.unitPrice = record.unitPrice;
            inputItem.colorModel = record.colorModel;
            inputItem.packageModel = record.packageModel;
            inputItem.custModelNum = record.custModelNum;
            inputItem.stdUnitPrice = record.stdUnitPrice;
            inputItem.notes = record.notes;

            list.push(inputItem);
        }

        if(form.isValid())
        {
            form.submit({
            url: 'salesMgt/saveOrder.action',
            method: 'POST',
            disabled:true,
            waitMsg: mbLocale.waitingMsg,
            params : {
                'itemListsJson' : Ext.encode(list)
            },
            success: function(form, action) {      

                Ext.Msg.alert('成功', action.result.message);
                if(action.result.id != null)
                {
                    formpanel.down("[name=entity.id]").setValue(action.result.id);
                }

                if(action.result.seqNum != null)
                {
                    formpanel.down("[name=entity.sequenceNum]").setValue(action.result.seqNum);
                }                
                
                formpanel.down('[name=salesAuditBtn]').enable();
                       
                gridStore.commitChanges();
                
                if(formpanel.parentStore != null)
                    formpanel.parentStore.reload();
                    
            },
            failure: function(form, action) {
                Ext.Msg.alert('失败', action.result.message);
            }
        });
        }else
        {
            Ext.Msg.alert('输入错误', '请输入正确内容');
        }
    },
    afterRender : function()
    {
        this.callParent(arguments); 
 
        if(this.initId == 0)
        {
            return;
        }
            
        this.form.trackResetOnLoad = true;    
        this.form.load({
               url : 'salesMgt/loadOrder.action',
               reset: true,
               params:{'id': this.initId},
               success : this.onLoadSuc,
               failure: function(form, action)
               {                
                    Ext.WindowMgr.getActive().close();
                    Ext.Msg.alert('错误', action.result.message);
                                        
               }
            });            
    },
    onLoadSuc: function(form, action)
    {

        var obj = Ext.JSON.decode(action.response.responseText, true);
        
        var gridStore = Ext.getCmp('itemsGrid').getStore();
        
        gridStore.loadData(obj.data.itemLists);
        
        var state =  Object.getOwnPropertyDescriptor(obj.data,'entity.state').value;
        var formpanel = form.owner;
        var cmplBtn = formpanel.down('[name=cmplBtn]');
        var salesAuditBtn = formpanel.down('[name=salesAuditBtn]');
        var stateLable = formpanel.down('[name=stateLabel]');
        
        switch(state)
        {
            case 'PROPOSED':
            {
                salesAuditBtn.enable();
                break;
            }            
            case 'FL_AUDITED':
            {
                formpanel.changeToSalesAuditState();
                break;
            }
            case 'AUDITED':
            {
                formpanel.changeToSalesAuditState();
                formpanel.changeToAccountAuditState();
                break;
            }
            case 'COMPLETED':
            {
                stateLable.setText('已完成订单');
                formpanel.down('[name=saveBtn]').disable();    
                break;
            }            
            case 'CANCELLED':
            {
                stateLable.setText('已取消订单');
                formpanel.disable();
            }
        }      
    },
    salesAudit: function(button, state)
    {
        var formpanel = this;
        
        var id = formpanel.down("[name=entity.id]").value;
        
        if(id == null)
        {
            Ext.Msg.alert("服务器异常", "请重新打开订单");
            Ext.WindowMgr.getActive().close();
            return;
        }
        
        var audited = !formpanel.stateAudited;                   
        var newState = audited? 'FL_AUDITED':'PROPOSED'; 
       
        var id = formpanel.down("[name=entity.id]").value;
        var saveBtn = formpanel.down("[name=saveBtn]");
        var stateField = formpanel.down("[name=entity.state]");
        var stateLable = formpanel.down("[name=stateLabel]");
        var cmplBtn = formpanel.down("[name=cmplBtn]");
        var createdDate = formpanel.down("[name=entity.createdDate]");
        
        Ext.Ajax.request(
        {
            url : 'salesMgt/updateOrderState.action',
            params : {'id': id, 'state': newState},
            success: function(response, opts)
            {
                var obj = Ext.JSON.decode(response.responseText);
                if(obj.success != true)
                {
                    Ext.Msg.alert("错误", obj.message);
                    return;
                }
                
                var text;
                formpanel.stateAudited = audited;
                if(formpanel.stateAudited === true)
                {
                    formpanel.changeToSalesAuditState();
                    text = '单据审核成功';
                    formpanel.down("[name=entity.approvedTime]").setValue(new Date());
                    formpanel.down("[name=entity.state]").setValue('FL_AUDITED');
                }else
                {                                
                    text = '单据反审核成功';
                    formpanel.changeToProposedState();
                }
                Ext.Msg.alert("成功", text);
                
            }
        }, this
        ); 
    },
    changeToSalesAuditState: function()
    {
        var formpanel = this;
        
        var salesAuditBtn = formpanel.down("[name=salesAuditBtn]");
        var accountAuditBtn = formpanel.down('[name=accountAuditBtn]');
        var stateLable = formpanel.down("[name=stateLabel]");  
        
        formpanel.stateAudited = true;
        salesAuditBtn.setText('业务反审核');
        stateLable.setText('业务已审核');
        salesAuditBtn.enable();
        accountAuditBtn.enable();   
        
        formpanel.down("[name=entity.createdDate]").setReadOnly(true); 
        formpanel.down("[name=entity.custOrderNum]").setReadOnly(true);
        formpanel.down("[name=entity.customer.id]").setReadOnly(true);
        formpanel.down("[name=entity.paymentMode.id]").setReadOnly(true);
        formpanel.down("[name=entity.sequenceNum]").setReadOnly(true);
        formpanel.down("[name=entity.firstLevelAuditEmp.id]").setReadOnly(true);
        formpanel.down("[name=entity.rspEmp.id]").setReadOnly(true);
        formpanel.down("[name=entity.dept.id]").setReadOnly(true);                
    },
    changeToProposedState: function()
    {
        var formpanel = this;
        
        var salesAuditBtn = formpanel.down("[name=salesAuditBtn]");
        var accountAuditBtn = formpanel.down('[name=accountAuditBtn]');
        var stateField = formpanel.down("[name=entity.state]");
        var stateLable = formpanel.down("[name=stateLabel]");
        
        formpanel.stateAudited = false;
        salesAuditBtn.setText('业务审核');
        stateField.setValue('PROPOSED');
        stateLable.setText('未审核单据');
        accountAuditBtn.disable();   
        
        formpanel.down("[name=entity.createdDate]").setReadOnly(false); 
        formpanel.down("[name=entity.custOrderNum]").setReadOnly(false);
        formpanel.down("[name=entity.customer.id]").setReadOnly(false);
        formpanel.down("[name=entity.paymentMode.id]").setReadOnly(false);
        formpanel.down("[name=entity.sequenceNum]").setReadOnly(false);
        formpanel.down("[name=entity.firstLevelAuditEmp.id]").setReadOnly(false);
        formpanel.down("[name=entity.rspEmp.id]").setReadOnly(false);
        formpanel.down("[name=entity.dept.id]").setReadOnly(false);                
    },  
    changeToAccountAuditState: function()
    {
        var formpanel = this;
        
        var salesAuditBtn = formpanel.down("[name=salesAuditBtn]");
        var accountAuditBtn = formpanel.down('[name=accountAuditBtn]');
        var stateLable = formpanel.down("[name=stateLabel]");
        var cmplBtn = formpanel.down("[name=cmplBtn]");   
        
        stateLable.setText('财务已审核');
        salesAuditBtn.disable();
        cmplBtn.enable();   
        formpanel.down("[name=entity.auditEmp.id]").setReadOnly(true);
        
        
        accountAuditBtn.setText('取消订单');
             
    },    
    accountAudit: function(button)
    {    
        if(this.down("[name=entity.state]").getValue() != "AUDITED")
        {
            this.auditOrder(this, button);
        }else
        {
            this.cancelOrder(this, button);
        }
    },
    auditOrder: function(formpanel, button)
    {

        var id = formpanel.down("[name=entity.id]").value;
        
        if(id == null)
        {
            Ext.Msg.alert("服务器异常", "请重新打开订单");
            Ext.WindowMgr.getActive().close();
            return;
        }

        var stateLable = formpanel.down("[name=stateLabel]");
        var cmplBtn = formpanel.down("[name=cmplBtn]"); 
        
        var auditFunc = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                Ext.Ajax.request(
                {
                    url : 'salesMgt/updateOrderState.action',
                    params : {'id': id, 'state': 'AUDITED'},
                    success: function(response, opts)
                    {
                        var obj = Ext.JSON.decode(response.responseText);
                        if(obj.success != true)
                        {
                            Ext.Msg.alert("错误", obj.message);
                            return;
                        }
                        
                        Ext.Msg.alert("成功", '财务审核成功!');
                        formpanel.down("[name=saveBtn]").disable();
                        formpanel.down("[name=entity.approvedTime]").value = new Date();
                        formpanel.down("[name=entity.state]").setValue('AUDITED');
                        formpanel.changeToAccountAuditState();
                    }
                }, this
                );                 
            }
        };
        
        Ext.Msg.show(
        {
           title : '提醒',
           msg : '请确认订单中产品定价已编辑保存?',
           buttons : Ext.Msg.YESNO,
           scope : this,
           fn  : auditFunc,
           icon :Ext.MessageBox.QUESTION
        });         
        
    },
    completeOrder: function(button, state)
    {
        var formpanel = this;
        
        if(formpanel.stateAudited != true)
        {
            Ext.Msg.alert("错误", "不能完成未审核订单!");
            return;
        }        
       
        var id = formpanel.down("[name=entity.id]").value;
        
        var complFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                Ext.Ajax.request(
                {
                    url : 'salesMgt/updateOrderState.action',
                    params : {'id': id, 'state': 'COMPLETED'},
                    success: function(response, opts)
                    {
                        var obj = Ext.JSON.decode(response.responseText);
                        if(obj.success != true)
                        {
                            Ext.Msg.alert("错误", "完成订单失败");
                            return;
                        }
                        
                        formpanel.down("[name=entity.state]").setValue('COMPLETED');
                        formpanel.down("[name=saveBtn]").disable();
                        button.disable();
                        formpanel.down("[name=accountAuditBtn]").disable();
                        formpanel.down("[name=stateLabel]").setText('订单已完成');
        
                        Ext.Msg.alert("成功", '订单完成成功!');
                    }
                }, this
                );                
            }
        };
        
        Ext.Msg.show(
        {
           title : '确认完成',
           msg : '订单一旦完成不能撤销',
           buttons : Ext.Msg.YESNO,
           scope : this,
           fn  : complFun,
           icon :Ext.MessageBox.QUESTION
        });          
    },
    cancelOrder: function(formpanel, button)
    {       
        if(formpanel.stateAudited != true)
        {
            Ext.Msg.alert("错误", "财务未审核订单无需取消, 请直接删除订单!");
            return;
        }        
       
        var id = formpanel.down("[name=entity.id]").value;
        
        var cancelFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                Ext.Ajax.request(
                {
                    url : 'salesMgt/updateOrderState.action',
                    params : {'id': id, 'state': 'CANCELLED'},
                    success: function(response, opts)
                    {
                        var obj = Ext.JSON.decode(response.responseText);
                        if(obj.success != true)
                        {
                            Ext.Msg.alert("错误", "取消订单失败");
                            return;
                        }
                        
                        formpanel.down("[name=entity.state]").setValue('CANCLED');
                        formpanel.down("[name=saveBtn]").disable();
                        formpanel.down("[name=cmplBtn]").disable();
                        formpanel.down("[name=accountAuditBtn]").disable();
                        formpanel.down("[name=stateLabel]").setText('订单已取消');
        
                        Ext.Msg.alert("成功", '订单取消成功!');
                    }
                }, this
                );                
            }
        };
        
        Ext.Msg.show(
        {
           title : '确认取消订单',
           msg : '订单一旦取消后不能恢复, 确认取消订单?',
           buttons : Ext.Msg.YESNO,
           scope : this,
           fn  : cancelFun,
           icon :Ext.MessageBox.QUESTION
        });          
    }

});

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
 
    var win = Ext.WindowMgr.getActive();
    
    win.setSize({width:1150, height:550});
    win.center();
  
    var formpanel = Ext.create('smartOA.salesMgt.editOrderPanel', {'initId':win.initId, 'parentStore':win.store}); 
     
    win.add(formpanel);
    win.doLayout();       
        
  
});
</script>