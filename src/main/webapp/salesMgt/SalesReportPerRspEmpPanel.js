
Ext.define("salesMgt.SalesReportPerRspEmpPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    criteraId: 1,
    constructor : function()
    {                                    
        
        Ext.apply(this, {      
            startDateByMonth: true,
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : "部门名称" , dataIndex : 'deptName', sortable : true, width : 120, align : 'center'},
              {text : "业务员" , dataIndex : 'empName', filter:true, sortable : true, width : 120, align : 'center', filterable: true},
              {text : "总金额(¥)" , dataIndex : 'totalPriceInCn', sortable : true, filter:true, width : 150, align : 'center'
              },
              {text : "超额利润(¥)" , dataIndex : 'totalExtraProfitInCn', sortable : true, filter:true, width : 150, align : 'center'
              }              
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
                 {name: 'deptName'},
                 {name: 'empName'},
                 {name: 'totalPriceInCn', type: 'float'},
                 {name: 'totalProfitInCn', type: 'float'}
            ];
  
        var columns = [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : "部门名称" , dataIndex : 'deptName', sortable : true, width : 100, align : 'center'},
              {text : "业务员" , dataIndex : 'empName', filter:true, sortable : true, width : 100, align : 'center', filterable: true},
              {text : "总金额(¥)" , dataIndex : 'totalPriceInCn', sortable : true, filter:true, width : 150, align : 'center',summaryType: 'sum',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    },
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return "<p style='color:red'>"+((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0)+"</p>";
                    } 
              },
              {text : "超额利润(¥)" , dataIndex : 'totalProfitInCn', sortable : true, filter:true, width : 150, align : 'center',summaryType: 'sum',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    },
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return "<p style='color:red'>"+((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0)+"</p>";
                    }   
              }               
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
            columns.splice(-2,0, {text : dateText+'金额(¥)' , dataIndex : 'price'+index, width : 150, align : 'center', summaryType: 'sum',
                    renderer:function(value)
                        {
                            return Ext.util.Format.currency(value, '¥');
                        },
                        summaryRenderer: function(value, summaryData, dataIndex) {
                            return "<p style='color:red'>"+((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0)+"</p>";
                        }   
                    });
            columns.splice(-2,0, {text : dateText+'超额利润(¥)' , dataIndex : 'profit'+index, width : 150, align : 'center', summaryType: 'sum',
                        renderer:function(value)
                        {
                            return Ext.util.Format.currency(value, '¥');
                        },
                        summaryRenderer: function(value, summaryData, dataIndex) {
                            return "<p style='color:red'>"+((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0)+"</p>";
                        }   
                    });        
                    
            field.push({name: 'price'+index, type: 'float'});
            field.push({name: 'profit'+index, type: 'float'});
            
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
                extraParams : {'startDate':Ext.util.Format.date(startDate, 'Y-m-d'), 
                'endDate':Ext.util.Format.date(endDate, 'Y-m-d'), criteraId: this.criteraId}                
            },
            autoLoad : false,
            autoSync: false
        }); 
        
        gridPanel.reconfigure(myStore, columns);
        myStore.reload();
    }
    
});