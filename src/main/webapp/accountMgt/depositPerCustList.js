//<script type="text/javascript">

Ext.define("smartOA.accountMgt.DepositPerCustListGridPanel",
{   
    extend : "smartOA.commonClass.ListViewGridPanel",
    tile : '预收款结余',
    constructor : function()
    { 
        
        Ext.define('DepositPerCust',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'id', type: 'int'},
                 {name: 'custName'},
                 {name: 'currencyName'},         
                 {name: 'depositAmount', type: 'float'}
            ]         
        }  
        );        
        
        Ext.apply(this, {         
            loadUrl: 'accountMgt/loadDepositAmountPerCustList.action',
            editUrl: '',
            dataModel: 'DepositPerCust',  
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : "客户名称" , dataIndex : 'custName', sortable : true, width : 180, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '单据总数  :  ' + value;
                    }   
              },
              {text : "结算货币" , dataIndex : 'currencyName', sortable : true, width : 180, align : 'center'
              },
              {text : "剩余金额" , dataIndex : 'depositAmount', sortable : true, width : 180, align : 'center',
                    renderer:function(value, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                        if(currency === '人民币')
                            return Ext.util.Format.currency(value, '¥');
                            
                        return Ext.util.Format.usMoney(value);
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ? value : 0);
                    }
              }
              ]           
        });
        
        this.callParent(arguments);
        
        this.getStore().reload();;
         
    }
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('smartOA.accountMgt.DepositPerCustListGridPanel');         
    
    accountReportPanel.add(listPanel);

});
//</script>