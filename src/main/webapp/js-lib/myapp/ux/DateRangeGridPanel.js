
Ext.define('js-lib.myapp.ux.DateRangeGridPanel',
{
    extend : "Ext.grid.Panel",
    loadUrl: '',
    dataModel: '',    
    startDateByMonth:false,
    defaultCriteraId: 1,
    constructor : function()
    {                    
        var endDate = new Date();
        var startDate = new Date();
        
        if(this.startDateByMonth)
        {
            startDate.setMonth(endDate.getMonth() -1);
            startDate.setDate(26);
        }else
        {
            startDate.setFullYear(endDate.getFullYear(), 0, 1);                 
        }
        var myStore = Ext.create('Ext.data.Store', {
            model : this.dataModel,            
            proxy: {
                type: 'ajax',
                url: this.loadUrl,
                timeout: 60000,
                reader: {
                    type: 'json'
                },
                extraParams : {'criteraId':this.defaultCriteraId, 'startDate':Ext.util.Format.date(startDate, 'Y-m-d'), 
                'endDate':Ext.util.Format.date(endDate, 'Y-m-d')}                
            },
            autoLoad : false,
            autoSync: false
        });         
        
        myStore.getProxy().on('exception', function(store, rsp, oper, eOpts)
        {
            if(rsp.timedout)
            {
                Ext.Msg.alert("加载失败", '    服务器超时, 请缩小查询时间范围!');
            }
            console.log(rsp);
            
        });
        
        myStore.on('load', function(store, records, successful, eOpts)
        {
            console.log(records.length);
            
            if(records.length == 0)
            {
                Ext.Msg.alert("加载成功", '所查询的数据为空!');
            }
        }
        );
        
        Ext.apply(this, {
            columnLines : true,
            store: myStore,
            autoScroll:true,
            frame : false,    
            flex:1,
            selType: 'rowmodel',
//            resizable: true,
            tbar: [
 /*               {
                    text: mbLocale.refreshPage,
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: this.refresh,
                    scope: this
                },*/
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
                },                 
                '->',
                {
                    xtype: 'datefield',
                    fieldLabel: '起始时间  :',
                    name: 'startdt',
                    format: 'Y-m-d',
                    width: 190,
                    labelWidth: 70,
                    value:startDate
                }, 
                {
                    xtype: 'datefield',
                    fieldLabel: '结束',
                    name: 'enddt',
                    format: 'Y-m-d',
                    value : endDate,
                    width: 160,
                    labelWidth: 40
                },
                {
                    xtype: 'button',
                    text:'加载数据',
                    icon :'images/magnifier.png',                                       
                    iconCls :'save-icon',                    
                    handler: this.loadData,
                    scope: this                   
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
                    local: true,
                    filters : [
                    {
                        type : 'date',
                        dataIndex : 'createdDate',
                        dateFormat : 'Y-m-d'
                    }                    
                    ]                    
                },
                {
                     ftype: 'summary'
                }
                ]
        });
        
        console.log("constructor");
        this.callParent(arguments);              
    },     
    loadData: function()
    {
        var gridPanel = this;
        
        var startDate = gridPanel.down('field[name=startdt]').getValue();
        var endDate = gridPanel.down('field[name=enddt]').getValue();

        if(endDate.getTime() < startDate.getTime())
        {
            Ext.Msg.alert("请重新选择时间", "  结束日期不能小于开始日期!");
            return;
        }
        
        var store =  gridPanel.getStore();
        store.getProxy().setExtraParam('startDate', Ext.util.Format.date(startDate, 'Y-m-d'));
        store.getProxy().setExtraParam('endDate', Ext.util.Format.date(endDate, 'Y-m-d'));
        store.reload();        
    },
    refresh: function()
    {
        this.store.reload();
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