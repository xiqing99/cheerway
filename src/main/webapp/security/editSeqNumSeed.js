//<script type="text/javascript">

Ext.onReady(function(){
  
    Ext.define('EditSeqNumSeedPanel',
    {   
        extend : "Ext.grid.Panel",
        constructor : function()
        {
            Ext.define('SeqNumSeed', {
                 extend: 'Ext.data.Model',
                 fields: [
                     {name: 'seqName', type: 'string'},
                     {name: 'seqDesc', type: 'string'},
                     {name: 'curValue',  type: 'int'}
                 ]
             });                 
            
            var myStore = Ext.create('Ext.data.Store', {
                model : SeqNumSeed,            
                proxy: {
                    type: 'ajax',
                    url: 'security/loadVoucherSeqNumSeeds.action',
                    reader: {
                        type: 'json'
                    }           
                },
                autoLoad : true,
                autoSync: false
            });     
             
            Ext.apply(this, {
                autoScroll:true,
                columnLines : true,
                store : myStore,         
                columns: [
                  {xtype: 'rownumberer'},
                  {text : '', dataIndex:'seqName', hidden: true},
                  {text : '序列名' , dataIndex : 'seqDesc', sortable : true, width : 250, align : 'center'
                  },
                  {text : "当前值" , dataIndex : 'curValue', flex: 1, align : 'center',
                        editor : {
                        xtype : 'numberfield',
                        allowBlank : false,
                        minValue: 1,
                        decimalPrecision: 0
                      }
                  }
                ],
                plugins: [
                    Ext.create('Ext.grid.plugin.RowEditing', {
                    triggerEvent: 'celldblclick',
                    autoCancel: false,
                    pluginId : 'rowEditPlugin'
                    })
                ],
                selType: 'rowmodel',                
                tbar: [
                    {                
                        text: mbLocale.editItem,
                        icon :'images/application_edit.png',
                        iconCls :'delete-icon',
                        handler: this.edit,
                        scope: this 

                    },                
                    {
                        text: '全部重置',
                        icon :'images/arrow_refresh.png',
                        iconCls :'save-icon',
                        handler: this.reset,
                        scope: this
                    }                  
                ]                
                
            });
            
            this.callParent(arguments);
            this.regSaveFun();
        },
        edit : function()
        {
            var rowEditor = this.getPlugin('rowEditPlugin');
            
            var selection = this.getSelectionModel().getSelection();
            if(selection.length == 0 )
            {
                Ext.Msg.alert("错误", "请选择要编辑的序列");
                return;
            }        
            
            rowEditor.startEdit(selection[0].index, 0);
            
        },        
        reset : function()
        {
            var resetFun = function(buttonId, text, opt)
            {
                if(buttonId == "yes")
                {
                    smartOA.util.ajaxRequest(
                    {
                        url : 'security/resetAllVoucherSeqNumSeeds.action',
                        success : function(r, o)
                        {
                            var obj = Ext.JSON.decode(r.responseText);
                            
                            if(obj.success == true) 
                            {
                                Ext.Msg.alert("成功", "表单序列号重置成功！");
                                this.store.reload();                               
                            }else
                            {
                                Ext.Msg.alert("重置失败", obj.message);
                            }
                        }
                    }, this
                    );                
                }
            };
            
            Ext.Msg.show(
            {
               title : mbLocale.infoMsg,
               msg : '确认要重置所有表单序列号?',
               buttons : Ext.Msg.YESNO,
               scope : this,
               fn  : resetFun,
               icon :Ext.MessageBox.QUESTION
            });     
    
        },
        regSaveFun : function()
        {
            var rowEditor = this.getPlugin('rowEditPlugin');
            rowEditor.on('edit', function(editor, context, e) 
            {
                context.record.commit();
                var item = context.record.data;
                
                
                smartOA.util.ajaxRequest(
                {
                    url : 'security/updateVchSeqSeed.action',
                    params : {'seqName': item.seqName, 'value':item.curValue},
                    success : function(r, o)
                    {
                        Ext.Msg.alert('成功', '保存成功');
                    }
                }, this
                );  
               
            });
        }        
        
    });

    Ext.tip.QuickTipManager.init();
     
    Ext.form.Field.prototype.msgTarget = 'side';
     
    var win = Ext.WindowMgr.getActive();
    win.setSize({width:480, height:460});
    
    win.center();    
    
    var formpanel = Ext.create('EditSeqNumSeedPanel');          
        
        
    win.add(formpanel);
    win.doLayout();        

});
//</script>