//<script type="text/javascript">

Ext.define("smartOA.accountMgt.OverduePerCustListGridPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    constructor : function()
    { 
        
        Ext.define('RsvbDuedAmountPerCust',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'id', type: 'int'},
                 {name: 'custName'},
                 {name: 'currencyName'},         
                 {name: 'totalAmount', type: 'float'}
            ]         
        }  
        );        
        
        
        
        Ext.apply(this, {         
            loadUrl: 'accountMgt/loadOverduePerCust.action',
            editUrl: '',
            dataModel: 'RsvbDuedAmountPerCust',  
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : "客户名称" , dataIndex : 'custName', sortable : true, width : 180, align : 'center'},
              {text : "结算货币" , dataIndex : 'currencyName', sortable : true, width : 180, align : 'center'
              },
              {text : "金额" , dataIndex : 'totalAmount', sortable : true, width : 180, align : 'center',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }              
              }
              ]           
        });
        
        this.callParent(arguments);
        
        this.down('field[name=startdt]').disable();
        
        this.getStore().reload();
         
    }
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('smartOA.accountMgt.OverduePerCustListGridPanel');         
    
    accountReportPanel.add(listPanel);

});
//</script>