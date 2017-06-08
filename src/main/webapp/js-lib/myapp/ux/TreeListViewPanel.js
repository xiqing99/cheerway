
Ext.define('js-lib.myapp.ux.TreeListViewPanel',
{
    extend : 'Ext.TreePanel',
    
    constructor : function(conf)
    {   
   
        var mystore = Ext.create('Ext.data.TreeStore',
        {
            autoLoad: true,   
            proxy: {
                type: 'ajax',
                url : conf.loadUrl,
                reader: {
                    type: 'json',
                    root : 'Children'
                },
                extraParams :{'id':conf.rootId}
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
            title: conf.title,
            resizable: true,
            store : mystore ,
//            collapsible: true,
            tbar: [
                {
                    text: mbLocale.refreshPage,
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: function()
                    {
                        mystore.reload();
                    },
                    scope: this
                }
                ] 
        });
   
        this.callParent(arguments);
    }
});