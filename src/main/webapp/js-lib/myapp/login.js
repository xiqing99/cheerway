
Ext.onReady(
function()
{ 
    	
           
    var logoPanel = Ext.create('Ext.panel.Panel',
    {
        baseCls: 'x-plain',
        id : 'login-logo',
        region: 'center'
    });            
    
    var loginForm = Ext.create('Ext.form.Panel', {
    
        width: 350,
        height :90,
        url: 'j_spring_security_check',
        region: 'south',
        border : true,
        bodyPadding : 5,
        buttonAlign:'center', 
        baseCls : 'x-plain',
        defaults : {
            width : 300
        },
        items:[
        {
            xtype: 'textfield',
            itemId: 'userNameId',
            name: 'j_username',
            fieldLabel: '用户名',          
            allowBlank : false,
            blankText: '用户名不为空',
            maxLength: 40,
            validateOnBlur : true,
            validator: function(value)
            {        
                var alpha = /^[a-zA-Z_.]+$/; 
                
                if(!alpha.test(value))
                {
                    return '用户名只能包含英文字母 -.';
                }                        
                return true;
            }
        },
        {
            xtype: 'textfield',
            inputType : 'password',
            name : 'j_password',
            fieldLabel: '密码',
            allowBlank : false,
            blankText : '密码不能为空',
            maxLength: 40,
            validateOnBlur : false,
            vtype :'alphanum'
        }],
        
        buttons :[
        {
            itemId :'submitButId',
            text: '提交',
            type : 'submit',
            enableToggle: true,
            height : 27,
            handler: submit            
        },
        {
            text: "重置",
            enableToggle: true,
            height : 27,
            handler: reset       
        }
        ]       
    });    	
    
    function reset()
    {
    	loginForm.getForm().reset();
    }
    
    function submit()
    {
        var form = loginForm.getForm();
        
        if(form.isValid())
        {
            form.submit(
            {
                success : function(form, action)
                {
                    document.location= "main.html";
                    
                },
                
                failure: function(form, action)
                {
                    Ext.Msg.alert('登录失败', '请检查用户名密码！');
                    form.reset();
                }
            }
            );
        }else
        {
            Ext.Msg.alert('输入格式错误', '请输入正确的用户名密码格式！');
        }
    }
    
    var loginWin = Ext.create('Ext.window.Window', {
    title: '登录',
    closable: false,
    resizable: false,
    draggable: true,
    height: 250,
    width: 400,
    layout: 'border',
    bodyStyle : 'padding:5px;',
    iconCls : 'ux-auth-header-icon',
    buttonAlign:'center', 
    items: [logoPanel, loginForm]
    });
    
    loginWin.on("show", function()
    {
        loginForm.getComponent('userNameId').focus(true, true);
    });        
    
    loginWin.show();
        
    var map = new Ext.util.KeyMap({
    target : this,
    key :13,
    fn: submit
    });
        
}
);