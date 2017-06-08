//<script type="text/javascript">

Ext.define("stockMgt.OrderProgressPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    mytile : '订单进度报表',
    constructor : function(conf)
    {  
        Ext.define('OrderDetailModel',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'sequenceNum'},
                 {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'customerName'},
                 {name: 'deptName'},
                 {name: 'rspEmpName'},      
                 {name: 'deliverDeadLine', type:'date', dateFormat: 'Y-m-d'},
//                 {name: 'paymentDeadLine', type:'date', dateFormat: 'Y-m-d'},
//                 {name: 'ctgName'},
                 {name: 'modelNum'},
                 {name: 'subModelNum'},
                 {name: 'colorModel'},
                 {name: 'packageModel'},
                 {name: 'custModelNum'},
                 {name: 'quantity', type: 'float'},
                 {name: 'inStockQty', type: 'float'},
                 {name: 'outStockQty', type: 'float'}
            ]         
        }  
        );        
        
        
        Ext.apply(this, {
            dataModel: 'OrderDetailModel',     
            loadUrl: 'salesMgt/loadOrderDetailListByDeptAndCreatedDateRange.action',
            defaultCriteraId: smartOA.csn.getValue('DEPT_SALES_ROOT_ID'),
            searchField: 'sequenceNum',
            flex:1,
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : "订单编号" , dataIndex : 'sequenceNum', sortable : true, width : 120, align : 'center',filter:true              
              },             
              {text : "产品型号" , dataIndex : 'modelNum', sortable : true, width : 120, align : 'center',filter:true},
              {text : "子型号" , dataIndex : 'subModelNum', sortable : true, width : 120, align : 'center',filter:true,
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '总计: ';
                    } 
              },                  
              {text : "定制色号" , dataIndex : 'colorModel',  width : 80, align : 'center'},
              {text : "订单数量" , dataIndex : 'quantity', sortable : true, width : 100, align : 'center', summaryType: 'sum'},
              {text : "已完成数量" , dataIndex : 'inStockQty', sortable : true, width : 100, align : 'center',summaryType: 'sum',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        return "<p style='color:green'>"+data+"</p>";
                    },filter:true                
              },
              {text : "未完成数量" , dataIndex : 'inStockQty', sortable : true, width : 100, align : 'center',summaryType: 'sum',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var quantity = record.get('quantity');
                        return "<p style='color:red'>"+(quantity - data)+"</p>";;
                    },filter:true                
              },
              {text : "已发货数量" , dataIndex : 'outStockQty', sortable : true, width : 100, align : 'center',summaryType: 'sum',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        if(data > 0)
                            return "<p style='color:green'>"+data+"</p>";
                        else
                            return "<p style='color:red'>"+data+"</p>";
                    },filter:true               
              },
              {text : "包装方式" , dataIndex : 'packageModel',  width : 120, align : 'center'},
              {text : "客户型号" , dataIndex : 'custModelNum',  width : 100, align : 'center'},              
              {text : "客户" , dataIndex : 'customerName', sortable : true, width : 120, align : 'center',filter:true},
              {text : "订单日期" , dataIndex : 'createdDate', filter:true,
                renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},              
              {text : "业务员" , dataIndex : 'rspEmpName', sortable : true, width : 80, align : 'center',filter:true},
              {text : "交货期限" , dataIndex : 'deliverDeadLine',renderer: Ext.util.Format.dateRenderer('Y-m-d'), sortable : true, width : 100, align : 'center'}
//              {text : "付款期限" , dataIndex : 'paymentDeadLine',renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
//              {text : "产品类型" , dataIndex : 'ctgName', sortable : true, width : 120, align : 'center'}
              ]           

        });      

        this.callParent(arguments);
    }
  
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('stockMgt.OrderProgressPanel');       
             
    stockReportPanel.add(listPanel);

});
//</script>