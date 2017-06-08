//<script type="text/javascript">

Ext.define("smartOA.stockMgt.ReportSMonthGridPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    tile : '库存报表',
    constructor : function()
    {                                    
        Ext.define('ReportModel',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'prodCtgName'},
                 {name: 'prodModelNum'},
                 {name: 'subModelNum'},
                 {name: 'prodUnit'},
                 {name: 'unitPrice', type: 'float'},
                 {name: 'instockQty', type: 'float'},
                 {name: 'outstockQty', type: 'float'},
                 {name: 'endStockQty', type: 'float'},
                 {name: 'beginStockQty', type: 'float'},
                 {name: 'stockTakenQty', type: 'float'},
                 {name: 'stockRtQty', type: 'float'},
                 {name: 'totalPrice', type: 'float'}
            ]         
        }  
        );
        
        
        Ext.apply(this, {      
            loadUrl: "stockMgt/loadStockReportSingleMonth.action",
            startDateByMonth: true,
            dataModel: 'ReportModel', 
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'stockTakenQty', hidden: true},
              {text : "产品类别" , dataIndex : 'prodCtgName', sortable : true, width : 120, align : 'center', filterable: true},  
              {text : "产品型号" , dataIndex : 'prodModelNum', filter:true, sortable : true,  width : 120, align : 'center', filterable: true},
              {text : "子型号" , dataIndex : 'subModelNum', filter:true, sortable : true, width : 120, align : 'center', filterable: true},
              {text : "产品单位" , dataIndex : 'prodUnit', width : 100, align : 'center'},
              {text : "期初结存" , dataIndex : 'subModelNum', sortable : true, width : 100, align : 'center',filterable: true,
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        return(record.get('endStockQty') - record.get('instockQty') + record.get('outstockQty') - record.get('stockTakenQty') - record.get('stockRtQty'));
                    }
                },
              {text : "期间入库" , dataIndex : 'instockQty', sortable : true, width : 100, align : 'center'},
              {text : "期间出库" , dataIndex : 'outstockQty', sortable : true, width : 100, align : 'center'},
              {text : "期间退货" , dataIndex : 'stockRtQty', sortable : true, width : 100, align : 'center'},
              {text : "期间盘点差额" , dataIndex : 'stockTakenQty', sortable : true, width : 100, align : 'center'},
              {text : "结存" , dataIndex : 'endStockQty', sortable : true, filter:true, width : 100, align : 'center',
                    summaryType: 'sum' 
              }/*,
              {text : "单价（元/台）" , dataIndex : 'unitPrice', sortable : true, filter:true, width : 100, align : 'center',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    }
              },
              {text : "结存金额" , dataIndex : 'totalPrice', sortable : true, filter:true, width : 120, align : 'center',summaryType: 'sum',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    },
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0);
                    }  
              }*/
              ],            
            selType: 'rowmodel'
        });
        
        this.callParent(arguments);
    }
});


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    console.log("onready" +
    		""); 
    
    var listPanel = Ext.create('smartOA.stockMgt.ReportSMonthGridPanel');       
      
    stockReportPanel.add(listPanel);

 

});
//</script>