//<script type="text/javascript">

Ext.define("smartOA.accountMgt.dueRsvbByCustGridPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    tile : '到期应付-发货单',
    constructor : function()
    {                                    
        Ext.define('RsvbModel',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'osVoucherSeqNum'},
                 {name: 'custName'},
                 {name: 'saleVchSeqNum'},
                 {name: 'currencyName'},         
                 {name: 'remainedAmount', type: 'float'},
                 {name: 'totalAmount', type: 'float'},
                 {name: 'deadlineDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'dateOfOverDue', type:'int'}
            ]         
        }  
        );
        
        Ext.apply(this, {      
            loadUrl: "accountMgt/loadOverduePerRSVB.action",
            dataModel: 'RsvbModel', 
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : "出库单编号" , dataIndex : 'osVoucherSeqNum', sortable : true, width : 120, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '单据数  :  ' + value;
                    }                 
              },
              {text : "出库日期" , dataIndex : 'createdDate', filter:true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 120, align : 'center'},
              {text : "客户名称" , dataIndex : 'custName', sortable : true, width : 150, align : 'center'},
              {text : "订单号" , dataIndex : 'saleVchSeqNum', sortable : true, width : 120, align : 'center'},             
              {text : "结算货币" , dataIndex : 'currencyName', sortable : true, width : 100, align : 'center'
              },
              {text : "总金额" , dataIndex : 'totalAmount', sortable : true, width : 120, align : 'center',
                    summaryType : 'sum', 
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }              
              },
              {text : "剩余应付金额" , dataIndex : 'remainedAmount', sortable : true, width : 120, align : 'center',
                    summaryType : 'sum', 
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }              
              },
              {text : "付款期限" , dataIndex : 'deadlineDate', filter:true,
                renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
              {text : "尾款剩余天数" , dataIndex : 'dateOfOverDue', sortable : true, flex:1, align : 'center',filter:true,
                    renderer:function(data)
                    {
                        if(data < 0)
                        {
                            return "<p style='color:red'>"+data+"</p>";
                        }else
                            return "<p style='color:green'>"+data+"</p>";;
                    }   
              }
              ],            
            selType: 'rowmodel'
        });
        
        this.callParent(arguments);
        
        var startDate = this.down('field[name=startdt]');
        startDate.disable();
        this.getStore().reload();
    }
});


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var framePanel = Ext.create('smartOA.accountMgt.dueRsvbByCustGridPanel');                
    
    accountReportPanel.add(framePanel);
 

});
//</script>