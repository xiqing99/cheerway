//<script type="text/javascript">


Ext.define("js-lib.myapp.ux.EditDateRangeGridPanel",
{   
    extend : "js-lib.myapp.ux.DateRangeGridPanel",
    delUrl: '',
    editUrl: '',
    addMenu: null,
    constructor : function(conf)
    {                          
        console.log("constructor");
        this.callParent(arguments);
        
        var tbar = this.getDockedItems('toolbar[dock="top"]')[0];
        
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
                    name: 'addNewBtn',
                    handler: this.addMenu ? null: this.addNew,
                    menu: this.addMenu ? this.addMenu: null,
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
            Ext.Msg.alert("错误", "请选择要编辑的单据");
            return;
        }       

        this.openDetailsWin(selection[0].raw.voucherId);
              
    },
    delSelected : function()
    {
        var panel = this;
        
        var selection = this.getSelectionModel().getSelection();
        
        if(selection.length == 0 )
        {
            Ext.Msg.alert('<span style="font-weight: bold;font-size:12px;">错误</span>', "请选择要删除的单据");
            return;
        }
        
        var order = selection[0].raw;
        
        if(order.state !== 'PROPOSED')
         {
            Ext.Msg.alert('<span style="font-weight: bold;font-size:12px;">错误</span>', "不能删除已审核/完成单据");
            return;
        }       
        
        var delDeptFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                smartOA.util.ajaxRequest(
                {
                    url : panel.delUrl,
                    params : {'id': order.voucherId},
                    success : function(r, o)
                    {
                        var obj = Ext.JSON.decode(r.responseText);
                        
                        if(obj.success == true) 
                        {
                            Ext.Msg.alert("删除成功", obj.message);
                            this.store.reload();
                        }else
                        {
                           Ext.Msg.alert('删除失败', obj.message);
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
        this.getSelectionModel().deselectAll();
    },
    getStartDate: function()
    {
       return this.down('field[name=startdt]').getValue();
    },
    getEndDate: function()
    {
        return this.down('field[name=enddt]').getValue();
    }    
});
//</script>