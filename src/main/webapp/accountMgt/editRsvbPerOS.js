//<script type="text/javascript">

Ext.define('smartOA.accountMgt.RsvbPerOSVoucherPanel',
{
    extend : 'Ext.form.Panel',
    constructor : function()
    {
        var empStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url :  'basicElem/loadEmpGenInfoByDept.action',
                reader: {
                    type: 'json',
                    root: 'lists'
                },
                extraParams :{'deptId': smartOA.csn.getValue('DEPT_ACCOUNT_ROOT_ID')}               
            }
        }); 
        
        var empCombo = new Ext.form.ComboBox({
                name:'entity.accountEmp.id',
                store:empStore,
                valueField:'id',
                hiddenName:'entity.accountEmp.id',
                displayField:'name',
                fieldLabel: '财务负责人',
                emptyText:'请选择员工',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:empStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local',
                margins: '0 0 0 30'
            });                                  
                                        
        Ext.form.Field.prototype.msgTarget = 'side';
   
        Ext.apply(this, 
        {
            buttonAlign : 'center',
            frame: true,
            layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'left',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
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
                defaultType: 'displayfield',
                items : [
                {
                    fieldLabel : '客户名称',
                    name: 'custName',
                    readOnly  : true,
                    submitValue: false,
                    flex : 1,
                    margins: '5 0 0 30'
                },                
                {
                    fieldLabel : '订单号',
                    name: 'saleVchSeqNum',
                    readOnly  : true,
                    submitValue: false,
                    flex : 1,
                    margins: '5 0 0 30'
                },
                {                 
                  flex : 1,
                  fieldLabel: '出库单号',
                  name: 'osVoucherSeqNum',
                  readOnly  : true,
                  submitValue: false,
                  margins: '5 0 0 30'
                }                
                ]
            },            
            {
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                defaultType: 'displayfield',
                items : [
                {                 
                  flex : 1,
                  fieldLabel: '发货日期',
                  name: 'createdDate',
                  readOnly :true,
                  submitValue: false,
                   margins: '0 0 0 30'
                },
                {
                    fieldLabel : '付款方式',
                    name: 'saleVchPayMode',
                    readOnly  : true,
                    submitValue: false,
                    flex : 1,
                    margins: '5 0 0 30'
                },
                {
                    xtype: 'datefield',
                    fieldLabel: '付款期限',
                    allowBlank:false,
                    name: 'entity.deadlineDate',
                    flex : 1,
                    margins: '5 0 0 30',
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
                defaultType: 'displayfield',
                items : [
                {
                    fieldLabel : '订单负责人',
                    name: 'saleVchRspEmpName',
                    flex : 1,
                    margins: '0 0 0 30'
                },                
                {                 
                  flex : 1,
                  fieldLabel: '结算货币',
                  name: 'currencyName',
                  readOnly :true,
                  submitValue: false,
                  margins: '5 0 0 30'
                },
                {
                    fieldLabel : '汇率',
                    name: 'entity.exchangeRate',
                    xtype: 'numberfield',
                    allowBlank:false,
                    validator: function(value){ if(value > 0) return true; return "汇率必须大于零";},
                    flex : 1,
                    margins: '5 0 0 30'
                }
                ]
            },
            {
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                defaultType: 'displayfield',
                items : [
                {                 
                  flex : 1,
                  fieldLabel: '应收总额',
                  name: 'totalAmount',
                  readOnly :true,
                  submitValue: false,
                   margins: '0 0 0 30'
                },
                {
                    fieldLabel : '剩余应收',
                    name: 'remainedAmount',
                    readOnly  : true,
                    submitValue: false,
                    flex : 1,
                    margins: '5 0 0 30'
                },
                empCombo            
                ]
            },            
            {
                xtype: 'textfield',
                fieldLabel: '备注',
                flex :1,
                name: 'entity.notes',
                margins: '5 0 0 0'
            }            
            ],
            tbar : [
            {
                text: '保存',
                name: 'saveBtn',
                icon :'images/accept.png',
                iconCls :'add-icon',
                handler: this.save,
                scope: this
            },   
            {
                text: '收款',
                name: 'saveBtn',
                icon :'images/application_edit.png',
                iconCls :'add-icon',
                handler: this.editReceipt,
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
            }]
                    
        });

        this.callParent(arguments); 
        
        this.getForm().load({
               url : "accountMgt/loadRsvbPerOSVoucher.action",
               params:{'id': this.initId},
               failure: function(form, action)
               {
                    console.log("load failed");                   
                    Ext.WindowMgr.getActive().close();
                    Ext.Msg.alert('错误', action.result.message);
                                        
               }
            }); 
       
        
    },
    save: function()
    {   
        var formpanel = this;
        var form =  this.getForm();        

        if(form.isValid())
        {
            form.submit({
            url: "accountMgt/saveRsvbPerOSVoucher.action",
            method: 'POST',
            disabled:true,
            waitMsg: mbLocale.waitingMsg,
            success: function(form, action) {      

                Ext.Msg.alert('成功', action.result.message);
                
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
    editReceipt: function()
    {
        var remainedAmount = this.down("[name=remainedAmount]").getValue();
        
        if(remainedAmount == 0)
        {
            Ext.Msg.alert('提醒', '该应收款单已完成收款！');
            return;
        }
        
        smartOA.util.genWindow({
                loader: {
                url: 'accountMgt/editReceiptVch.js',
                autoLoad: true,
                scripts:true
            },
            title: '收款单',
            initId : 0,
            initRsvbId : this.down("[name=entity.id]").getValue()
        });              
    }
});

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
 
    var win = Ext.WindowMgr.getActive();
    win.setSize({width:800, height:260});
    win.center();  
    var formpanel = Ext.create('smartOA.accountMgt.RsvbPerOSVoucherPanel', {'initId':win.initId, 'parentStore':win.store}); 
     
    win.add(formpanel);
    win.doLayout();       
    
     
});
//</script>