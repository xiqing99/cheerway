
Ext.define('js-lib.myapp.ux.EditTreeViewPanel',
{
    extend : 'Ext.TreePanel',
    loadUrl : '',
    editJs : '',
    delUrl : '',
    itemName : '',
    constructor : function(conf)
    {   
   
        var store = Ext.create('Ext.data.TreeStore',
        {
            autoLoad: true,   
            proxy: {
                type: 'ajax',
                url : conf.loadUrl,
                reader: {
                    type: 'json',
                    root : 'Children'
                }
            },
            root: {
            text : 'allModulesRoot',        
            expanded: true
           } 
        });       
    
        Ext.apply(this,
        {
            rootVisible:false,
            autoScroll:true,
            store : store ,
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
                    handler: this.del,
                    scope: this
                }
                ] 
        });
   
        this.callParent(arguments);
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
                        text: mbLocale.editItem,
                        icon :'images/application_edit.png',
                        iconCls :'delete-icon',
                        handler:function(){  
                            panel.edit();  
                        }  
                    
                },
                {
                        text:mbLocale.addNewItem,
                        icon :'images/add.png',
                        iconCls :'add-icon',
                        handler:function(){  
                            panel.addNew();  
                        }  
                },                
                {
                        text: mbLocale.deleteItem,
                        icon :'images/cross.png',
                        iconCls :'save-icon',
                        handler:function(){  
                            panel.del();  
                        }  
                },
                {
                        text: mbLocale.refreshPage,
                        icon :'images/arrow_refresh.png',
                        iconCls :'save-icon',
                        handler:function(){  
                            panel.refresh();  
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
             smartOA.util.genWindow({
                    title    : this.itemName +'设置',
                    loader: {
                            url: this.editJs,
                            autoLoad: true,
                            scripts:true
                        },
                    width    : 440,
                    height   : 320,
                    maximizable: true,
                    modal: true,
                    layout   : 'fit',
                    resizable: true,
                    initId : id,
                    parentStore : this.store
                });         
    },        
    addNew : function()
    {
         this.openDetailsWin(0);
    },
    edit :function()
    {
        var selection = this.getSelectionModel().getSelection();
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要编辑的"+this.itemName);
            return;
        }
        
        this.openDetailsWin(selection[0].data.id);
    },
    del : function()
    {
        var selection = this.getSelectionModel().getSelection();
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要删除的"+this.itemName);
            return;
        }

        if(selection[0].data.leaf == false)
        {
            Ext.Msg.alert("错误", "请先删除子"+this.itemName);
            return;
        }
        
        var delStoreFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                smartOA.util.ajaxRequest(
                {
                    url : this.delUrl,
                    params : { 'id' : selection[0].data.id},
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
           fn  : delStoreFun,
           icon :Ext.MessageBox.QUESTION
        });
        
    },
    refresh : function()
    {
        this.store.reload();
    }
});