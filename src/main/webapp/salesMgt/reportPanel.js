//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';

    var menuPanel = Ext.create('smartOA.commonClass.TreeListViewPanel',
    {
        width: 200,
        loadUrl: 'salesMgt/loadReportMenu.action',
        title: '报表目录'      
    }    
    );    
    
    salesReportPanel = new Ext.Panel({
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
                items : [menuPanel, salesReportPanel]
            });    

    menuPanel.on('itemclick', function(object,record)
    {
        var data = record.getData();        
        
        if(data.leaf == false)
            return;
        
        framePanel.remove(salesReportPanel, true);
        
        salesReportPanel = new Ext.Panel({
                    layout: 'fit',
                    flex:1,
                    frame : false,
                    loader: {
                    url: data.id,
                    autoLoad: true,
                    scripts:true
                    },
                    border:false
                });  
        framePanel.add(salesReportPanel);
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