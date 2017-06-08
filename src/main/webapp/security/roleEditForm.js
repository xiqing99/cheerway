<script type="text/javascript">

Ext.onReady(function() {
    
     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
 
    Ext.define('RoleEditForm',
    {
        extend : 'Ext.form.Panel',
        parentStore : null,
        saveUrl : '',
        nameText : '',
        constructor : function(conf)
        {               
            Ext.apply(this, 
            {
                frame: true,
                labelAlign: 'left',
                style:'padding:1px',  
                buttonAlign : 'center',
                layout: {
                        type: 'vbox'
                    },
                    border: false,
                    bodyPadding: 10,
                    fieldDefaults: {
                        labelAlign: 'left',
                        labelWidth: 80,
                        width: 300,
                        labelStyle: 'font-weight:bold',
                        margins: '2 0 0 5'
                    },             
                items: [
                {
                    xtype : 'textfield',
                    fieldLabel: conf.nameText + '名称',
                    name: 'entity.name',
                    allowBlank:false,
                    flex:1,
                    validator: function(value)
                    {  
                        if(conf.nameText == '角色')
                        {
                            var alpha = /^[a-zA-Z_]+$/; 
                            
                            if(!alpha.test(value)  || value.substring(0,5) != 'ROLE_')
                            {
                                return '角色名称格式必须为ROLE_xxxxx, x为英文字母。';
                            }  
                        }
                      
                        return true;
                    }
                }, 
                {
                    xtype : 'textfield',
                    fieldLabel: conf.nameText + '描述',
                    name: 'entity.description',
                    allowBlank:true,
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
                                            Ext.WindowMgr.getActive().close();
                                            conf.parentStore.reload();
                                            Ext.Msg.alert('成功', action.result.message); 
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
                                Ext.WindowMgr.getActive().close();
                            }
                        }]
            }); 
            
            this.callParent(arguments); 
        }    
    });     
     
    var win = Ext.WindowMgr.getActive();
  
    var formpanel = Ext.create('RoleEditForm', {saveUrl : win.saveUrl, nameText : win.nameText, 'parentStore':win.store}); 
     
    win.add(formpanel);
    win.doLayout();         

});

</script>