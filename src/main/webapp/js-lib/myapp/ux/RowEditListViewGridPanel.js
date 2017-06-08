
Ext.define('js-lib.myapp.ux.RowEditListViewGridPanel',
{   
    extend : "Ext.grid.Panel",
    dataModel:'',
    loadUrl : '',
    saveUrl : '',
    delUrl : '', 
    isAutoLoad: true,
    constructor : function(conf)
    {           
         var myStore = Ext.create('Ext.data.Store', {
             model: this.dataModel,
             proxy: {
                 type: 'ajax',
                 url: conf.loadUrl,
                 reader: {
                     type: 'json',
                     root: 'lists'
                 }
             },
             autoLoad: this.isAutoLoad,
             autoSync: false
         });    
        
        Ext.apply(this, {
            autoScroll:true,
            columnLines : true,
            frame : false, 
            store : myStore,         
            plugins: [
                Ext.create('Ext.grid.plugin.RowEditing', {
                triggerEvent: 'celldblclick',
                autoCancel: false,
                pluginId : 'rowEditPlugin'
                })
            ],
            selType: 'rowmodel',
            tbar: [{
                    text:mbLocale.addNewItem,
                    icon :'images/add.png',
                    iconCls :'add-icon',
                    handler: this.addNew,
                    scope: this
               },{
                    text: mbLocale.editItem,
                    icon :'images/application_edit.png',
                    iconCls :'delete-icon',
                    handler: this.edit,
                    scope: this
                },
                {
                    text: mbLocale.deleteItem,
                    icon :'images/cross.png',
                    iconCls :'save-icon',
                    handler: this.delSelected,
                    scope: this
                },
                {
                    text: mbLocale.refreshPage,
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: this.refresh,
                    scope: this
                }
                ] 
        });
       
        this.callParent(arguments);
        this.regSaveFun(conf.saveUrl);
    },
    listeners:{
        itemdblclick : function(view, record, item, index, e)
        {      
            this.edit();
        },
        itemContextmenu: function( view, record, item, index, e, eOpts )
        {
            var panel = this;     
            
            var contextMenu =  Ext.create('Ext.menu.Menu', {
                        width : 20,
                        items: [{                
                                    text: mbLocale.addNewItem,
                                    icon :'images/application_edit.png',
                                    iconCls :'save-icon',
                                    handler:function(){  
                                        panel.addNew();  
                                    }
                                },
                                {                
                                    text: mbLocale.editItem,
                                    icon :'images/application_edit.png',
                                    iconCls :'delete-icon',
                                    handler:function(){  
                                        panel.edit();  
                                    }  
                            
                                },{
                                    text: mbLocale.deleteItem,
                                    icon :'images/cross.png',
                                    iconCls :'save-icon',
                                    handler:function(){  
                                        panel.delSelected();  
                                    }  
                        }]
                });
                
            e.stopEvent();
            contextMenu.showAt(e.getXY());
            return false;
        }
    },    
    addNew : function()
    {
        var rowEditor = this.getPlugin('rowEditPlugin');
        
        rowEditor.cancelEdit();
        
        var record = Ext.create(this.dataModel);
        
        this.getStore().insert(0, record);
        rowEditor.startEdit(0,0);
    },
    edit : function()
    {
        var rowEditor = this.getPlugin('rowEditPlugin');
        
        var selection = this.getSelectionModel().getSelection();
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要编辑的行");
            return;
        }        
        
        rowEditor.startEdit(selection[0].index, 0);
        
    },
    delSelected : function()
    {
        var model = this.getSelectionModel( );
        var selection = model.getSelection();
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要删除的行");
            return;
        }       
        
        var delDeptFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                smartOA.util.ajaxRequest(
                {
                    url : this.delUrl,
                    params : {'id': selection[0].raw.id},
                    success : function(r, o)
                    {
                        var obj = Ext.JSON.decode(r.responseText);
                        
                        if(obj.success == true) 
                        {
                            Ext.Msg.alert("成功", obj.message);
                            this.store.reload();
                        }else
                        {
                            Ext.Msg.alert('失败', obj.message);
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
    refresh: function()
    {
        this.store.reload();
    },
    regSaveFun : function(saveUrl)
    {
        var rowEditor = this.getPlugin('rowEditPlugin');
        rowEditor.on('edit', function(editor, context, e) 
        {
            context.record.commit();
            var item = context.record.data;
            
            
            smartOA.util.ajaxRequest(
            {
                url : saveUrl,
                params : {'entity.id': item.id, 'entity.name':item.name, 'entity.description':item.description},
                success : function(r, o)
                {
                    Ext.Msg.alert('成功', '保存成功');
                    this.getCmp().refresh();
                }
            }, this
            );  
           
        });
    }
});