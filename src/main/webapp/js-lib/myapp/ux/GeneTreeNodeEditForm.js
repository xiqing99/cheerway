
Ext.define('js-lib.myapp.ux.GeneTreeNodeEditForm',
{
    extend : 'Ext.form.Panel',
    initId : 0,
    parentStore : null,
    comboLoadUrl : '',
    dataLoadUrl : '',
    saveUrl : '',
    nameText : '',
    constructor : function(conf)
    {               
        var comboStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : conf.comboLoadUrl,
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }           
        });               

        var combo = new Ext.form.ComboBox({
                name:'entity.supNode.id',
                selectOnFocus:true,
                valueField:'id',
                hiddenName:'entity.supNode.id',
                displayField:'name',
                fieldLabel: '上级'+ conf.nameText,
                emptyText:'请选择上级'+ conf.nameText,
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:comboStore,
                typeAhead: true,
                 width : 80
            });
        Ext.apply(this, 
        {
            frame: true,
 //           plain:true,
            labelAlign: 'left',
            style:'padding:1px',  
            buttonAlign : 'center',
            layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                bodyPadding: 10,
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 80,
                    labelStyle: 'font-weight:bold',
                    margins: '2 0 0 5'
                },             
            items: [
            {
                name : 'entity.id',
                xtype: 'hiddenfield'
            },
            {
                xtype : 'textfield',
                fieldLabel: conf.nameText + '名称',
                name: 'entity.name',
                allowBlank:false
            }, 
            combo,
            {
                xtype : 'textareafield',
                fieldLabel: conf.nameText + '描述',
                name: 'entity.description',
                allowBlank:true,
                grow : true,
                flex: 1
            }
            ],
             buttons: [{
                        text: mbLocale.submitButton,
                        handler: function(){
                            var form =  this.up('form').getForm();
                            
                            if(form.isValid())
                            {
                                form.submit({
                                url: conf.saveUrl,
                                method: 'POST',
                                disabled:true,
                                waitMsg: mbLocale.waitingMsg,
                                success: function(form, action) {                                          
                                        Ext.Msg.alert('成功', action.result.message);
                                        conf.parentStore.reload();
                                        Ext.WindowMgr.getActive().close();      
                                },
                                failure: function(form, action) {
                                    Ext.Msg.alert('失败', action.result.message);
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
                            
                            var win = Ext.WindowMgr.getActive();
                            win.close();
                            }
                    }]
        }); 
        
        this.callParent(arguments); 
    },
    afterRender : function()
    {
        this.callParent(arguments); 

        if(this.initId == 0)
            return;
        this.form.load({
                url : this.dataLoadUrl,
               params:{'id': this.initId},
               failure: function(form, action)
               {                  
                    Ext.WindowMgr.getActive().close();
                    Ext.Msg.alert('错误', action.result.message);
                                        
               }               
            });        
    }
});