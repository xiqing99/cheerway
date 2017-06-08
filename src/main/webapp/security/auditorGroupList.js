//<script type="text/javascript">


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    Ext.define("EmpGenListPanel",
    {   
        extend : "Ext.grid.Panel",
        constructor : function()
        {                                    
            Ext.define('EmpGenInfo', {
                 extend: 'Ext.data.Model',
                 fields: [
                     {name: 'id', type: 'int'},
                     {name: 'name', type: 'string'},
                     {name: 'deptName'},
                     {name: 'posName'},
                     {name: 'email',  type: 'string'}
                 ]
             });        
            
             var myStore = Ext.create('Ext.data.Store', {
                model : EmpGenInfo,            
                autoLoad : false,
                autoSync: false
            });    
             
            Ext.apply(this, {      
                columnLines : true,
                store: myStore,
                autoScroll:true,
                frame : false,   
                title: '组内员工列表',
                resizable: false,
                width: 400, 
                columns: [
                  {xtype: 'rownumberer'},
                  {text : '', dataIndex:'id', hidden: true},
                  {text : "姓名" , dataIndex : 'name', sortable : true, width : 150, align : 'center'
                  },
                  {text : "部门" , dataIndex : 'deptName', sortable : true, width : 150, align : 'center'
                  },
                  {text : "职位" , dataIndex : 'posName',  sortable : true, filter:true, width : 150, align : 'center'},
                  {text : "邮箱" , dataIndex : 'email', sortable : true, align : 'center', flex:1}
                  ],            
                selType: 'rowmodel',
                tbar: [         
                    {
                        text: '添加用户',
                        icon :'images/add.png',
                        iconCls :'add-icon',
                        handler: this.addEmp,
                        scope: this
                    },
                    {
                        text: '删除用户',
                        icon :'images/cross.png',
                        iconCls :'save-icon',
                        handler: this.delEmp,
                        scope: this
                    }
                ]
            });
            
            this.callParent(arguments);
        },
        addEmp: function()
        {
            smartOA.util.genWindow({
                            title: '选择员工',    
                            loader: {
                                    url: 'security/selectEmp.js',
                                    autoLoad: true,
                                    scripts:true                                   
                                },
                            width    : 680,
                            height   : 450,
                            maximizable: true,
                            modal: true,
                            layout   : 'fit',
                            resizable: true,                    
                            store : this.getStore()
                        });
        },
        delEmp: function()
        {
            var selection = this.getSelectionModel().getSelection();
            
            if(selection.length == 0 )
            {
                Ext.Msg.alert('<span style="font-weight: bold;font-size:12px;">！错误</span>', "请选择要删除的行");
                return;
            }
            
            this.getStore().remove(selection);
        }
    }); 
    
    Ext.define('GroupEditForm',
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
                    fieldLabel: '用户组名称',
                    name: 'entity.name',
                    allowBlank:false,
                    margins: '2 0 0 5',
                    flex:1,
                    readOnly: true
                    
                },
                {
                    xtype : 'textfield',
                    fieldLabel: '用户组描述',
                    name: 'entity.description',
                    allowBlank:true,
                    margins: '2 0 0 40',
                    flex:2,
                    readOnly: true
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
            var store = empListPanel.getStore();
            var empList = new Array();
            for(var i = 0; i< store.getCount();i++)
            {
                 var data = store.getAt(i).data;
                 empList.push({id:data.id});
            }
            
            var form = this.getForm();
            var formPanel = this;
            
            if(form.isValid())
            {
                form.submit({
                url: 'security/saveGroup.action',
                method: 'POST',
                disabled:true,
                waitMsg: mbLocale.waitingMsg,
                params : {
                    'itemListsJson' : Ext.encode(empList)
                },
                success: function(form, action) {         
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
        },
        refresh: function()
        {
            
        }
    });
    
    
    Ext.define("GroupListGridPanel",
    {   
        extend : "Ext.grid.Panel",
        tile : ' 权限组列表',
        constructor : function()
        {                                    
            Ext.define('GroupModel',{
                 extend : 'Ext.data.Model',
                fields: [
                     {name: 'id', type: 'int'},
                     {name: 'name'}
                ]         
            }  
            );
         
            var myStore = Ext.create('Ext.data.Store', {
                model : GroupModel,            
                proxy: {
                    type: 'ajax',
                    url: 'security/loadAllGroups.action',
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
                resizable: true,
                width: 300, 
                columns: [
                  {xtype: 'rownumberer'},
                  {text : '', dataIndex:'id', hidden: true},
                  {text : "操作组名称" , dataIndex : 'name', sortable : true, width : 150, align : 'center',flex:1}          
                  ],
                tbar: [         
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
        refresh : function()
        {
            this.getStore().reload();
        }
    });
    
    var empListPanel = Ext.create('EmpGenListPanel',
    {
        flex: 1
    });       
    
    var groupForm = Ext.create('GroupEditForm');
    
    var groupEditPanel = Ext.create('Ext.panel.Panel',
                    {   
                        title: '权限组编辑',
                        layout: {
                            type: 'vbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        flex:1,
                        items : [groupForm, empListPanel]
                    });  
                    
    var groupListPanel = Ext.create('GroupListGridPanel');
    
    var framePanel = Ext.create('Ext.panel.Panel',
                    {   
                        layout: {
                            type: 'hbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items : [groupListPanel, groupEditPanel]
                    });     
    
    groupListPanel.on('itemclick', function(object,record)
    {
        var data = record.getData();        
        loadGroup(data.id);
    }
    );      
    
    var loadGroup = function(groupId)
    {
        groupForm.getForm().trackResetOnLoad = true;    
        groupForm.getForm().load({
               url : 'security/loadGroup.action',
               params:{'id': groupId},
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
        var store = empListPanel.getStore();
        
        store.loadData(obj.data.empList);        
    }
    
   if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    }
});
//</script>