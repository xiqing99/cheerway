//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    
    var listPanel = Ext.create('salesMgt.StoreSaleListPanel',
    {
        loadUrl: 'salesMgt/loadStoreSaleVchListByDeptAndCreatedDateRange.action',
        flex: 1
    });         
    
    var deptPanel = Ext.create('smartOA.commonClass.TreeListViewPanel',
    {
        width: 150,
        loadUrl: 'basicElem/loadDeptSubTree.action',
        rootId: 2,
        title: '业务部门列表'
    }    
    );

    var framePanel = Ext.create('Ext.panel.Panel',
            {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items : [deptPanel, listPanel]
            });        
 
    deptPanel.on('itemclick', function(object,record)
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