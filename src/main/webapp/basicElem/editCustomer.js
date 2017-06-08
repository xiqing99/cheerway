//<script type="text/javascript">

Ext.namespace("smartOA.basicElem");

Ext.define('smartOA.basicElem.editCustomerPanel',
{
    extend : 'Ext.form.Panel',
    initId : 0,
    constructor : function(conf)
    {       
        var areaStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadMarketAreaForCombo.action',
                reader: {
                    type: 'json',
                    root: 'list'
                }
            } 
        });
        
        var areaCombo = new Ext.form.ComboBox({
                name:'entity.area.id',
                valueField:'id',
                hiddenName:'entity.area.id',
                displayField:'name',
                fieldLabel: '客户区域',
                emptyText:'请选择区域',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store : areaStore,
                typeAhead: true,
                flex : 1,
                margins: '5 0 0 30'
            });          

        var currencyStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadCurrencyForCombo.action',
                reader: {
                    type: 'json',
                    root: 'list'
                }
            } 
        });
        
        var currencyCombo = new Ext.form.ComboBox({
                name:'entity.currency.id',
                valueField:'id',
                hiddenName:'entity.currency.id',
                displayField:'name',
                fieldLabel: '结算货币',
                emptyText:'请选择货币',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store : currencyStore,
                typeAhead: true,
                flex : 1,
                margins: '5 0 0 0'
            });               
            
        var priorityStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadCustPriorityForCombo.action',
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });

        var priorityCombo = new Ext.form.ComboBox({
                name:'entity.priority.id',
                valueField:'id',
                hiddenName:'entity.priority.id',
                displayField:'name',
                fieldLabel: '公司级别',
                emptyText:'请选择公司级别',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:priorityStore,
                typeAhead: true,
                flex : 1,
                margins: '5 0 0 30'
            });        

        var creditData = {
        lists: [
        {
            value :'HIGH',
            text : '高信用级'           
        },
         {
            value : 'MEDIUM',
            text : '中信用级'
         },
         {
            value : 'LOW',
            text : '低信用级'
         }         
        ]};
        
        var creditStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['value', 'text'],
            proxy: {
                type: 'memory',
                data: creditData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });

        var creditCombo = new Ext.form.ComboBox({
                name:'entity.credit',
                valueField:'value',
                hiddenName:'entity.credit',
                displayField:'text',
                fieldLabel: '公司信用',
                emptyText:'请选择公司信用',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:creditStore,
                typeAhead: true,
                flex : 1,
                margins: '5 0 0 30'
            });                         
        
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
        
        var deptCombo = new Ext.form.ComboBox({
                name:'entity.respDept.id',
                valueField:'id',
                hiddenName:'entity.respDept.id',
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
                flex : 1,
                margins: '5 0 0 0'
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
                name:'entity.respEmp.id',
                valueField:'id',
                hiddenName:'entity.respEmp.id',
                displayField:'name',
                fieldLabel: '业务员',
                emptyText:'请选择员工',
                editable:false,
                allowBlank:false,
//                forceSelection:true,
                triggerAction:'all',
                store:empStore,
                typeAhead: true,
                flex : 1,
                disabled: true,
                queryMode: 'local',
                margins: '5 0 0 30'
            });        
            
        Ext.form.Field.prototype.msgTarget = 'side';
        
        Ext.apply(this, 
        {
            buttonAlign : 'center',
            frame: true,
            items : [
            {
                xtype: 'hiddenfield',
                name : 'entity.id'                
            },
            {
                xtype : 'tabpanel',
                activeTab : 0,
                layout: 'fit',
                defaults:{
                    bodyStyle:'padding:10px',
                    anchor: '100%'
                },                  
                items : [{
                
                    title : '客户信息',
                    frame: true,
                    layout: {
                    type: 'vbox',
                    align: 'stretch'
                    },
                    border: false,
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            flex: 1,
                            layout: 'hbox',
                            fieldDefaults: {
                                labelAlign: 'left',
                                labelWidth: 70,
                                labelStyle: 'font-weight:bold'
                            }, 
                            items : [
                            {
                              xtype: 'textfield',
                              flex : 1,
                              fieldLabel: '客户名称',
                              name: 'entity.name',
                              allowBlank : false,
                              margins: '5 0 0 0'
                            },
                            areaCombo,
                            {
                              xtype: 'textfield',
                              flex : 1,
                              fieldLabel: '搜索码',
                              name: 'entity.sortIndex',
                              allowBlank : true,
                              margins: '5 0 0 30',
                              vtype: 'alpha'
                            }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            flex: 1,
                            fieldDefaults: {
                                labelAlign: 'left',
                                labelWidth: 70,
                                labelStyle: 'font-weight:bold'
                            },                             
                            items : [
                            currencyCombo,
                            priorityCombo,
                            creditCombo
                            ]
                        },   
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            flex: 1,
                            fieldDefaults: {
                                labelAlign: 'left',
                                labelWidth: 70,
                                labelStyle: 'font-weight:bold'
                            },                             
                            items : [
                                deptCombo,
                                empCombo,
                                {
                                    xtype: 'datefield',
                                    fieldLabel: '开始时间',
                                    name: 'entity.startDate',
                                    maxValue: new Date(),
                                    flex : 1,
                                    margins: '5 0 0 30',
                                    format: 'Y-m-d'
                                } 

                            ]
                        },  
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            flex: 1,
                            fieldDefaults: {
                                labelAlign: 'left',
                                labelWidth: 70,
                                labelStyle: 'font-weight:bold'
                            },                             
                            defaultType: 'textfield',
                            items : [
                            {
                              flex : 1,
                              fieldLabel: '公司电话',
                              name: 'entity.phone',
                              allowBlank : false,
                              margins: '5 0 0 0'
                            },                            
                            {
                              flex : 1,
                              fieldLabel: '传真',
                              name: 'entity.fax',
                              margins: '5 0 0 30'
                            },
                            {
                              flex : 1,
                              fieldLabel: '公司邮箱',
                              name: 'entity.email',
                              vtype:'email',
                              allowBlank : true,
                              margins: '5 0 0 30'
                            }
                            ]
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel: '公司名称',
                            name: 'entity.fullName',
                            allowBlank:false,
                            labelAlign: 'left',
                            labelWidth: 70,
                            labelStyle: 'font-weight:bold',
                            margins: '5 0 0 0'
                        },                        
                        {
                            xtype : 'textfield',
                            fieldLabel: '公司地址',
                            name: 'entity.address',
                            allowBlank:false,
                            labelAlign: 'left',
                            labelWidth: 70,
                            labelStyle: 'font-weight:bold',
                            margins: '5 0 0 0'
                        },
                        {
                            xtype : 'textareafield',
                            fieldLabel: '备注',
                            labelStyle: 'font-weight:bold',
                            name: 'entity.description',
                            allowBlank:true,
                            flex : 0.7,
                            labelAlign : 'left',
                            labelWidth: 70,
                             margins: '5 0 0 0'
                        },
                        {
                            xtype: 'checkboxfield',
                            boxLabel: '停用标志',
                            labelStyle: 'font-weight:bold',
                            name: 'entity.disabled',
                            inputValue:'true'
                        }
                        ]
                    
                },
                {
                    title : '联系人信息',   
                    bodyStyle:'padding:5px',
                    layout : 'anchor',
                    frame : true,
                    defaults: {
                        anchor: '100%'
                    },
                
                    items: [
                    {
                        xtype: 'fieldset',
                        title: '联系人一',
                        frame : true,
                        collapsible: true,
                        layout : 'hbox',
                        border : true,
                        flex : 1,
                        anchor: '100%',
                        fieldDefaults: {
                                labelAlign: 'left',
                                msgTarget: 'side',
                                labelWidth: 70
                                
                            },
                        items : [
                        {
                            columnWidth : .5,
                            border : false,
                            layout : 'anchor',
                            defaultType : 'textfield',
                            flex: 1,
                            items : [
                            {
                                xtype:'textfield',
                                fieldLabel: '姓名',
                                name : 'entity.contactsList[0].name',
                                anchor : '95%'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel: '工作电话',
                                name : 'entity.contactsList[0].officePhone',
                                anchor : '95%'
                            }, 
                            {
                                xtype:'textfield',
                                fieldLabel: 'EMAIL',
                                name : 'entity.contactsList[0].email',
                                anchor : '95%'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel: '职位',
                                name : 'entity.contactsList[0].position',
                                anchor : '95%'
                            }                            
                            ]
                        },
                        {
                            columnWidth : .5,
                            border : false,
                            layout : 'anchor',
                            defaultType : 'textfield',
                            flex: 1,
                            items : [
                            {
                                xtype:'textfield',
                                fieldLabel: '部门',
                                name : 'entity.contactsList[0].department',
                                anchor : '95%'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel: '手机',
                                name : 'entity.contactsList[0].mobile',
                                anchor : '95%'
                            }, 
                            {
                                xtype:'textfield',
                                fieldLabel: 'QQ',
                                name : 'entity.contactsList[0].qq',
                                anchor : '95%'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel: '备注',
                                name : 'entity.contactsList[0].notes',
                                anchor : '95%'
                            }                            
                            ]
                        }                                                
                        ]
                    },                    
                   {
                        xtype: 'fieldset',
                        title: '联系人二',
                        frame : true,
                        collapsible: true,
                        layout : 'hbox',
                        border : true,
                        flex : 1,
                        anchor: '100%',
                        fieldDefaults: {
                                labelAlign: 'left',
                                msgTarget: 'side',
                                labelWidth: 60
                                
                            },
                        items : [
                        {
                            columnWidth : .5,
                            border : false,
                            layout : 'anchor',
                            defaultType : 'textfield',
                            flex: 1,
                            items : [
                            {
                                xtype:'textfield',
                                fieldLabel: '姓名',
                                name : 'entity.contactsList[1].name',
                                anchor : '95%'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel: '工作电话',
                                name : 'entity.contactsList[1].officePhone',
                                anchor : '95%'
                            }, 
                            {
                                xtype:'textfield',
                                fieldLabel: 'EMAIL',
                                name : 'entity.contactsList[1].email',
                                anchor : '95%'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel: '职位',
                                name : 'entity.contactsList[1].position',
                                anchor : '95%'
                            }                            
                            ]
                        },
                        {
                            columnWidth : .5,
                            border : false,
                            layout : 'anchor',
                            defaultType : 'textfield',
                            flex: 1,
                            items : [
                            {
                                xtype:'textfield',
                                fieldLabel: '部门',
                                name : 'entity.contactsList[1].department',
                                anchor : '95%'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel: '手机',
                                name : 'entity.contactsList[1].mobile',
                                anchor : '95%'
                            }, 
                            {
                                xtype:'textfield',
                                fieldLabel: 'QQ',
                                name : 'entity.contactsList[1].qq',
                                anchor : '95%'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel: '备注',
                                name : 'entity.contactsList[1].notes',
                                anchor : '95%'
                            }                            
                            ]
                        }                                                
                        ]
                    }]
                    
                }                
                ]
        } 
        ],
             buttons: [{
                        text: mbLocale.submitButton,
                        handler: function(){
                        	var form =  this.up('form').getForm();
                        	if(form.isValid())
                        	{                               
                                if(form.isDirty() == false)
                                {
                                    Ext.WindowMgr.getActive().close();
                                    return;
                                }
                                
                        		form.submit({
                                url: 'basicElem/saveCustomer.action',
                                method: 'POST',
                                disabled:true,
                                waitMsg: mbLocale.waitingMsg,
                                success: function(form, action) {      
                                        Ext.WindowMgr.getActive().close();
                                        conf.parentStore.reload();
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
                    },{
                        text: mbLocale.closeButton,
                        scope:this,
                        handler: function(){
                            Ext.WindowMgr.getActive().close();
                            }
                    }]
        });
                
        this.callParent(arguments); 
    },
    onRender : function()
    {
        this.callParent(arguments); 
        console.log("onRender");
        if(this.initId == 0)
            return;
        this.form.trackResetOnLoad = true;    
        this.form.load({
                url : 'basicElem/loadCustomer.action',
               params:{'id': this.initId},
               failure: function(form, action)
               {                 
                    Ext.WindowMgr.getActive().close();
                    Ext.Msg.alert('错误', action.result.message);
                                        
               }
            });
            
    }    
});

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
     
    var win = Ext.WindowMgr.getActive();
    
    var formpanel = Ext.create('smartOA.basicElem.editCustomerPanel',
    {
        initId : win.initId,
        parentStore : win.store
    });   
     
    win.add(formpanel);
    win.doLayout();  

});
//</script>