//<script type="text/javascript">

Ext.define('smartOA.stockMgt.StockTakenVchListPanel',
{   
    extend : "smartOA.commonClass.EditDateRangeGridPanel",
    inStock: '',
    constructor : function(conf)
    { 
        
        Ext.define('StockTakenVoucher',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'voucherId', type: 'int'},
                 {name: 'storeName'},
                 {name: 'sequenceNum'},
                 {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'state'},
                 {name: 'rspEmpName'},
                 {name: 'auditEmpName'},
                 {name: 'notes'},
                 {name: 'approvedTime',type:'date', dateFormat: 'Y-m-d'}
            ]         
        }  
        );     
        
        Ext.apply(this, {   
            loadUrl : 'stockMgt/loadStockTakenVchByStoreAndCreatedDateRange.action',
            delUrl: 'stockMgt/delStockTakenVch.action',
            title: '盘点单列表',            
            dataModel: 'StockTakenVoucher', 
            searchField: 'storeName',
            flex:1.5,
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'voucherId', hidden: true},
              {text : "单据日期" , dataIndex : 'createdDate', filter:true,
                renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 120, align : 'center'},              
              {text : "单据编号" , dataIndex : 'sequenceNum', sortable : true, width : 150, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '单据总数  :  ' + value;
                    }                 
              },
              {text : "单据状态" , dataIndex : 'state', sortable : true, width : 120, align : 'center',
                renderer:function(data)
                {
                    switch (data)
                    {
                        case 'PROPOSED':
                            return '未审核';
                        case 'AUDITED':
                            return '已审核';
                        case 'COMPLETED':
                            return '已完成';
                    }                        
                }
                },
                {text : "仓库名称" , dataIndex : 'storeName', sortable : true, width : 150, align : 'center'},
              {text : "负责人" , dataIndex : 'rspEmpName', sortable : true, width : 100, align : 'center'},
              {text : "审核人" , dataIndex : 'auditEmpName', sortable : true, width : 100, align : 'center'},
              {text : "审核日期" , dataIndex : 'approvedTime', filter:true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 120, align : 'center'},
              {text : "备注" , dataIndex : 'notes', sortable : true,  align : 'center',flex:1}
              ]
        }); 
        
        this.callParent(arguments); 
    },   
    openDetailsWin : function(id)
    {               
        smartOA.util.genWindow({
                loader: {
                        url: 'stockMgt/editStockTakenVch.js',
                autoLoad: true,
                scripts:true
            },
            title: '盘点单',
            initId : id,
            store : this.store
        });         
    }
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('smartOA.stockMgt.StockTakenVchListPanel');       
    
    var storePanel = Ext.create('smartOA.commonClass.TreeListViewPanel',
    {
        width: 160,
        loadUrl: 'basicElem/loadStoreTree.action',
        title: '仓库列表'      
    }    
    );

    var framePanel = Ext.create('Ext.panel.Panel',
            {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items : [storePanel, listPanel]
            });    
 
    storePanel.on('itemclick', function(object,record)
    {
        var data = record.getData();        
                 
        var proxy = listPanel.getStore().getProxy();
        
        Ext.apply(proxy, {
        extraParams : {'criteraId': data.id, 'startDate':Ext.util.Format.date(listPanel.getStartDate(), 'Y-m-d'), 
                'endDate':Ext.util.Format.date(listPanel.getEndDate(), 'Y-m-d')}
        });   
        
        listPanel.refresh();
                        
    }
    );       
 
    
    if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    } 

});
//</script>