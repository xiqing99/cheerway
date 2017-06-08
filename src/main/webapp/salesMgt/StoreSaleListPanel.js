//<script type="text/javascript">

Ext.define("salesMgt.StoreSaleListPanel",
{   
    extend : "smartOA.commonClass.EditDateRangeGridPanel",
    mytile : '销货单列表',
    constructor : function(conf)
    {  
        Ext.define('VoucherModel',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'voucherId', type: 'int'},
                 {name: 'sequenceNum'},
                 {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'state'},
                 {name: 'customerName'},
                 {name: 'customerArea'},
                 {name: 'rspEmpName'},
                 {name: 'deptName'},
                 {name: 'currencyName'},         
                 {name: 'totalPrice', type: 'float'},
                 {name: 'totalPriceInCn', type: 'float'},
                 {name: 'totalExtraProfitInCn', type: 'float'},
                 {name: 'deliverDeadLine', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'paymentDeadLine', type:'date', dateFormat: 'Y-m-d'}                 
            ]         
        }  
        );        
        
        
        Ext.apply(this, {         
            title : this.mytile,
            loadUrl: conf.loadUrl,
            delUrl: 'salesMgt/delStoreSaleVch.action',
            editUrl: 'salesMgt/editStoreSaleVch.js',
            dataModel: 'VoucherModel',  
            defaultCriteraId: smartOA.csn.getValue('DEPT_SALES_ROOT_ID'),
            searchField: 'customerName',
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'voucherId', hidden: true},
              {text : "单据编号" , dataIndex : 'sequenceNum', sortable : true, width : 120, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '订单数  :  ' + value;
                    }                 
              },
              {text : "单据日期" , dataIndex : 'createdDate', filter:true,
              renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
              {text : "状态" , dataIndex : 'state', sortable : true, width : 100, align : 'center',
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
                }, filter:true
                },
              {text : "客户" , dataIndex : 'customerName', sortable : true, width : 120, align : 'center', filter:true},
              {text : "负责部门" , dataIndex : 'deptName', sortable : true, width : 100, align : 'center', filter:true},
              {text : "业务员" , dataIndex : 'rspEmpName', sortable : true, width : 80, align : 'center', filter:true},
              {text : "结算货币" , dataIndex : 'currencyName', sortable : true, width : 80, align : 'center'
              },
              {text : "销售额" , dataIndex : 'totalPrice', sortable : true, width : 120, align : 'center',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }
              },
              {text : "销售额(¥)" , dataIndex : 'totalPriceInCn', sortable : true, width : 120, align : 'center',
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
              {text : "结算期限" , dataIndex : 'paymentDeadLine',renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center', filter:true},
              {text : "客户地区" , dataIndex : 'customerArea', sortable : true, width : 100, align : 'center', filter:true}              
              ]           
        });
        
        this.callParent(arguments);
        
        console.log("constructor orderList");        
        
    },
    openDetailsWin : function(id)
    {
             smartOA.util.genWindow({
                    title    : '销货单编辑',
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