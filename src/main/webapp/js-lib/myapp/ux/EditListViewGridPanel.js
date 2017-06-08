
Ext.define('js-lib.myapp.ux.EditListViewGridPanel',
{
    extend : "js-lib.myapp.ux.ListViewGridPanel",
    delUrl : '',
    loadDisabledUrl: '',   
    constructor : function(conf)
    {                                              
        this.callParent(arguments);      

        var tbar = this.getDockedItems('toolbar[dock="top"]')[0];
        
        tbar.insert(0, {
                    text: '停用列表',
                    handler: this.loadDisabledList,
                    scope: this
                });     
                
        tbar.insert(0, '-');
        
        tbar.insert(0, {
                    text: mbLocale.deleteItem,
                    icon :'images/cross.png',
                    iconCls :'save-icon',
                    handler: this.delSelected,
                    scope: this
                });       
                
        tbar.insert(0, {
                    text: mbLocale.editItem,
                    icon :'images/application_edit.png',
                    iconCls :'delete-icon',
                    handler: this.edit,
                    scope: this
                });                 
                
        tbar.insert(0, {
                    text:mbLocale.addNewItem,
                    icon :'images/add.png',
                    iconCls :'add-icon',
                    handler: this.addNew,
                    scope: this
                });          
        
        
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
    openDetailsWin : function(id)
    {
        
    },
    addNew : function()
    {
        this.openDetailsWin(0);
    },
    edit : function()
    {
        var selection = this.getSelectionModel().getSelection();
        
        if(selection.length == 0 )
        {
            Ext.Msg.alert('<span style="font-weight: bold;font-size:12px;">！错误</span>', "请选择要修改的行");
            return;
        }       

        this.openDetailsWin(selection[0].raw.entityId);
              
    },
    delSelected : function()
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
                    url : this.delUrl,
                    params : {'id': selection[0].raw.entityId},
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
    loadDisabledList: function()
    {
        var proxy = this.store.getProxy();
        
        Ext.apply(proxy, {
        url : this.loadDisabledUrl,
        extraParams : {}
        });
        
        this.store.reload();
    },      
    refresh: function()
    {
        this.store.reload();
    }
});