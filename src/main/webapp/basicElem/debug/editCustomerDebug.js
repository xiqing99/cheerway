
Ext.namespace("smartOA.basicElem");

Ext.define('smartOA.basicElem.editCustomerPanel',
{
    extend : 'Ext.form.Panel',

    constructor : function()
    {
    	var areaData = {
        lists: [
        {
            id : '1',
            name : '国内'           
        },
         {
            id : '2',
            name : '美国'
         }     
        ]};
        
        var areaStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: areaData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });
        
        var areaCombo = new Ext.form.ComboBox({
                name:'product.unit.id',
                valueField:'id',
                hiddenName:'product.unit.id',
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
                margins: '0 0 0 40'
            });
           
        var priorityData = {
        lists: [
        {
            id : '1',
            name : '大客户'           
        },
         {
            id : '2',
            name : '小客户'
         }     
        ]};
        
        var priorityStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: priorityData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });

        var priorityCombo = new Ext.form.ComboBox({
                name:'product.type.id',
                valueField:'id',
                hiddenName:'product.type.id',
                displayField:'name',
                fieldLabel: '公司级别',
                emptyText:'请选择公司级别',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:priorityStore,
                typeAhead: true,
                flex : 1
            });        

        var creditData = {
        lists: [
        {
            id : '1',
            name : '可信'           
        },
         {
            id : '2',
            name : '不可信'
         }     
        ]};
        
        var creditStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
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
                name:'product.type.id',
                valueField:'id',
                hiddenName:'product.type.id',
                displayField:'name',
                fieldLabel: '公司信用',
                emptyText:'请选择公司信用',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:creditStore,
                typeAhead: true,
                flex : 1,
                margins: '0 0 0 40'
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
            
        Ext.form.Field.prototype.msgTarget = 'side';
        
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
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                {
                  flex : 1,
                  fieldLabel: '客户名称',
                  name: 'entity.name',
                  allowBlank : false
                },
                areaCombo
                ]
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items : [
                priorityCombo,
                creditCombo
                ]
            },   
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items : [
                    deptCombo,
                    empCombo
                ]
            },  
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                {
                  flex : 1,
                  fieldLabel: '公司电话',
                  name: 'entity.phone',
                  allowBlank : false
                },
                {
                  flex : 1,
                  fieldLabel: '公司邮箱',
                  name: 'entity.email',
                  allowBlank : false,
                  margins: '0 0 0 40'
                }
                ]
            },            
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items : [
                {
                  xtype : 'textfield',
                  flex : 1,
                  fieldLabel: '传真',
                  name: 'entity.fax'
                  
                },
                {
                    xtype: 'datefield',
                    fieldLabel: '开始时间',
                    name: 'entity.startTime',
                    maxValue: new Date(),
                    flex : 1,
                    margins: '0 0 0 40',
                    format: 'Y /m /d '
                }                
                ]
            },
            {
                xtype : 'textfield',
                fieldLabel: '公司地址',
                name: 'entity.address',
                allowBlank:false
            },
            {
                xtype : 'textareafield',
                fieldLabel: '备注',
                name: 'entity.notes',
                allowBlank:true,
                flex : 1,
                labelAlign : top
            }             
            ],
             buttons: [{
                        text: mbLocale.submitButton,
                        handler: function(){
                        	var form =  this.up('form').getForm();
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
                    },{
                        text: mbLocale.closeButton,
                        scope:this,
                        handler: function(){
                            Ext.WindowMgr.getActive().close();
                            }
                    }]
        });
        
        this.callParent(arguments); 
    }
});

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
     
     var formpanel = new smartOA.basicElem.editCustomerPanel();
     
     var win = Ext.widget('window',
     {
        closable : true,
        title : '客户设置',
        width    : 540,
        height   : 420,
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