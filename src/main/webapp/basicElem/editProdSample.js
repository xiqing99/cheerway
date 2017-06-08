<script type="text/javascript">

Ext.define('smartOA.salesMgt.EditSamplePanel',
{
    extend : 'Ext.form.Panel',
    initId : 0,
    parentStore : '',
    constructor : function()
    {   
        var customerStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadCustomerForCombo.action',
                reader: {
                    type: 'json',
                    root: 'list'
                }
            } 
        });
        
        var customerCombo = new Ext.form.ComboBox({
                name:'entity.customer.id',
                valueField:'id',
                displayField:'name',
                hiddenName:'entity.customer.id',
                fieldLabel: '客户名称',
                emptyText:'请选择客户',
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:customerStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local',
                listeners : {  
                   'beforequery':function(e){  
                        var combo = e.combo;    
                        if(!e.forceAll){    
                            var input = e.query;     
                            var regExp = new RegExp(".*" + input + ".*");   
                            combo.store.filterBy(function(record,id){     
                                var text = record.get(combo.displayField);    
                                return regExp.test(text);   
                            });  
                            combo.expand();    
                            return false;  
                        }  
                    }
                }
            });         
        
        var categoryStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadProdCtgForCombo.action',
                reader: {
                    type: 'json',
                    root: 'list'
                }
            }           
        }); 
        
        var ctgCombo = new Ext.form.ComboBox({
                name:'entity.category.id',
                valueField:'id',
                hiddenName:'entity.category.id',
                displayField:'name',
                fieldLabel: '产品目录',
                emptyText:'请选择产品目录',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:categoryStore,
                typeAhead: true,
                flex : 1
            });
            
        var empStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url :  'basicElem/loadEmpGeneInfoForCombo.action',
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var empCombo = new Ext.form.ComboBox({
                name:'entity.rspEmp.id',
                valueField:'id',
                hiddenName:'entity.rspEmp.id',
                displayField:'name',
                fieldLabel: '负责员工',
                emptyText:'请选择员工',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:empStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local'
            });

        var lendEmpCombo = new Ext.form.ComboBox({
                name:'entity.lendEmp.id',
                valueField:'id',
                hiddenName:'entity.lendEmp.id',
                displayField:'name',
                fieldLabel: '领用员工',
                emptyText:'请选择员工',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:empStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local'
            });            
            
        var typeData = {
        lists: [
        {
            id : 'KEEP_IN',
            name : '公司保留'           
        },
         {
            id : 'RETURN',
            name : '归还客户'
         }     
        ]};
        
        var typeStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: typeData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });
        
        var typeCombo = new Ext.form.ComboBox({
                name:'entity.type',
                valueField:'id',
                hiddenName:'entity.type',
                displayField:'name',
                fieldLabel: '样品归属',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store : typeStore,
                typeAhead: true,
                flex : 1,
                labelWidth: 60,
                margins: '5 5 0 20'
            });            
            
            
            
        Ext.apply(this, 
        {
            frame: true,    
            fieldDefaults: {
                labelAlign: 'left',
                labelWidth: 60,
                labelStyle: 'font-weight:bold',
                margins: '5 5 0 2'
            },
            layout: {
                type: 'hbox'
//                align: 'stretch'
            },                  
            items: [
            {
                xtype: 'hiddenfield',
                name : 'entity.id'                
            }, 
            {
                xtype: 'hiddenfield',
                name : 'entity.picUrl',
                value: Ext.BLANK_IMAGE_URL
            },            
            {
                xtype: 'fieldcontainer',
                flex : 1.5,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaultType: 'textfield',
                items : [               
                {
                    fieldLabel : '样品名称',
                    name: 'entity.name',
                    allowBlank:false,
                    flex : 1
                }, 
                customerCombo,  
                {                 
                  flex : 1,
                  fieldLabel: '包装方式',
                  name: 'entity.packDes',
                  allowBlank:false
                },              
                {
                    xtype: 'fieldcontainer',
                    flex : 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    defaultType: 'textfield',
                    items : [
                    ctgCombo,
                    {
                        xtype: 'numberfield',
                        fieldLabel : '样品重量',
                        allowBlank:false,
                        value: 0,
                        name: 'entity.weight',
                        flex : 1,
                        margins: '5 5 0 20'
                    }            
                    ]
                },                  
                {
                    xtype: 'fieldcontainer',
                    flex : 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items : [
                    empCombo,
                    typeCombo               
                    ]
                },                
                {
                    xtype: 'fieldcontainer',
                    flex : 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items : [
                    lendEmpCombo,
                    {   
                      xtype: 'datefield',  
                      flex : 1,
                      fieldLabel: '领用日期',
                      name: 'entity.lendDate',
                      allowBlank:false,
                      value: new Date(),
                      submitValue: true,
                      format: 'Y-m-d',
                      margins: '5 5 0 20'
                    }                
                    ]
                },                                
                {
                    xtype : 'textareafield',
                    fieldLabel: '样品描述',
                    name: 'entity.description',
                    lableAlign : 'top',
                    allowBlank:true,
                    flex : 3,
                    labelAlign : 'top'
                },
                {
                    xtype: 'fieldcontainer',
                    flex : 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    defaultType: 'textfield',
                    items : [
                    {
                        xtype: 'checkboxfield',
                        boxLabel: '停用标志',
                        name: 'entity.disabled',
                        inputValue:'true',
                        flex : 1
                    }, 
                    {                 
                      flex : 3,
                      fieldLabel: '备注',
                      name: 'entity.notes'
                    }            
                    ]
                }               
               
                ]
            },
            {
                xtype: 'fieldcontainer',
                flex : 1,
                margins: '0 0 0 40',
                layout : "form",                  
                items: [{  
                        xtype : 'box',  
                        anchor : '90%',
                        id : 'browseImage',  
                        fieldLabel : "预览图片",  
                        width: 300,
                        autoEl : {  
                            width : 294,  
                            height : 391,  
                            tag : 'img',  
                            src : Ext.BLANK_IMAGE_URL,  
                            style : 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale);',  
                            complete : 'off'
                        }  
      
                    },
                    {  
//                        id : 'upload',  
                        name : 'upload',  
                        fieldLabel : '上传图片',  
                        xtype: 'filefield', 
                        anchor : '10%'  
                    }
                ]                
            }
            ],                       
             tbar: [            
             {
                text: '保存',
                name: 'saveBtn',
                icon :'images/accept.png',
                iconCls :'add-icon',
                handler: this.save,
                scope: this
            },   
            {
                text: '领用样品',
                name: 'saveBtn',
                icon :'images/application_edit.png',
                iconCls :'add-icon',
                handler: this.lend,
                scope: this
            },             
            {
                text: '退出',
                icon :'images/cross.png',
                iconCls :'add-icon',
                handler: function(){
                        Ext.WindowMgr.getActive().close();
                        },
                scope: this
            }]
        });
        
        this.callParent(arguments); 
        
        var upload = this.down("[name=upload]");

        upload.on('change', function(field, newValue, oldValue) {  
            
                    var dom = upload.fileInputEl.dom;
                    var dataurl = window.URL.createObjectURL(dom.files.item(0));
                    
                    console.log(dom.files.item(0));
                    
                    var file = dom.files.item(0);
                    
                    if(file.size > 1024*2048)
                    {
                        Ext.Msg.alert('错误', '图片大小不能超过2M，请压缩后上传！');
                        upload.reset();
                        return;       
                    }
                    
                    var browse = Ext.get('browseImage');
                    
                    var url = 'file://'  +  dom.value;  
                            
                    //是否是规定的图片类型 
                    var img_reg = /\.([jJ][pP][gG]){1}$|\.([jJ][pP][eE][gG]){1}$|\.([gG][iI][fF]){1}$|\.([pP][nN][gG]){1}$|\.([bB][mM][pP]){1}$/;          
                    
                    if (!img_reg.test(url))
                    {
                        Ext.Msg.alert('错误', '图片格式错误，请选择正确图片格式！');
                        upload.reset();
                        return; 
                    }
                    
                    if (Ext.isIE) {  
                        var image = Ext.get('imageBrowse').dom;  
                        image.src = Ext.BLANK_IMAGE_URL;// 覆盖原来的图片  
                        image.filters  
                                .item("DXImageTransform.Microsoft.AlphaImageLoader").src = url;  
  
                        }// 支持FF  
                    else {  
                        Ext.get('browseImage').dom.src = dataurl; 
                    }  
                    
        }, this);         
    },
    save : function()
    {
        var formpanel = this;
        
        var form =  this.getForm();
        if(form.isValid())
        {
            form.submit({
            url: 'basicElem/saveProdSample.action',
            method: 'POST',
            waitMsg: mbLocale.waitingMsg,
            success: function(form, action) {    
                Ext.Msg.alert('成功', action.result.message);
                
                if(action.result.id != null)
                {
                    formpanel.down("[name=entity.id]").setValue(action.result.id);
                }
                
                if(action.result.picUrl != null)
                {
                    formpanel.down("[name=entity.picUrl]").setValue(action.result.picUrl);
                }

                if(formpanel.parentStore != null)
                {
                    formpanel.parentStore.reload();
                }
            },
            failure: function(form, action) {
                Ext.Msg.alert('失败',action.result.message);
            }
        });
        }else
        {
            Ext.Msg.alert('输入错误', '请输入正确内容');
        }            
    },
    lend : function()
    {
        var formpanel = this;
        
        var id = this.down("[name=entity.id]").value;
        
        var lendFunc = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                Ext.Ajax.request(
                {
                    url : 'basicElem/lendProdSample.action',
                    params : {'id': id},
                    success: function(response, opts)
                    {
                        var obj = Ext.JSON.decode(response.responseText);
                        if(obj.success != true)
                        {
                            Ext.Msg.alert("错误", obj.message);
                            return;
                        }                       
                        Ext.Msg.alert("成功", '成功领用该样品！');
                        
                        if(formpanel.parentStore != null)
                        {
                            formpanel.parentStore.reload();
                        }
                    }
                }, this
                );                 
            }
        };
        
        Ext.Msg.show(
        {
           title : '提醒',
           msg : '确认领用该样品?',
           buttons : Ext.Msg.YESNO,
           scope : this,
           fn  : lendFunc,
           icon :Ext.MessageBox.QUESTION
        });           
    },
    afterRender : function()
    {
        this.callParent(arguments); 
        
        if(this.initId == 0)
        {
            return;
        }
        
        this.form.trackResetOnLoad = true;    
        this.form.load({
               url : 'basicElem/loadProdSample.action',
               reset: true,
               params:{'id': this.initId},
               success : this.onLoadSuc,
               failure: function(form, action)
               {                
                    Ext.WindowMgr.getActive().close();
                    Ext.Msg.alert('错误', action.result.message);
                                        
               }
            });            
    },
    onLoadSuc: function(form, action)
    {
        var formpanel = form.owner;
        
        var picUrl = formpanel.down('[name=entity.picUrl]').getValue();
        var image = Ext.get('browseImage').dom;
        if (Ext.isIE) 
        {  
            image.src = Ext.BLANK_IMAGE_URL;// 覆盖原来的图片  
            image.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = picUrl;  
        } 
        else {  
           image.src = picUrl; 
        }        
    }    
});

Ext.onReady(function(){

    Ext.tip.QuickTipManager.init();
     
    Ext.form.Field.prototype.msgTarget = 'side';     
     
    var win = Ext.WindowMgr.getActive();   
     
    var formpanel = new smartOA.salesMgt.EditSamplePanel({initId: win.initId, parentStore:win.store}); 
     
    win.add(formpanel);
    win.doLayout();      

});
</script>