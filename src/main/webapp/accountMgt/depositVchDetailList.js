//<script type="text/javascript">

Ext.define("smartOA.accountMgt.DepositDetailListGridPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    mytile : '预付款单详细列表',
    constructor : function()
    {  
        
        Ext.define('DepositVoucherDetail',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'voucherId', type: 'int'},
                 {name: 'custName'},
                 {name: 'sequenceNum'},
                 {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'state'},
                 {name: 'currencyName'}, 
                 {name: 'rspEmpName'},
                 {name: 'auditEmpName'},
                 {name: 'amount', type: 'number'},
                 {name: 'approvedTime',type:'date', dateFormat: 'Y-m-d'},
                 {name: 'saleVchSeqNum'}
            ]         
        }  
        );         
        
        
        Ext.apply(this, {
        
            title : this.mytile,
            dataModel: 'DepositVoucherDetail',     
            loadUrl: 'accountMgt/loadDepositVoucherDetailListByCreatedDateRange.action',
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'voucherId', hidden: true},
              {text : "单据日期" , dataIndex : 'createdDate', filter:true,
                renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},              
              {text : "单据编号" , dataIndex : 'sequenceNum', sortable : true, width : 120, align : 'center'              
              },
              {text : "单据状态" , dataIndex : 'state', sortable : true, width : 80, align : 'center',
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
                {text : "客户名称" , dataIndex : 'custName', sortable : true, width : 120, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '订单数  :  ' + value;
                    } 
                },
              {text : "结算货币" , dataIndex : 'currencyName',  width : 80, align : 'center'},
              {text : "订单号" , dataIndex : 'saleVchSeqNum',  width : 120, align : 'center'},
              {text : "金额" , dataIndex : 'amount', sortable : true, width : 150, align : 'center',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                        if(currency === '人民币')
                            return Ext.util.Format.currency(data, '¥');
                            
                        return Ext.util.Format.usMoney(data);
                    }             
              },  
              {text : "负责人" , dataIndex : 'rspEmpName', sortable : true, width : 80, align : 'center'},
              {text : "审核人" , dataIndex : 'auditEmpName', sortable : true, width : 80, align : 'center'},
              {text : "审核日期" , dataIndex : 'approvedTime', filter:true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
              {text : "备注" , dataIndex : 'notes', sortable : true,  align : 'center',flex:1}
              ]           

        });      
        
        this.callParent(arguments);
    }
  
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    
    var listPanel = Ext.create('smartOA.accountMgt.DepositDetailListGridPanel');      
    
    accountReportPanel.add(listPanel);

});
//</script>