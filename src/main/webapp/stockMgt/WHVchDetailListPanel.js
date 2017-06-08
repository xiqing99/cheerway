
Ext.define('stockMgt.WHVchDetailListPanel',
{
    extend : "smartOA.commonClass.DateRangeGridPanel",
    constructor : function(conf)
    {

        Ext.define('WHVoucherDetailModel',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'storeName'},
                 {name: 'sequenceNum'},
                 {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'state'},
                 {name: 'saleVchSeqNum'},
                 {name: 'customerName'},
                 {name: 'rspEmpName'},
                 {name: 'notes'},
                 {name: 'mtNum'},
                 {name: 'mtName'},
                 {name: 'unit'},
                 {name: 'custModelNum'},
                 {name: 'quantity', type: 'float'}
            ]         
        }  
        );                          
        
        Ext.apply(this, {
            title : this.mytile,
            autoScroll:true, 
            frame: true,
            dataModel: 'WHVoucherDetailModel',     
            loadUrl: conf.loadUrl,         
            searchField: 'saleVchSeqNum',
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'id', hidden: true},
              {text : "单据日期" , dataIndex : 'createdDate', filter:true,
              renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},              
              {text : "单据编号" , dataIndex : 'sequenceNum', filter:true, sortable : true, width : 120, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '单据总数  :  ' + value;
                    }                 
              },
              {text : "单据状态" , dataIndex : 'state', sortable : true, filter:true, width : 80, align : 'center',
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
              {text : "仓库名称" , dataIndex : 'storeName', sortable : true, width : 150, align : 'center'},
              {text : "订单号" , dataIndex : 'saleVchSeqNum', filter:true,sortable : true, width : 130, align : 'center'},
              {text : "物料号" , dataIndex : 'mtNum',  width : 150, align : 'center'              },
              {text : "物料名称" , dataIndex : 'mtName',  width : 150, align : 'center'},           
              {text : "单位" , dataIndex : 'unit',  width : 70, align : 'center'},
              {text : "数量" , dataIndex : 'quantity', sortable : true, width : 120, align : 'center', summaryType : 'sum'},  
              {text : "客户名称" , dataIndex : 'customerName', sortable : true, filter:true, width : 150, align : 'center'},
              {text : "客户型号" , dataIndex : 'custModelNum',  width : 120, align : 'center'},   
              {text : "备注" , dataIndex : 'notes', sortable : true, width : 100, align : 'center',flex:1}
              ]
        });
       
        this.callParent(arguments);              
    }
});