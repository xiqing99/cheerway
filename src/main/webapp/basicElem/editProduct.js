<script type="text/javascript">

Ext.namespace("smartOA.basicElem.ProdDetails");

Ext.define('smartOA.basicElem.ProdDetailsPanel',
{
    extend : 'Ext.form.Panel',
    initId : 0,
    parentStore : null,
    constructor : function(id, store)
    {
        var unitStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadProdUnitForCombo.action',
                reader: {
                    type: 'json',
                    root: 'list'
                }
            }           
        });        
        
        var unitCombo = new Ext.form.ComboBox({
                name:'entity.unit.id',
                valueField:'id',
                hiddenName:'entity.unit.id',
                displayField:'name',
                fieldLabel: '计件单位',
                emptyText:'请选择单位',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store : unitStore,
                typeAhead: true,
                flex : 1,
                margins: '0 0 0 20'
            });          
        
        var typeStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadProdTypeForCombo.action',
                reader: {
                    type: 'json',
                    root: 'list'
                }
            }           
        }); 

        var typeCombo = new Ext.form.ComboBox({
                name:'entity.type.id',
                valueField:'id',
                hiddenName:'entity.type.id',
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
                margins: '10 0 0 20'
            });               
        
        var categoryStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadProdCtgForCombo.action',
                reader: {
                    type: 'json',
                    root: 'list'
                }
            }           
        }); 
        
        var ctgCombo = new Ext.form.ComboBox({
                name:'entity.category.id',
                valueField:'id',
                hiddenName:'entity.category.id',
                displayField:'name',
                fieldLabel: '产品目录',
                emptyText:'请选择产品目录',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:categoryStore,
                typeAhead: true,
                flex : 1,
                margins: '10 0 0 0'
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
                    labelWidth: 60,
                    labelStyle: 'font-weight:bold'
//                    margins: '5 0 0 0'
                },                
            items: [
            {
                xtype: 'hiddenfield',
                name : 'entity.id'                
            },
        	{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                {
                  flex : 1,
                  fieldLabel: '产品名称',
                  name: 'entity.name',
                  allowBlank : false
                },
                unitCombo
                ]
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaultType: 'textfield',
                items : [                    
                {
                  flex : 1,
                  fieldLabel: '产品型号',
                  name: 'entity.modelNum',
                  allowBlank : false,
                  margins: '10 0 0 00'
                },
                {
                  flex : 1,
                  fieldLabel: '子型号',
                  name: 'entity.subModelNum',
                  allowBlank : false,
                  margins: '10 0 0 20'
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
                {
                  xtype : 'numberfield',
                  flex : 1,
                  fieldLabel: '参考售价',
                  name: 'entity.cost',
                  allowBlank : false,
                  minValue : 0,
                  margins: '10 0 0 0'
                },                
                {
                  xtype : 'numberfield',
                  flex : 1,
                  fieldLabel: '最高单价',
//                  name: 'entity.maxPrice',
                  minValue : 0,
                  allowBlank : false,
                  margins: '10 0 0 20',
                  disabled: true
                },
                {
                  xtype : 'numberfield',
                  flex : 1,
                  fieldLabel: '最低单价',
//                  name: 'entity.minPrice',
                  allowBlank : false,
                  minValue : 0,
                  margins: '10 0 0 20',
                  disabled: true
                }
                ]
            },            
            {
            	xtype : 'textareafield',
                fieldLabel: '产品描述',
                name: 'entity.description',
                lableAlign : 'top',
                allowBlank:true,
                flex : 1,
                labelAlign : 'top',
                margins: '10 0 0 0'
            },
            {
                xtype: 'checkboxfield',
                boxLabel: '停用标志',
                name: 'entity.disabled',
                inputValue:'true'
            }
            ],         
             buttons: [{
                        text: '保存',
                        handler: function(){
                        	var form =  this.up('form').getForm();
                        	if(form.isValid())
                        	{
                        		form.submit({
                                url: 'basicElem/saveProduct.action',
                                method: 'POST',
                                disabled:true,
                                waitMsg: mbLocale.waitingMsg,
                                success: function(form, action) {      
                                        Ext.WindowMgr.getActive().close();
                                        Ext.Msg.alert('成功', action.result.message);
                                        
                                        if(parentStore != null)
                                            parentStore.reload();
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
        
        initId = id;
        parentStore = store;
        this.callParent(arguments); 
    },
    onRender : function()
    {
        this.callParent(arguments); 
        console.log("onRender");
        if(initId == 0)
            return;
        this.form.load({
                url : 'basicElem/loadProduct.action',
               params:{'id': initId},
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
 /*    
            var win = new Ext.Window(Ext.apply({
                closable : true,
                title : '产品设置',
                width    : 540,
                height   : 420,
                maximizable: true,
                modal: true,
                layout   : 'fit',
                resizable: true
                },{initParam : 1}));     
*/      
    var win = Ext.WindowMgr.getActive();
    console.log(win.initId);    
     
    var formpanel = new smartOA.basicElem.ProdDetailsPanel(win.initId, win.store);     
     
    win.add(formpanel);
    win.doLayout();  

});
</script>