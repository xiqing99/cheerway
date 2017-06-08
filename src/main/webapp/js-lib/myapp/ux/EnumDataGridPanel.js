
Ext.define('js-lib.myapp.ux.EnumDataGridPanel',
{   
    extend : "js-lib.myapp.ux.RowEditListViewGridPanel", 
    constructor : function(conf)
    {
        Ext.define('EnumData', {
             extend: 'Ext.data.Model',
             fields: [
                 {name: 'id', type: 'int', defaultValue: 0},
                 {name: 'name', type: 'string'},
                 {name: 'description',  type: 'string'}
             ]
         });                 
        
        Ext.apply(this, {
            dataModel: 'EnumData',
            isAutoLoad: true,
            columns: [
              {xtype: 'rownumberer'},
              {text : '', dataIndex:'id', hidden: true},
              {text : '名称' , dataIndex : 'name', sortable : true, width : 200, align : 'center',
                  editor : {
                    xtype : 'textfield',
                    allowBlank : false
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
                params : {'entity.id': item.id, 'entity.name':item.name, 'entity.description':item.description},
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