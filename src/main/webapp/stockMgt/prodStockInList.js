//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    
    var listPanel = Ext.create('stockMgt.ProdStockInListPanel',
    {
        loadUrl: 'stockMgt/loadProdInstockVchByStoreAndCreatedDateRange.action'
    });       
    

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