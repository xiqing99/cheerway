//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('salesMgt.SalesReportPerRspEmpPanel', 
            {loadUrl:'salesMgt/loadOrderReportByRspEmp.action', criteraId: smartOA.csn.getValue('DEPT_SALES_ROOT_ID')});    
      
    salesReportPanel.add(listPanel);

});

//</script>