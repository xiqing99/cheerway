//<script type="text/javascript">

Ext.define('smartOA.salesMgt.orderModel',{
     extend : 'Ext.data.Model',
    fields: [
         {name: 'voucherId', type: 'int'},
         {name: 'sequenceNum'},
         {name: 'customerOrderNum'},
         {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
         {name: 'state'},
         {name: 'customerName'},
         {name: 'customerArea'},
         {name: 'rspEmpName'},
         {name: 'merEmpName'},
         {name: 'deptName'},
         {name: 'currencyName'},  
         {name: 'containerNum', type: 'float'},
         {name: 'totalPrice', type: 'float'},
         {name: 'totalPriceInCn', type: 'float'},
         {name: 'totalExtraProfitInCn', type: 'float'},
         {name: 'deliverDeadLine', type:'date', dateFormat: 'Y-m-d'},
         {name: 'paymentDeadLine', type:'date', dateFormat: 'Y-m-d'}                 
    ]         
}  
);

Ext.define("salesMgt.OrderListPanel",
{   
    extend : "smartOA.commonClass.EditDateRangeGridPanel",
    mytile : '订单列表',
    constructor : function(conf)
    {       
        Ext.apply(this, {         
            title : this.mytile,
            loadUrl: conf.loadUrl,
            delUrl: 'salesMgt/delOrder.action',
            editUrl: 'salesMgt/editOrder.js',
            dataModel: 'smartOA.salesMgt.orderModel',
            defaultCriteraId: smartOA.csn.getValue('DEPT_SALES_ROOT_ID'),
            searchField: 'customerName',
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'voucherId', hidden: true},
              {text : "订单编号" , dataIndex : 'sequenceNum', sortable : true, width : 120, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '订单数  :  ' + value;
                    }                 
              },
              {text : "订单日期" , dataIndex : 'createdDate', filter:true,
              renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
              {text : "订单状态" , dataIndex : 'state', sortable : true, width : 100, align : 'center',
                renderer:function(data)
                {
                    switch (data)
                    {
                        case 'PROPOSED':
                            return '未审核';
                        case 'FL_AUDITED':
                            return '业务已审核';
                        case 'AUDITED':
                            return '财务已审核';
                        case 'COMPLETED':
                            return '已完成';
                        case 'CANCELLED':
                            return '已取消';
                    }                        
                }, filter:true
                },
              {text : "客户" , dataIndex : 'customerName', sortable : true, width : 120, align : 'center', filter:true},
              {text : "负责部门" , dataIndex : 'deptName', sortable : true, width : 100, align : 'center', filter:true},
              {text : "业务员" , dataIndex : 'rspEmpName', sortable : true, width : 80, align : 'center', filter:true},
              {text : "跟单员" , dataIndex : 'merEmpName', sortable : true, width : 80, align : 'center', filter:true},
              {text : "货柜量" , dataIndex : 'containerNum', sortable : true, width : 80, align : 'center', filter:true, summaryType: 'sum'},
              {text : "结算货币" , dataIndex : 'currencyName', sortable : true, width : 80, align : 'center'},
              {text : "订单总额" , dataIndex : 'totalPrice', sortable : true, width : 120, align : 'center',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }
              },
              {text : "订单总额(¥)" , dataIndex : 'totalPriceInCn', sortable : true, width : 120, align : 'center',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0);
                    }               
              },    
              {text : "额外利润(¥)" , dataIndex : 'totalExtraProfitInCn', sortable : true, width : 120, align : 'center',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0);
                    }               
              },              
              {text : "交货期限" , dataIndex : 'deliverDeadLine',renderer: Ext.util.Format.dateRenderer('Y-m-d'), sortable : true, width : 100, align : 'center', filter:true},
              {text : "付款期限" , dataIndex : 'paymentDeadLine',renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center', filter:true},
              {text : "客户地区" , dataIndex : 'customerArea', sortable : true, width : 100, align : 'center', filter:true}
              ]           
        });
        
        this.callParent(arguments);     
        
    },
    openDetailsWin : function(id)
    {
             smartOA.util.genWindow({
                    title    : '订单编辑',
                    loader: {
                            url: this.editUrl,
                            autoLoad: true,
                            scripts:true
                        },
                    initId : id,
                    store : this.store
                });         
    }
});

//</script>