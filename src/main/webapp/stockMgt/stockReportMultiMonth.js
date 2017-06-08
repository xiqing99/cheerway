//<script type="text/javascript">

Ext.define("smartOA.stockMgt.ReportMMonthGridPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    tile : '库存报表',
    constructor : function()
    {                                    
        Ext.apply(this, {      
            loadUrl: "stockMgt/loadStockReportMultiMonth.action",
            startDateByMonth: true,
            dataModel: 'ReportModel', 
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : "产品类别" , dataIndex : 'prodCtgName', sortable : true, width : 150, align : 'center', filterable: true},
              {text : "产品型号" , dataIndex : 'prodModelNum', filter:true, sortable : true, width : 150, align : 'center', filterable: true},
              {text : "子型号" , dataIndex : 'subModelNum', filter:true, sortable : true, width : 120, align : 'center', filterable: true},
              {text : "产品单位" , dataIndex : 'prodUnit', width : 80, align : 'center'},
              {text : "期初结存" , dataIndex : 'beginStockQty', sortable : true, width : 100, align : 'center',filterable: true},
              {text : "期间退货" , dataIndex : 'stockRtQty', sortable : true, width : 100, align : 'center'},
              {text : "期间盘点差额" , dataIndex : 'stockTakenQty', sortable : true, width : 100, align : 'center'},
              {text : "期末结存" , dataIndex : 'endStockQty', sortable : true, filter:true, width : 100, align : 'center'
              }
/*              {text : "单价（元/台）" , dataIndex : 'unitPrice', sortable : true, filter:true, width : 100, align : 'center',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    }
              },
              {text : "结存金额" , dataIndex : 'totalPrice', sortable : true, filter:true, width : 150, align : 'center',summaryType: 'sum',
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
    },
    loadData: function()
    {
        var gridPanel = this;
        
        var startDate = gridPanel.down('field[name=startdt]').getValue();
        var endDate = gridPanel.down('field[name=enddt]').getValue();

        if(endDate.getTime() < startDate.getTime())
        {
            Ext.Msg.alert("请重新选择时间", "  结束日期不能小于开始日期!");
            return;
        }
        
        if((endDate.getFullYear() - startDate.getFullYear()) > 1)
         {
            Ext.Msg.alert("请重新选择时间", "  不支持大于一年的多月报表!");
            return;
        }       
        
        var field = [
                 {name: 'prodCtgName'},
                 {name: 'prodModelNum'},
                 {name: 'subModelNum'},
                 {name: 'prodUnit'},
                 {name: 'unitPrice', type: 'float'},
                 {name: 'endStockQty', type: 'float'},
                 {name: 'beginStockQty', type: 'float'},
                 {name: 'stockTakenQty', type: 'float'},
                 {name: 'stockRtQty', type: 'float'},
                 {name: 'totalPrice', type: 'float'},
                 {name: 'instockQty', type: 'float'},
                 {name: 'outstockQty', type: 'float'}
            ];
  
        var columns = [
          {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
          {text : "产品类别" , dataIndex : 'prodCtgName', sortable : true, width : 100, align : 'center'},
          {text : "产品型号" , dataIndex : 'prodModelNum', filter:true, sortable : true, width : 100, align : 'center', filterable: true},
          {text : "子型号" , dataIndex : 'subModelNum', filter:true, sortable : true, width : 100, align : 'center', filterable: true},
          {text : "产品单位" , dataIndex : 'prodUnit', width : 80, align : 'center'},
          {text : "期初结存" , dataIndex : 'beginStockQty', sortable : true, width : 100, align : 'center',filterable: true,
            renderer:function(data, cell, record, rowIndex,columnIndex, store)
            {
                return(record.get('endStockQty') - record.get('instockQty') - record.get('stockRtQty') + record.get('outstockQty') - record.get('stockTakenQty'));
            }
          },
          {text : "期间退货" , dataIndex : 'stockRtQty', sortable : true, width : 100, align : 'center'},
          {text : "期间盘点差额" , dataIndex : 'stockTakenQty', sortable : true, width : 100, align : 'center'},       
          {text : "期末结存" , dataIndex : 'endStockQty', sortable : true, filter:true, width : 100, align : 'center',
                summaryType: 'sum' 
          }
 /*         {text : "单价（元/台）" , dataIndex : 'unitPrice', sortable : true, filter:true, width : 100, align : 'center',
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
          ];        
        
        var index = 0;
        var date = new Date(startDate);
        while(date.getTime() < endDate.getTime())
        {
            var startMonth = date.getMonth();

            if(date.getDate() != 1)
            {
                if(startMonth == 11)
                {
                    date.setFullYear(date.getFullYear()+1);
                    date.setMonth(0);
                }else
                {
                    date.setMonth(startMonth+1);
                }
            }

            
            var dateText = date.getFullYear() + '-' + (date.getMonth()+1);
            columns.splice(-3,0, {text : dateText+'入库' , dataIndex : 'instockQty'+index, width : 100, align : 'center'});
            columns.splice(-3,0, {text : dateText+'出库' , dataIndex : 'outstockQty'+index, width : 100, align : 'center'});
            field.push({name: 'instockQty'+index, type: 'float'});
            field.push({name: 'outstockQty'+index, type: 'float'});
            
            if(date.getDate() == 1)
            {
                if(startMonth == 11)
                {
                    date.setFullYear(date.getFullYear()+1);
                    date.setMonth(0);
                }else
                {
                    date.setMonth(startMonth+1);
                }    
            }
            index++;
        }
        
        var myStore = Ext.create('Ext.data.Store', {
            fields : field,            
            proxy: {
                type: 'ajax',
                url: this.loadUrl,
                reader: {
                    type: 'json'
                },
                extraParams : {'criteraId':1, 'startDate':Ext.util.Format.date(startDate, 'Y-m-d'), 
                'endDate':Ext.util.Format.date(endDate, 'Y-m-d')}                
            },
            autoLoad : false,
            autoSync: false
        }); 
        
        gridPanel.reconfigure(myStore, columns);
        myStore.reload();
    }
    
});


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('smartOA.stockMgt.ReportMMonthGridPanel');       
      
    stockReportPanel.add(listPanel);

 

});
//</script>