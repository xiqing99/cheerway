//<script type="text/javascript">

Ext.define("salesMgt.StoreSaleDetailListPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    mytile : '销货单详细列表',
    constructor : function(conf)
    {  
        
        Ext.define('OrderDetailModel',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'sequenceNum'},
                 {name: 'customerOrderNum'},
                 {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'state'},
                 {name: 'customerName'},
                 {name: 'deptName'},
                 {name: 'rspEmpName'},
                 {name: 'currencyName'},         
                 {name: 'itemPrice', type: 'float'},
                 {name: 'itemPriceInCn', type: 'float'},
                 {name: 'deliverDeadLine', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'paymentDeadLine', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'ctgName'},
                 {name: 'modelNum'},
                 {name: 'subModelNum'},
                 {name: 'colorModel'},
                 {name: 'packageModel'},
                 {name: 'custModelNum'},
                 {name: 'quantity', type: 'float'},
                 {name: 'outStockQty', type: 'float'}
            ]         
        }  
        );        
        
        
        Ext.apply(this, {
            dataModel: 'OrderDetailModel',     
            loadUrl: conf.loadUrl,
            defaultCriteraId: smartOA.csn.getValue('DEPT_SALES_ROOT_ID'),
            searchField: 'customerName',
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'voucherId', hidden: true},
              {text : "销货单编号" , dataIndex : 'sequenceNum', sortable : true, width : 120, align : 'center',filter:true              
              },            
              {text : "销货单日期" , dataIndex : 'createdDate', filter:true,
                renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
              {text : "客户" , dataIndex : 'customerName', sortable : true, width : 120, align : 'center',filter:true}, 
              {text : "产品型号" , dataIndex : 'modelNum', sortable : true, width : 120, align : 'center',filter:true},
              {text : "子型号" , dataIndex : 'subModelNum', sortable : true, width : 120, align : 'center',filter:true,
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '总计: ';
                    } 
              },                      
              {text : "定制色号" , dataIndex : 'colorModel',  width : 80, align : 'center'},
              {text : "包装方式" , dataIndex : 'packageModel',  width : 120, align : 'center'},
              {text : "客户型号" , dataIndex : 'custModelNum',  width : 100, align : 'center'},
              {text : "数量" , dataIndex : 'quantity', sortable : true, width : 100, align : 'center', summaryType: 'sum'},
              {text : "已发货数量" , dataIndex : 'outStockQty', sortable : true, width : 100, align : 'center',summaryType: 'sum',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        if(data > 0)
                            return "<p style='color:green'>"+data+"</p>";
                        else
                            return "<p style='color:red'>"+data+"</p>";
                    }               
              },
              {text : "结算货币" , dataIndex : 'currencyName', sortable : true, width : 80, align : 'center'
              },
              {text : "金额" , dataIndex : 'itemPrice', sortable : true, width : 120, align : 'center',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }              
              },
              {text : "金额(¥)" , dataIndex : 'itemPriceInCn', sortable : true, width : 120, align : 'center',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0);
                    }               
              },  
              {text : "状态" , dataIndex : 'state', sortable : true, width : 100, align : 'center',filter:true,
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
                    }                        
                }
                },              
              {text : "负责部门" , dataIndex : 'deptName', sortable : true, width : 80, align : 'center',filter:true},
              {text : "业务员" , dataIndex : 'rspEmpName', sortable : true, width : 80, align : 'center',filter:true},
              {text : "付款期限" , dataIndex : 'paymentDeadLine',renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
              {text : "产品类型" , dataIndex : 'ctgName', sortable : true, width : 120, align : 'center'}
              ]           

        });      
        
        this.callParent(arguments);
    }
  
});

//</script>