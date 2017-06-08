<script type="text/javascript">

Ext.define('smartOA.security.userSetting.FormPanel',
{
    titleLable : '用户设置',
    userNameLable : '用户名',
    passwordLable : '旧密码',
    newPasswordLable : '新密码',
    passwordRepeatLabel : '确认密码',
    extend : 'Ext.form.Panel',
    id : 'smartOA.security.userSetting.FormPanel',
    constructor : function()
    {
    	console.log("construtor");
    	Ext.apply(this,
    	{
            title : this.titleLable,
            layout: 'form',
            labelWidth: 150,
            frame : true,
            monitorValid:true,
            style:'padding:1px',
            monitorValid:true,
            buttonAlign : 'left',
            closeAction : 'destroy',
            items: [{
                xtype:'fieldset',
                title: this.userInformation,
                collapsible: true,
                autoHeight:true,
                flex:1,
                defaults: {width: 310},
                defaultType: 'textfield',
                items:[
                {
                    name : 'entity.id',
                    xtype: 'hiddenfield'
                },
                {
                    fieldLabel: this.userNameLable,
                    name : 'entity.name',
                    xtype: 'textfield',
                    inputType: 'text',
                    readOnly: true
                },
                {
                    fieldLabel : this.passwordLable,
                    itemId: 'orgPasswordId',
                    xtype: 'textfield',
                    inputType : 'password',
                    name : 'orgPassword',
                    allowBlank : 'false',
                    blankText: '密码不能为空',
                    vtype :'alphanum',
                    validateOnBlur : 'true'
                },
                {
                    fieldLabel : this.newPasswordLable,
                    xtype: 'textfield',
                    inputType : 'password',
                    name : 'entity.password',
                    allowBlank : 'false'
                },
                {
                    fieldLabel : this.passwordRepeatLabel,
                    xtype: 'textfield',
                    inputType : 'password',
                    vtype: 'passwordAgain'
                }
            ]
            },
            {
            	buttonAlign:'left',
            	buttons: [
                {
                    text : mbLocale.submitButton,
                    scope: this,
                    enableToggle: true,
                    handler: this.submit
                }
               ]
            }]
    	});   	    	
    	
    	console.log(" usersetting created.");
    	
    	this.callParent(arguments); 
    	
       	Ext.apply(Ext.form.field.VTypes, {
                passwordAgain : function(val, field)
                {
                    var form = Ext.getCmp("smartOA.security.userSetting.FormPanel").getForm();
                    var password = form.findField('entity.password').getValue();
                    if(val != password)
                    {
                        return false;
                    }else
                    {
                        return true;
                    }
                },
                
                passwordAgainText: '密码不一致'
            }); 
    	          
    }, 
    onRender : function()
    {
    	this.callParent(arguments); 
        this.form.load({
                url: 'security/loadCurUser.action'
            });
    },
    
    submit : function()
    {
    	var form = Ext.getCmp("smartOA.security.userSetting.FormPanel").getForm();
        
        if(form.isValid())
        {
            form.submit(
            {
                url: 'updateCurUser.action',
                method: 'POST',
                waitMsg: mbLocale.waitingMsg,
                success : function(form, action)
                {
                    Ext.Msg.alert('success', action.result.message);
                    
                },
                
                failure: function(form, action)
                {
                    Ext.Msg.alert('failure', action.result.message);
                }
            }
            );
        }else
        {
            Ext.Msg.alert('错误数据', '请输入正确数据.');
        }
    }
});

Ext.onReady(function() {

	Ext.QuickTips.init();	
    Ext.form.Field.prototype.msgTarget = 'side'
    
	var settingForm = Ext.create('smartOA.security.userSetting.FormPanel');                
      
    if (mainPanel) {
        mainPanel.getActiveTab().add(settingForm);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'form', items:[settingForm]});
    }  
});
</script>