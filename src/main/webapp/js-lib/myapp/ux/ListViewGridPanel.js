
Ext.define('js-lib.myapp.ux.ListViewGridPanel',
{
    extend : "Ext.grid.Panel",
    loadUrl: '',
    dataModel: '',    
    constructor : function(conf)
    {                                

        var myStore = Ext.create('Ext.data.Store', {
            model : this.dataModel,            
            proxy: {
                type: 'ajax',
                url: this.loadUrl,
                reader: {
                    type: 'json'
                }            
            },
            autoLoad : false,
            autoSync: false
        });         
        
        Ext.apply(this, {
            columnLines : true,
            store: myStore,
            autoScroll:true,
            frame : false,                      
            selType: 'rowmodel',
            tbar: [
                {
                    text: '加载数据',
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: this.refresh,
                    scope: this
                },
                {
                    text: '导出到Excel',
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: function(btn)
                    {
                       btn.up('grid').downloadExcelXml(); 
                    }
                },
                {
                    text: '打印表单',
                    icon :'images/printer.png',
                    iconCls :'save-icon',
                    handler: function(btn)
                    {
                       var grid = btn.up('grid');
                       Ext.ux.grid.VchPrinter.printAutomatically = false;
                       Ext.ux.grid.VchPrinter.print(grid);
                    }
                }                
                ],
                bbar: new Ext.PagingToolbar(
                {
//                    store : myStore,
                    pageSize : 1                    
                }),
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
                },
                {
                    id: 'group',
                    ftype: 'groupingsummary',
                    groupHeaderTpl: '{name}'                 
                },
                {
                    ftype: 'filters',
                    local: true      
                }             
                ]
        });
        
        this.callParent(arguments);              
    },  
    refresh: function()
    {
        this.store.reload();
    }
});