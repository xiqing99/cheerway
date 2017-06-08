//<script type="text/javascript">


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    Ext.define("AuthorityListGridPanel",
    {   
        extend : "Ext.grid.Panel",
        tile : '资源列表',
        constructor : function()
        {                                    
            Ext.define('AuthorityModel',{
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
                model : 'AuthorityModel',            
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
                  {text : "权限名称" , dataIndex : 'name', sortable : true, width : 350, align : 'center'},
                  {text : "权限描述" , dataIndex : 'description',  flex:1, align : 'center'}             
                  ],
                  selModel: selModel
            });
            
            this.callParent(arguments);
        }
    });
    
    
    Ext.define('RoleEditForm',
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
                        labelWidth: 80,
                        labelStyle: 'font-weight:bold'
                    },             
                items: [
                {
                    name : 'entity.id',
                    xtype: 'hiddenfield'
                },
                {
                    xtype : 'textfield',
                    fieldLabel: '角色名称',
                    name: 'entity.name',
                    allowBlank:false,
                    margins: '2 0 0 5',
                    flex:1,
                    validator: function(value)
                    {        
                        var alpha = /^[a-zA-Z_]+$/; 
                        
                        if(!alpha.test(value)  || value.substring(0,5) != 'ROLE_')
                        {
                            return '角色名称格式必须为ROLE_xxxxx, x为英文字母。';
                        }                        
                        return true;
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel: '角色描述',
                    name: 'entity.description',
                    allowBlank:true,
                    margins: '2 0 0 40',
                    flex:2
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
            var records = authorityListPanel.getSelectionModel().getSelection();
            var authList = new Array();
            for(var rec in records)
            {
                 var data = records[rec].data;
                 authList.push({id:data.id});
            }
            
            var form = this.getForm();
            var formPanel = this;
            
            if(form.isValid())
            {
                form.submit({
                url: 'security/saveRole.action',
                method: 'POST',
                disabled:true,
                waitMsg: mbLocale.waitingMsg,
                params : {
                    'itemListsJson' : Ext.encode(authList)
                },
                success: function(form, action) {         
                    Ext.Msg.alert('成功', action.result.message);
                    if(action.result.id != null)
                    {
    
                        formpanel.down("[name=entity.id]").value = action.result.id;
                    }
                    
                    roleListPanel.refresh();
                        
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
        refresh: function()
        {
            
        }
    });
    
    
    Ext.define("RoleListGridPanel",
    {   
        extend : "Ext.grid.Panel",
        tile : '角色列表',
        constructor : function()
        {                                    
            Ext.define('RoleModel',{
                 extend : 'Ext.data.Model',
                fields: [
                     {name: 'id', type: 'int'},
                     {name: 'name'},
                     {name: 'description'}
                ]         
            }  
            );
         
            var myStore = Ext.create('Ext.data.Store', {
                model : RoleModel,            
                proxy: {
                    type: 'ajax',
                    url: 'security/loadAllRoles.action',
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
                title: '角色列表',
                resizable: true,
                width: 400, 
                columns: [
                  {xtype: 'rownumberer'},
                  {text : '', dataIndex:'id', hidden: true},
                  {text : "角色名称" , dataIndex : 'name', sortable : true, width : 150, align : 'center'},
                  {text : "角色描述" , dataIndex : 'description',  flex:1, align : 'center'}             
                  ],
                tbar: [
                    {
                        text: '增加',
                        icon :'images/add.png',
                        iconCls :'save-icon',
                        handler: this.addNew,
                        scope: this
                    },
                    {
                        text: '删除',
                        icon :'images/cross.png',
                        iconCls :'save-icon',
                        handler: this.del,
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
        addNew : function()
        {
            loadRole(0);     
        },
        del : function()
        {

            var selection = this.getSelectionModel().getSelection();
            
            if(selection.length == 0 )
            {
                Ext.Msg.alert('<span style="font-weight: bold;font-size:12px;">！错误</span>', "请选择要删除的行");
                return;
            }
            
            var delDeptFun = function(buttonId, text, opt)
            {
                if(buttonId == "yes")
                {
                    smartOA.util.ajaxRequest(
                    {
                        url : 'security/delRole.action',
                        params : {'id': selection[0].raw.id},
                        success : function(r, o)
                        {
                            var obj = Ext.JSON.decode(r.responseText);
                            
                            if(obj.success == true) 
                            {
                                Ext.Msg.alert("删除成功", obj.message);
                                this.store.reload();                               
                            }else
                            {
                                Ext.Msg.alert("删除失败", obj.message);
                            }
                        }
                    }, this
                    );                
                }
            };
            
            Ext.Msg.show(
            {
               title : mbLocale.infoMsg,
               msg : mbLocale.delConfirmMsg,
               buttons : Ext.Msg.YESNO,
               scope : this,
               fn  : delDeptFun,
               icon :Ext.MessageBox.QUESTION
            });     
    
        },        
        refresh : function()
        {
            this.getStore().reload();
        }
    });
    
    var authorityListPanel = Ext.create('AuthorityListGridPanel',
    {
        flex: 1
    });       
    
    var roleForm = Ext.create('RoleEditForm');
    
    var roleEditPanel = Ext.create('Ext.panel.Panel',
                    {   
                        title: '角色权限编辑',
                        layout: {
                            type: 'vbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        flex:1,
                        items : [roleForm, authorityListPanel]
                    });  
                    
    var roleListPanel = Ext.create('RoleListGridPanel');
    
    var framePanel = Ext.create('Ext.panel.Panel',
                    {   
                        layout: {
                            type: 'hbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items : [roleListPanel, roleEditPanel]
                    });     
    
    roleListPanel.on('itemclick', function(object,record)
    {
        var data = record.getData();        
        loadRole(data.id);
    }
    );      
    
    var loadRole = function(roleId)
    {
        roleForm.getForm().trackResetOnLoad = true;    
        roleForm.getForm().load({
               url : 'security/loadRole.action',
               params:{'id': roleId},
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
        var store = authorityListPanel.getStore();
        
        store.loadData(obj.data.authList);        
        
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
        
        var selModel = authorityListPanel.getSelectionModel();
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