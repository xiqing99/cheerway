<script type="text/javascript">

    Ext.define('CurrencyListGridPanel',
    {   
        extend : "smartOA.commonClass.RowEditListViewGridPanel", 
        constructor : function(conf)
        {
            Ext.define('EnumData', {
                 extend: 'Ext.data.Model',
                 fields: [
                     {name: 'id', type: 'int', defaultValue: 0},
                     {name: 'name', type: 'string'},
                     {name: 'exchangeRate', type: 'float'},
                     {name: 'description',  type: 'string'}
                 ]
             });                 
            
            Ext.apply(this, {
                dataModel: 'EnumData',
                isAutoLoad: true,
                columns: [
                  {xtype: 'rownumberer', align:'center', resizable:true, width: 35, header: '序号'},
                  {text : '', dataIndex:'id', hidden: true},
                  {text : '名称' , dataIndex : 'name', sortable : true, width : 150, align : 'center',
                      editor : {
                        xtype : 'textfield',
                        allowBlank : false
                      }
                  },
                  {text : '汇率' , dataIndex : 'exchangeRate', width : 150, align : 'center',
                      editor : {
                        xtype : 'numberfield',
                        allowBlank : false,
                        minValue : 0
                      }
                  },              
                  {text : "详细描述" , dataIndex : 'description', flex: 1,
                        editor : {
                        xtype : 'textfield',
                        allowBlank : true
                      }
                  }
                ]
            });
            
            this.callParent(arguments);
        },
        regSaveFun : function(saveUrl)
        {
            var rowEditor = this.getPlugin('rowEditPlugin');
            rowEditor.on('edit', function(editor, context, e) 
            {
                context.record.commit();
                var item = context.record.data;
                
                
                smartOA.util.ajaxRequest(
                {
                    url : saveUrl,
                    params : {'entity.id': item.id, 'entity.name':item.name, 'entity.exchangeRate':item.exchangeRate, 'entity.description':item.description},
                    success : function(r, o)
                    {
                        Ext.Msg.alert('成功', '保存成功');
                        this.getCmp().refresh();
                    }
                }, this
                );  
               
            });
        }
    });    
    
Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';    


    
    var win = Ext.WindowMgr.getActive();
    win.setSize({width:600, height:500});
    
    win.center();        
    var panel = Ext.create('CurrencyListGridPanel',
    {
        loadUrl : 'basicElem/loadAllCurrency.action',
        saveUrl : 'basicElem/saveCurrency.action',
        delUrl : 'basicElem/delCurrency.action'      
    }); 
 
    win.add(panel);
    win.doLayout();  

});
</script>