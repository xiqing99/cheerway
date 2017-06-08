//<script type="text/javascript">

Ext.namespace('smartOA.basicElem.framework');

Ext.define('smartOA.basicElem.framework.DepartmentTreePanel',
{
    extend : 'Ext.TreePanel',
    constructor : function()
    {              
        var store = Ext.create('Ext.data.TreeStore',
        {
            autoLoad: true,   
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadDeptTree.action',
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
            store : store,
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
    },
    openDetailsWin : function(productId)
    {
             smartOA.util.genWindow({
                    title    : '仓库设置',
                    loader: {
                            url: 'basicElem/editDept.js',
                            autoLoad: true,
                            scripts:true
                        },
                    width    : 440,
                    height   : 320,
                    maximizable: true,
                    layout   : 'fit',
                    resizable: true,
                    initId : productId,
                    store : this.store
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
            Ext.Msg.alert("错误", "请选择要编辑的部门");
            return;
        }
        
        this.openDetailsWin(selection[0].raw.id);
    },
    del : function()
    {
    	var selection = this.getSelectionModel().getSelection();
    	if(selection.length == 0 )
    	{
    		Ext.Msg.alert("错误", "请选择要删除的部门");
    		return;
    	}
    	
    	var store = selection[0].raw;
    	if(store.leaf == 'false')
    	{
    		Ext.Msg.alert("错误", "请先删除子部门");
    		return;
    	}
    	
    	var delStoreFun = function(buttonId, text, opt)
    	{
    		if(buttonId == "yes")
    		{
    			smartOA.util.ajaxRequest(
    			{
    				url : 'basicElem/delDept.action',
    				params : {'storeId': store.id},
    				success : function(r, o)
    				{
    					this.store.reload();
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


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side'
    
    console.log("onready" +
    		"");
    
    var panel = Ext.create('smartOA.basicElem.framework.DepartmentTreePanel');
    

   var vp = new Ext.Viewport({layout:'fit', items:[panel]});

    panel.on('itemdblclick', function(object,record)
    {
    	var data = record.getData();
    	
    	if(data.leaf == true)
            panel.edit();
    });

});
//</script>