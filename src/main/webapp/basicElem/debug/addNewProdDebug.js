
Ext.namespace("smartOA.basicElem.ProdDetails");

Ext.define('smartOA.basicElem.ProdDetails.AddNewFormPanel',
{
    extend : 'Ext.form.Panel',

    constructor : function()
    {
    	var unitData = {
        lists: [
        {
            id : '1',
            name : '辆'           
        },
         {
            id : '2',
            name : '个'
         }     
        ]};
        
        var unitStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: unitData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });
        
        var unitCombo = new Ext.form.ComboBox({
                name:'product.unit.id',
                valueField:'id',
                hiddenName:'product.unit.id',
                displayField:'name',
                fieldLabel: '计件单位',
                emptyText:'请选择单位',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store : unitStore,
                typeAhead: true,
                flex : 1
            });
           
        var typeData = {
        lists: [
        {
            id : '1',
            name : '销售类'           
        },
         {
            id : '2',
            name : '半成品'
         }     
        ]};
        
        var typeStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: typeData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });

        var typeCombo = new Ext.form.ComboBox({
                name:'product.type.id',
                valueField:'id',
                hiddenName:'product.type.id',
                displayField:'name',
                fieldLabel: '产品性质',
                emptyText:'请选择产品性质',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:typeStore,
                typeAhead: true,
                flex : 1,
                margins: '0 0 0 20'
            });        
        
        var categoryData = {
        lists: [
        {
            id : '1',
            name : '三轮车'           
        },
         {
            id : '2',
            name : '推车'
         }     
        ]};
        
        var categoryStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: categoryData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var ctgCombo = new Ext.form.ComboBox({
                name:'product.category.id',
                valueField:'id',
                hiddenName:'product.category.id',
                displayField:'name',
                fieldLabel: '产品目录',
                emptyText:'请选择产品目录',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:categoryStore,
                typeAhead: true,
                flex : 1
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
                    labelStyle: 'font-weight:bold',
                    margins: '5 0 0 5'
                },                
            items: [
        	{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                {
                  flex : 1,
                  fieldLabel: '产品名称',
                  name: 'product.name',
                  allowBlank : false
                },
                {
                  flex : 1,
                  fieldLabel: '产品型号',
                  name: 'product.modelNum',
                  allowBlank : false,
                  margins: '0 0 0 20'
                }
                ]
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items : [
                ctgCombo,
                typeCombo
                ]
            },   
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items : [
                    unitCombo,
                {
                  xtype : 'numberfield',
                  flex : 1,
                  fieldLabel: '产品单价',
                  name: 'product.cost',
                  allowBlank : false,
                  minValue : 0,
                  margins: '0 0 0 20'
                }
                ]
            },            
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items : [
                {
                  xtype : 'numberfield',
                  flex : 1,
                  fieldLabel: '最高单价',
                  name: 'product.maxPrice',
                  minValue : 0,
                  allowBlank : false
                },
                {
                  xtype : 'numberfield',
                  flex : 1,
                  fieldLabel: '最低单价',
                  name: 'product.minPrice',
                  allowBlank : false,
                  minValue : 0,
                  margins: '0 0 0 20'
                }
                ]
            },            
            {
            	xtype : 'textareafield',
                fieldLabel: '产品描述',
                name: 'product.description',
                lableAlign : 'top',
                allowBlank:true,
                flex : 1,
                labelAlign : 'top'
            }],
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
     
     var formpanel = new smartOA.basicElem.ProdDetails.AddNewFormPanel();
     
     var win = Ext.widget('window',
     {
        closable : true,
        title : '产品设置',
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