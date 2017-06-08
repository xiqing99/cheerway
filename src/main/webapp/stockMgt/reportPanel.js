//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
 /*   
    var store = Ext.create('Ext.data.TreeStore', {
        root: {
            expanded: true,
            children: [
                { text: "库存进出报表", expanded: true, children: [
                    { text: "库存进出多月报表", leaf: true }
                ] },
                { text: "库存单据明细表",  children: [
                    { text: "入库单明细表", leaf: true, id:'stockMgt/inStockVoucherDetailList.js'},
                    { text: "出库单明细表", leaf: true, id:'stockMgt/outStockVoucherDetailList.js' }
                ] }
            ]
        }
    });
    
    var menuPanel = Ext.create('Ext.tree.Panel', {
        title: '报表目录',
        width: 200,
        resizable: true,
//        flex: 1,
        store: store,
        rootVisible: false
    });                 
*/
    var menuPanel = Ext.create('smartOA.commonClass.TreeListViewPanel',
    {
        width: 200,
        loadUrl: 'stockMgt/loadReportMenu.action',
        title: '报表目录'      
    }    
    );    
    
    stockReportPanel = new Ext.Panel({
                    layout: 'fit',
                    flex:1,
                    border:false
                });      
    
    var framePanel = Ext.create('Ext.panel.Panel',
            {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items : [menuPanel, stockReportPanel]
            });    

    menuPanel.on('itemclick', function(object,record)
    {
        var data = record.getData();        
        
        if(data.leaf == false)
            return;
        
        framePanel.remove(stockReportPanel, true);
        
        stockReportPanel = new Ext.Panel({
                    layout: 'fit',
                    flex:1,
                    loader: {
                    url: data.id,
                    autoLoad: true,
                    scripts:true
                    },
                    border:false
                });  
        framePanel.add(stockReportPanel);
        framePanel.doLayout();
        
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