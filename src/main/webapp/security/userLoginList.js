//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    Ext.define("RoleListGridPanel",
    {   
        extend : "Ext.grid.Panel",
        tile : '用户组列表',
        constructor : function()
        {                                    
            Ext.define('DataModel',{
                 extend : 'Ext.data.Model',
                fields: [
                     {name: 'id', type: 'int'},
                     {name: 'name'},
                     {name: 'description'},
                     {name: 'authorized', type:'boolean'}
                ]         
            }  
            );
    
            var myStore = Ext.create('Ext.data.ArrayStore', {
                model : 'DataModel',            
                autoLoad : false,
                autoSync: false
            });                     
            
            var selModel = Ext.create('Ext.selection.CheckboxModel', {
                listeners: {
                    selectionchange: function(sm, selections) {
                    }
                }
            });  
            
            Ext.apply(this, {      
                columnLines : true,
                store: myStore,
                autoScroll:true,
                frame : false,                      
                columns: [
                  {xtype: 'rownumberer'},
                  {text : '', dataIndex:'id', hidden: true},
                  {text : "用户组名称" , dataIndex : 'name', sortable : true, width : 350, align : 'center'},
                  {text : "用户组描述" , dataIndex : 'description',  flex:1, align : 'center'}             
                  ],
                  selModel: selModel
            });
            
            this.callParent(arguments);
        }
    });
    
    
    Ext.define('UserEditForm',
    {
        extend : 'Ext.form.Panel',
        constructor : function(conf)
        {               
            Ext.apply(this, 
            {
                frame: true,
                height: 80,
                labelAlign: 'left',
                style:'padding:1px',
                resizable: true,
                layout: {
                        type: 'hbox'
                    },
                    border: false,
                    bodyPadding: 10,
                    fieldDefaults: {
                        labelAlign: 'left',
                        labelWidth: 60,
                        labelStyle: 'font-weight:bold'
                    },             
                items: [
                {
                    name : 'entity.id',
                    xtype: 'hiddenfield'
                },
                {
                    name : 'entity.empGenInfo.id',
                    xtype: 'hiddenfield'
                },
                {
                    xtype : 'textfield',
                    fieldLabel: '用户名',
                    name: 'entity.name',
                    allowBlank:false,
                    margins: '2 0 0 5',
                    width:200,
                    validator: function(value)
                    {        
                        var alpha = /^[a-zA-Z_.]+$/; 
                        
                        if(!alpha.test(value))
                        {
                            return '用户名只能包含英文字母数字-.';
                        }                        
                        return true;
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel: '密码',
                    name: 'entity.password',
                    allowBlank:true,
                    margins: '2 0 0 100',
                    width:200
                },
                {
                    xtype: 'checkboxfield',
                    boxLabel  : '启用',
                    labelStyle: 'font-weight:bold',
                    name      : 'entity.enabled',
                    inputValue: 'true',
                    margins: '2 0 0 100',
                    width: 100
                }
                ],
                tbar: [
                    {
                        text: '保存',
                        icon :'images/accept.png',
                        iconCls :'save-icon',
                        handler: this.save,
                        scope: this
                    },
                    {
                        text: '刷新',
                        icon :'images/arrow_refresh.png',
                        iconCls :'save-icon',
                        handler: this.refresh,
                        scope: this
                    }
                ]
            }); 
            
            this.callParent(arguments); 
        },
        save : function()
        {      
            var records = roleListPanel.getSelectionModel().getSelection();
            var roleList = new Array();
            for(var rec in records)
            {
                 var data = records[rec].data;
                 roleList.push({id:data.id});
            }
            
            var form = this.getForm();
            var formPanel = this;
            
            if(form.isValid())
            {
                form.submit({
                url: 'security/saveUser.action',
                method: 'POST',
                disabled:true,
                waitMsg: mbLocale.waitingMsg,
                params : {
                    'itemListsJson' : Ext.encode(roleList)
                },
                success: function(form, action) {         
                    Ext.Msg.alert('成功', action.result.message);
                    if(action.result.id != null)
                    {
    
                        formpanel.down("[name=entity.id]").value = action.result.id;
                    }       
                },
                failure: function(form, action) {
                    Ext.Msg.alert('失败', '用户名已存在，请重新选择！');
                }
            });
            }else
            {
                Ext.Msg.alert('输入错误', '请输入正确内容');
            }
        },
        refresh: function()
        {
            
        }
    });
    
    Ext.define("EmpGenListViewGridPanel",
    {   
        extend : "Ext.grid.Panel",
        title: '员工列表',
        constructor : function()
        {                                    
            Ext.define('EmpGenInfo', {
                 extend: 'Ext.data.Model',
                 fields: [
                     {name: 'id', type: 'int'},
                     {name: 'name', type: 'string'},
                     {name: 'deptName'},
                     {name: 'email',  type: 'string'}
                 ]
             });        
            
             var myStore = Ext.create('Ext.data.Store', {
                model : EmpGenInfo,            
                proxy: {
                    type: 'ajax',
                    url: "basicElem/loadAllEmpGenInfo.action",
                    reader: {
                        type: 'json'
                    }           
                },
                autoLoad : true,
                autoSync: false
            });    
             
            Ext.apply(this, {      
                columnLines : true,
                store: myStore,
                autoScroll:true,
                frame : false,   
                title: '员工列表',
                resizable: true,
                width: 400, 
                columns: [
                  {xtype: 'rownumberer'},
                  {text : '', dataIndex:'id', hidden: true},
                  {text : "姓名" , dataIndex : 'name', sortable : true, width : 100, align : 'center'
                  },
                  {text : "部门" , dataIndex : 'deptName', sortable : true, width : 100, align : 'center'
                
                  },
                  {text : "邮箱" , dataIndex : 'email', sortable : true, width : 160, align : 'center', flex:1}
                  ],            
                selType: 'rowmodel',
                features:[
                {
                    ftype : 'searching',
                    minChars : 2,
                    width : 100,
                    position : 'top',
                    iconCls: 'Zoom',
                    menuStyle: 'radio',
                    showSelectAll : false,
                    checkIndexes: ['name'],
                    align : 'right',
                    mode : 'local'
                }]
            });
            
            this.callParent(arguments);
        }
    }); 
    
    var roleListPanel = Ext.create('RoleListGridPanel',
    {
        flex: 1
    });       
    
    var userForm = Ext.create('UserEditForm');
    
    var userEditPanel = Ext.create('Ext.panel.Panel',
                    {   
                        title: '用户角色编辑',
                        layout: {
                            type: 'vbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        flex:1,
                        items : [userForm, roleListPanel]
                    });  
                    
    var empListPanel = Ext.create('EmpGenListViewGridPanel');
    
    var framePanel = Ext.create('Ext.panel.Panel',
                    {   
                        layout: {
                            type: 'hbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items : [empListPanel, userEditPanel]
                    });     
    
    empListPanel.on('itemclick', function(object,record)
    {
        var data = record.getData();        
        loadUser(data.id);
    }
    );      
    
    var loadUser = function(empId)
    {
        userForm.down('[name=entity.empGenInfo.id]').setValue(empId);
        userForm.getForm().trackResetOnLoad = true;    
        userForm.getForm().load({
               url : 'security/loadUserByEmpId.action',
               params:{'id': empId},
               success : loadSuc,
               failure: function(form, action)
               {
                    Ext.Msg.alert('错误', action.result.message);
                                        
               }
            });
    }
    
    var loadSuc = function(form, action)
    {  
        var obj = Ext.JSON.decode(action.response.responseText, true);
        var store = roleListPanel.getStore();
        
        store.loadData(obj.data.roleList);        
        
        var authorizedList = [];
        
        var num = store.getCount();                
        for(var i=0; i<store.getCount(); i++)
        {
            var record = store.getAt(i);
            if(record.data.authorized == true)
            {
                authorizedList.push(record);
            }
        }
        
        var selModel = roleListPanel.getSelectionModel();
        selModel.select(authorizedList);
    }
    
   if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    }
});
//</script>