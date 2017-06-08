//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('salesMgt.SalesReportPerProdPanel', 
            {loadUrl:'salesMgt/loadStSaleReportByProd.action'});    
      
    salesReportPanel.add(listPanel);

});

//</script>