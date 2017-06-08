
Ext.define('smartOA.commonClass.DateRangeGridPanel',
{
    extend : "Ext.grid.Panel",
    loadUrl: '',
    dataModel: '',    
    startDateByMonth:false,
    defaultCriteraId: 1,
    searchField: '',
    constructor : function()
    {                    
        var endDate = new Date();
        var startDate = new Date();
        
        if(this.startDateByMonth)
        {
            startDate.setMonth(endDate.getMonth() -1);
            startDate.setDate(26);
        }else
        {
            startDate.setFullYear(endDate.getFullYear(), 0, 1);                 
        }
        var myStore = Ext.create('Ext.data.Store', {
            model : this.dataModel,            
            proxy: {
                type: 'ajax',
                url: this.loadUrl,
                timeout: 60000,
                reader: {
                    type: 'json'
                },
                extraParams : {'criteraId':this.defaultCriteraId, 'startDate':Ext.util.Format.date(startDate, 'Y-m-d'), 
                'endDate':Ext.util.Format.date(endDate, 'Y-m-d')}                
            },
            autoLoad : false,
            autoSync: false
        });         
        
        myStore.getProxy().on('exception', function(store, rsp, oper, eOpts)
        {
            if(rsp.timedout)
            {
                Ext.Msg.alert("加载失败", '    服务器超时, 请缩小查询时间范围!');
            }
            console.log(rsp);
            
        });
        
        myStore.on('load', function(store, records, successful, eOpts)
        {
            console.log(records.length);
            
            if(records.length == 0)
            {
                Ext.Msg.alert("加载成功", '所查询的数据为空!');
            }
        }
        );
        
        Ext.apply(this, {
            columnLines : true,
            store: myStore,
            autoScroll:true,
            frame : false,    
            flex:1,
            selType: 'rowmodel',
//            resizable: true,
            tbar: [
 /*               {
                    text: mbLocale.refreshPage,
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: this.refresh,
                    scope: this
                },*/
                {
                    text: '导出到Excel',
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: function(btn)
                    {
                       btn.up('grid').downloadExcelXml(); 
                    }
                },
                {
                    text: '打印表单',
                    icon :'images/printer.png',
                    iconCls :'save-icon',
                    handler: function(btn)
                    {
                       var grid = btn.up('grid');
                       Ext.ux.grid.Printer.printAutomatically = false;
                       Ext.ux.grid.Printer.print(grid);
                    }
                },                 
                '->',
                {
                    xtype: 'datefield',
                    fieldLabel: '起始时间  :',
                    name: 'startdt',
                    format: 'Y-m-d',
                    width: 190,
                    labelWidth: 70,
                    value:startDate
                }, 
                {
                    xtype: 'datefield',
                    fieldLabel: '结束',
                    name: 'enddt',
                    format: 'Y-m-d',
                    value : endDate,
                    width: 160,
                    labelWidth: 40
                },
                {
                    xtype: 'button',
                    text:'加载数据',
                    icon :'images/magnifier.png',                                       
                    iconCls :'save-icon',                    
                    handler: this.loadData,
                    scope: this                   
                }
                ],
                bbar: new Ext.PagingToolbar(
                {
//                    store : myStore,
                    pageSize : 1                    
                }),
                features:[
                {
                    ftype : 'searching',
                    id: 'searching',
                    minChars : 2,
                    width : 100,
                    position : 'top',
                    iconCls: 'Zoom',
                    menuStyle: 'radio',
                    showSelectAll : false,
                    checkIndexes: [this.searchField],
                    align : 'right',
                    mode : 'local'
                },                
                {
                    id: 'group',
                    ftype: 'groupingsummary',
                    groupHeaderTpl: '{name}'                 
                },
                {
                    ftype: 'filters',
                    local: true,
                    filters : [
                    {
                        type : 'date',
                        dataIndex : 'createdDate',
                        dateFormat : 'Y-m-d'
                    }                    
                    ]                    
                },
                {
                     ftype: 'summary'
                }
                ]
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
        
        var store =  gridPanel.getStore();
        store.getProxy().setExtraParam('startDate', Ext.util.Format.date(startDate, 'Y-m-d'));
        store.getProxy().setExtraParam('endDate', Ext.util.Format.date(endDate, 'Y-m-d'));
        store.reload();        
    },
    refresh: function()
    {
        this.store.reload();
    },
    getStartDate: function()
    {
       return this.down('field[name=startdt]').getValue();
    },
    getEndDate: function()
    {
        return this.down('field[name=enddt]').getValue();
    }
});

Ext.define("smartOA.commonClass.EditDateRangeGridPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    delUrl: '',
    editUrl: '',
    addMenu: null,
    constructor : function(conf)
    {                                  
        this.callParent(arguments);
        
        var tbar = this.getDockedItems('toolbar[dock="top"]')[0];
        
        tbar.insert(0, {
                    text: mbLocale.deleteItem,
                    icon :'images/cross.png',
                    iconCls :'save-icon',
                    name: 'delBtn',
                    handler: this.delSelected,
                    scope: this
                });       
                
        tbar.insert(0, {
                    text: mbLocale.editItem,
                    icon :'images/application_edit.png',
                    iconCls :'delete-icon',
                    name: 'editBtn',
                    handler: this.edit,
                    scope: this
                });                 
                
        tbar.insert(0, {
                    text:mbLocale.addNewItem,
                    icon :'images/add.png',
                    iconCls :'add-icon',
                    name: 'addNewBtn',
                    handler: this.addMenu ? null: this.addNew,
                    menu: this.addMenu ? this.addMenu: null,
                    scope: this
                });                                 
    },
    listeners:{
        itemdblclick : function(view, record, item, index, e)
        {      
            this.edit();
        },
        itemContextmenu: function( view, record, item, index, e, eOpts )
        {
            var panel = this;     
            
            var contextMenu =  Ext.create('Ext.menu.Menu', {
                        width : 20,
                        items: [{                
                                    text: mbLocale.addNewItem,
                                    icon :'images/application_edit.png',
                                    iconCls :'save-icon',
                                    handler:function(){  
                                        panel.addNew();  
                                    }
                                },
                                {                
                                    text: mbLocale.editItem,
                                    icon :'images/application_edit.png',
                                    iconCls :'delete-icon',
                                    handler:function(){  
                                        panel.edit();  
                                    }  
                            
                                },{
                                    text: mbLocale.deleteItem,
                                    icon :'images/cross.png',
                                    iconCls :'save-icon',
                                    handler:function(){  
                                        panel.delSelected();  
                                    }  
                        }]
                });
                
            e.stopEvent();
            contextMenu.showAt(e.getXY());
            return false;
        }
    },
    openDetailsWin : function(id)
    {
        
    },
    addNew : function()
    {
        this.openDetailsWin(0);
    },
    edit : function()
    {
        var selection = this.getSelectionModel().getSelection();
        
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要编辑的单据");
            return;
        }       

        this.openDetailsWin(selection[0].raw.voucherId);
              
    },
    delSelected : function()
    {
        var panel = this;
        
        var selection = this.getSelectionModel().getSelection();
        
        if(selection.length == 0 )
        {
            Ext.Msg.alert('<span style="font-weight: bold;font-size:12px;">错误</span>', "请选择要删除的单据");
            return;
        }
        
        var order = selection[0].raw;
        
        if(order.state !== 'PROPOSED')
         {
            Ext.Msg.alert('<span style="font-weight: bold;font-size:12px;">错误</span>', "不能删除已审核/完成单据");
            return;
        }       
        
        var delDeptFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                smartOA.util.ajaxRequest(
                {
                    url : panel.delUrl,
                    params : {'id': order.voucherId},
                    success : function(r, o)
                    {
                        var obj = Ext.JSON.decode(r.responseText);
                        
                        if(obj.success == true) 
                        {
                            Ext.Msg.alert("删除成功", obj.message);
                            this.store.reload();
                        }else
                        {
                           Ext.Msg.alert('删除失败', obj.message);
                        }
                    }
                }, this
                );                
            }
        };
        
        Ext.Msg.show(
        {
           title : mbLocale.infoMsg,
           msg : mbLocale.delConfirmMsg,
           buttons : Ext.Msg.YESNO,
           scope : this,
           fn  : delDeptFun,
           icon :Ext.MessageBox.QUESTION
        });     
    },
    refresh: function()
    {
        this.store.reload();
        this.getSelectionModel().deselectAll();
    },
    getStartDate: function()
    {
       return this.down('field[name=startdt]').getValue();
    },
    getEndDate: function()
    {
        return this.down('field[name=enddt]').getValue();
    }    
});

Ext.define('smartOA.commonClass.EditVoucherPanel',
{
    extend : 'Ext.form.Panel',
    initId : 0,
    loadUrl: '',
    saveUrl: '',
    updateStateUrl: '',
    parentStore : '',
    stateAudited : false,
    deptRootId: 1,
    auditorGroupId: '',
    constructor : function()
    {  
        var formPanel = this;
        
        var deptStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadDeptSubComboList.action',
                extraParams : {'id': this.deptRootId},
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }           
        }); 

        deptStore.on('load', function(store)
        {
            if(formPanel.initId == 0)
            {
                deptCombo.setValue(mainPanel.userDeptId);
            }
            
        });            
        
        var deptCombo = new Ext.form.ComboBox({
                name:'entity.dept.id',
                valueField:'id',
                hiddenName:'entity.dept.id',
                displayField:'name',
                fieldLabel: '负责部门',
                emptyText:'请选择部门',
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                queryMode: 'local', 
                store:deptStore,
                typeAhead: true,
                flex : 1,
                margins: '5 0 0 0'
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

        empStore.on('load', function(store)
        {
            if(formPanel.initId == 0)
            {
                empCombo.setValue(mainPanel.userEmpId);
            }
            
        });             
        
        deptCombo.on('change', function(combo, newValue)
        {

            Ext.apply(empStore.getProxy(), {
                    url : 'basicElem/loadEmpGIByDeptForCombo.action',
                    extraParams : {'deptId': newValue}
            });
            
            empCombo.enable();
            empStore.load();
        });        
        
        var empCombo = new Ext.form.ComboBox({
                name:'entity.rspEmp.id',
                valueField:'id',
                hiddenName:'entity.rspEmp.id',
                displayField:'name',
                fieldLabel: '业务员',
                emptyText:'请选择员工',
                editable:false,
                allowBlank:false,
//                forceSelection:true,
                triggerAction:'all',
                store:empStore,
                typeAhead: true,
                flex : 1,
                disabled: true,
                queryMode: 'local',
                margins: '5 0 0 30'
            });            

        var auditorStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url :  'basicElem/loadEmpComboListByGroupId.action',
                extraParams:{'id': this.auditorGroupId},
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        }); 
        
        var auditorCombo = new Ext.form.ComboBox({
                name:'entity.auditEmp.id',
                valueField:'id',
                hiddenName:'entity.auditEmp.id',
                displayField:'name',
                fieldLabel: '审核人',
                editable:false,
                forceSelection:true,
                allowBlank:false,
                triggerAction:'all',
                store:auditorStore,
                typeAhead: true,
                flex : 1,
                queryMode: 'local', 
                margins: '5 0 0 30'
            });                                                              
              
        Ext.apply(this, 
        {
            buttonAlign : 'center',
            frame: true,
            layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                bodyPadding: 10,
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 70,
                    labelStyle: 'font-weight:bold'
                },                
            items: [
            {
              xtype: 'hidden',
              name: 'entity.id'
            },
            {
              xtype: 'hidden',
              name: 'entity.state',
              value : 'PROPOSED'
            },            
            {
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                defaultType: 'textfield',
                items : [
                {
                  flex : 1,
                  xtype : 'datefield',
                  fieldLabel: '单据日期',
                  name: 'entity.createdDate',
                  editable : false,
                  readOnly: true,
                  format: 'Y-m-d',
                  value : new Date()
                },
                 {
                  flex : 1,
                  fieldLabel: '单据编号',
                  name: 'entity.sequenceNum',
                  margins: '0 0 0 30',
                  readOnly: true
                },
                {
                    fieldLabel : '审核日期',
                    name: 'entity.approvedTime',
                    readOnly  : true,
                    flex : 1,
                    margins: '0 0 0 30'
                }                
                ]
            },            
            {
                xtype: 'fieldcontainer',
                flex : 1,
                layout: 'hbox',
                items : [
                    deptCombo,
                    empCombo,
                    auditorCombo
                ]
            },
            {
                xtype: 'textfield',
                fieldLabel: '备注',
                flex :1,
                name: 'entity.notes',
                margins: '5 0 0 0'
            }            
            ],
            tbar : [
            {
                text: '审核' + '单据',
                name: 'auditBtn',
                tooltip: '审核反审核单据',
                enableToggle: true,
                icon :'images/accept.png',
                iconCls :'add-icon',
                handler: this.updateState,
                scope: this                
           },
           {
                text: '保存',
                name: 'saveBtn',
                icon :'images/accept.png',
                iconCls :'add-icon',
                handler: this.save,
                scope: this
           },   
           {
                text: '打印单据',
                icon :'images/printer.png',
                iconCls :'add-icon',
                handler: this.print,
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
           },
           '->',
           {
                text: '完成单据',
                name: 'cmplBtn',
                icon :'images/accept.png',
                iconCls :'add-icon',
                disabled : true,
                handler: this.completeVch,
                scope: this
           },           
           {
                xtype: 'tbtext',
                text: '未审核单据',
                name: 'stateLabel'
           }]
                    
        });

        this.callParent(arguments); 
             
    },  
    save : function(){
        
        var formpanel = this;
        var form =  this.getForm();        
        var grid = this.down('grid');
        
        var gridStore = grid.getStore();
               
        var result = this.convertItem(gridStore);

        if(result.failCause != null)
        {
             Ext.Msg.alert('输入错误', result.failCause);
             return;
        }
        
        if(form.isValid())
        {
            form.submit({
            url: this.saveUrl,
            method: 'POST',
            disabled:true,
            timeout:60,
            waitMsg: mbLocale.waitingMsg,
            params : {
                'itemListsJson' : Ext.encode(result.list)
            },
            success: function(form, action) {      

                Ext.Msg.alert('成功', action.result.message);
                
                if(action.result.id != null)
                {
                    console.log(action.result.id);
                    formpanel.down("[name=entity.id]").setValue(action.result.id);
                }

                if(action.result.seqNum != null)
                {
                    console.log(action.result.seqNum);
                    formpanel.down("[name=entity.sequenceNum]").setValue(action.result.seqNum);
                }
                
                formpanel.down('[name=auditBtn]').enable();
                       
                gridStore.commitChanges();
                
                if(formpanel.parentStore != null)
                    formpanel.parentStore.reload();
                    
            },
            failure: function(form, action) {
                Ext.Msg.alert('失败', action.result.message);
            }
        });
        }else
        {
            Ext.Msg.alert('输入错误', '请输入正确内容');
        }
    },
    afterRender : function()
    {
        this.callParent(arguments); 

        if(this.initId == 0)
        {
            this.down('[name=auditBtn]').disable();
            return;
        }
            
        
        this.form.trackResetOnLoad = true;    
        this.form.load({
                url : this.loadUrl,
               params:{'id': this.initId},
               success : this.onLoadSuc,
               timeout: 30,
               failure: function(form, action)
               {    
                    console.log(action.failureType);
                    Ext.WindowMgr.getActive().close();
                    
                    if(action.failureType === Ext.form.action.Action.CONNECT_FAILURE)
                    {
                        console.log('test');
                        Ext.MessageBox.alert('加载失败', '         服务器超时!');
                    }else
                    {
                        Ext.Msg.alert('错误', action.result.message);
                    }                         
               }
            });            
    },
    onLoadSuc: function(form, action)
    {
        
        var obj = Ext.JSON.decode(action.response.responseText, true);
        
        var state =  Object.getOwnPropertyDescriptor(obj.data,'entity.state').value;
        var formpanel = form.owner;
        var saveBtn = formpanel.down('[name=saveBtn]');
        
        switch(state)
        {
            case 'AUDITED':
            {
                formpanel.changeToAuditState();
                break;
            }
            case 'PROPOSED':
            {
                formpanel.stateAudited = false;
                break;
            }    
            case 'COMPLETED':
            {
                formpanel.changeToAuditState();
                formpanel.down('[name=auditBtn]').disable();
                formpanel.down('[name=cmplBtn]').disable();
                formpanel.down("[name=stateLabel]").setText('已完成单据');
                break;
            }              
        } 
        
        var itemsGrid = formpanel.down("grid");
        var gridStore = itemsGrid.getStore();
        gridStore.loadData(obj.data.itemList);
    },
    updateState: function(button, state)
    {
        var formpanel = this;
        
        var id = formpanel.down("[name=entity.id]").value;
        
        if(id == null)
        {
            Ext.Msg.alert("服务器异常", "请重新打开订单");
            Ext.WindowMgr.getActive().close();
            return;
        }
        
        var audited = !formpanel.stateAudited;                   
        var newState = audited? 'AUDITED':'PROPOSED'; 
       
        var saveBtn = formpanel.down("[name=saveBtn]");
        var stateField = formpanel.down("[name=entity.state]");
        var stateLable = formpanel.down("[name=stateLabel]");
        var createdDate = formpanel.down("[name=entity.createdDate]");
        
        Ext.Ajax.request(
        {
            url : this.updateStateUrl,
            params : {'id': id, 'state': newState},
            success: function(response, opts)
            {
                var obj = Ext.JSON.decode(response.responseText);
                if(obj.success != true)
                {
                    Ext.Msg.alert("错误", obj.message);
                    return;
                }
                var text;
                formpanel.stateAudited = audited;
                if(formpanel.stateAudited === true)
                {
                    formpanel.changeToAuditState();
                    text = '单据审核成功';
                }else
                {                                
                    button.setText('审核');
                    stateField.setValue('PROPOSED');   
                    saveBtn.enable();
                   
                    stateLable.setText('未审核单据');
                    text = '单据反审核成功';
                }
                Ext.Msg.alert("成功", text);
                
                if(formpanel.parentStore != null)
                    formpanel.parentStore.reload();
            }
        }, this
        ); 
    },
    completeVch: function(button)
    {
        var formpanel = this;
        
        if(formpanel.stateAudited != true)
        {
            Ext.Msg.alert("错误", "不能完成未审核单据!");
            return;
        }        
       
        var id = formpanel.down("[name=entity.id]").value;
        
        var complFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                Ext.Ajax.request(
                {
                    url : this.updateStateUrl,
                    params : {'id': id, 'state': 'COMPLETED'},
                    success: function(response, opts)
                    {
                        var obj = Ext.JSON.decode(response.responseText);
                        if(obj.success != true)
                        {
                            Ext.Msg.alert("错误", "完成单据失败");
                            return;
                        }
                        
                        formpanel.down("[name=entity.state]").setValue('COMPLETED');
                        formpanel.down("[name=auditBtn]").disable();
                        button.disable();
                        formpanel.down("[name=stateLabel]").setText('已完成');
        
                        Ext.Msg.alert("成功", '完成单据成功!');
                    }
                }, this
                );                
            }
        };
        
        Ext.Msg.show(
        {
           title : '确认完成',
           msg : '单据一旦完成不能撤销',
           buttons : Ext.Msg.YESNO,
           scope : this,
           fn  : complFun,
           icon :Ext.MessageBox.QUESTION
        });          
    },
    changeToAuditState: function()
    {
        var formpanel = this;
        
        var auditBtn = formpanel.down("[name=auditBtn]");
        var saveBtn = formpanel.down("[name=saveBtn]");
        var cmplBtn = formpanel.down("[name=cmplBtn]");
        var stateField = formpanel.down("[name=entity.state]");
        var stateLable = formpanel.down("[name=stateLabel]");
        
        formpanel.stateAudited = true;
        auditBtn.setText('反审核');
        stateField.setValue('AUDITED');
        stateLable.setText('已审核单据');
        saveBtn.disable();
        cmplBtn.enable();
        
        formpanel.down("[name=entity.createdDate]").setReadOnly(true); 
        formpanel.down("[name=entity.sequenceNum]").setReadOnly(true);
        formpanel.down("[name=entity.auditEmp.id]").setReadOnly(true);
        formpanel.down("[name=entity.rspEmp.id]").setReadOnly(true);
        formpanel.down("[name=entity.dept.id]").setReadOnly(true);                
    },
    print: function()
    {
        
    }
                 
});

Ext.define('smartOA.commonClass.ListViewGridPanel',
{
    extend : "Ext.grid.Panel",
    loadUrl: '',
    dataModel: '',  
    searchField: '',
    constructor : function(conf)
    {                                

        var myStore = Ext.create('Ext.data.Store', {
            model : this.dataModel,            
            proxy: {
                type: 'ajax',
                url: this.loadUrl,
                reader: {
                    type: 'json'
                }            
            },
            autoLoad : false,
            autoSync: false
        });         
        
        Ext.apply(this, {
            columnLines : true,
            store: myStore,
            autoScroll:true,
            frame : false,                      
            selType: 'rowmodel',
            tbar: [
                {
                    text: '加载数据',
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: this.refresh,
                    scope: this
                },
                {
                    text: '导出到Excel',
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: function(btn)
                    {
                       btn.up('grid').downloadExcelXml(); 
                    }
                },
                {
                    text: '打印表单',
                    icon :'images/printer.png',
                    iconCls :'save-icon',
                    handler: function(btn)
                    {
                       var grid = btn.up('grid');
                       Ext.ux.grid.Printer.printAutomatically = false;
                       Ext.ux.grid.Printer.print(grid);
                    }
                }                
                ],
                bbar: new Ext.PagingToolbar(
                {
//                    store : myStore,
                    pageSize : 1                    
                }),
                features:[
                {
                    ftype : 'searching',
                    minChars : 2,
                    width : 100,
                    position : 'top',
                    iconCls: 'Zoom',
                    menuStyle: 'radio',
                    showSelectAll : false,
                    checkIndexes: [this.searchField],
                    align : 'right',
                    mode : 'local'
                },
                {
                    id: 'group',
                    ftype: 'groupingsummary',
                    groupHeaderTpl: '{name}'                 
                },
                {
                    ftype: 'filters',
                    local: true      
                }             
                ]
        });
        
        this.callParent(arguments);              
    },  
    refresh: function()
    {
        this.store.reload();
    }
});

Ext.define('smartOA.commonClass.EditListViewGridPanel',
{
    extend : "smartOA.commonClass.ListViewGridPanel",
    delUrl : '',
    loadDisabledUrl: '',   
    constructor : function(conf)
    {                                              
        this.callParent(arguments);      

        var tbar = this.getDockedItems('toolbar[dock="top"]')[0];
        
        tbar.insert(0, {
                    text: '停用列表',
                    handler: this.loadDisabledList,
                    scope: this
                });     
                
        tbar.insert(0, '-');
        
        tbar.insert(0, {
                    text: mbLocale.deleteItem,
                    icon :'images/cross.png',
                    iconCls :'save-icon',
                    handler: this.delSelected,
                    scope: this
                });       
                
        tbar.insert(0, {
                    text: mbLocale.editItem,
                    icon :'images/application_edit.png',
                    iconCls :'delete-icon',
                    handler: this.edit,
                    scope: this
                });                 
                
        tbar.insert(0, {
                    text:mbLocale.addNewItem,
                    icon :'images/add.png',
                    iconCls :'add-icon',
                    handler: this.addNew,
                    scope: this
                });          
        
        
    }, 
    listeners:{
        itemdblclick : function(view, record, item, index, e)
        {      
            this.edit();
        },
        itemContextmenu: function( view, record, item, index, e, eOpts )
        {
            var panel = this;     
            
            var contextMenu =  Ext.create('Ext.menu.Menu', {
                        width : 20,
                        items: [{                
                                    text: mbLocale.addNewItem,
                                    icon :'images/application_edit.png',
                                    iconCls :'save-icon',
                                    handler:function(){  
                                        panel.addNew();  
                                    }
                                },
                                {                
                                    text: mbLocale.editItem,
                                    icon :'images/application_edit.png',
                                    iconCls :'delete-icon',
                                    handler:function(){  
                                        panel.edit();  
                                    }  
                            
                                },{
                                    text: mbLocale.deleteItem,
                                    icon :'images/cross.png',
                                    iconCls :'save-icon',
                                    handler:function(){  
                                        panel.delSelected();  
                                    }  
                        }]
                });
                
            e.stopEvent();
            contextMenu.showAt(e.getXY());
            return false;
        }        
    },    
    openDetailsWin : function(id)
    {
        
    },
    addNew : function()
    {
        this.openDetailsWin(0);
    },
    edit : function()
    {
        var selection = this.getSelectionModel().getSelection();
        
        if(selection.length == 0 )
        {
            Ext.Msg.alert('<span style="font-weight: bold;font-size:12px;">！错误</span>', "请选择要修改的行");
            return;
        }       

        this.openDetailsWin(selection[0].raw.entityId);
              
    },
    delSelected : function()
    {
        var selection = this.getSelectionModel().getSelection();
        
        if(selection.length == 0 )
        {
            Ext.Msg.alert('<span style="font-weight: bold;font-size:12px;">！错误</span>', "请选择要删除的行");
            return;
        }
        
        var delDeptFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                smartOA.util.ajaxRequest(
                {
                    url : this.delUrl,
                    params : {'id': selection[0].raw.entityId},
                    success : function(r, o)
                    {
                        var obj = Ext.JSON.decode(r.responseText);
                        
                        if(obj.success == true) 
                        {
                            Ext.Msg.alert("删除成功", obj.message);
                            this.store.reload();
                        }else
                        {
                            Ext.Msg.alert("删除失败", obj.message);
                        }
                    }
                }, this
                );                
            }
        };
        
        Ext.Msg.show(
        {
           title : mbLocale.infoMsg,
           msg : mbLocale.delConfirmMsg,
           buttons : Ext.Msg.YESNO,
           scope : this,
           fn  : delDeptFun,
           icon :Ext.MessageBox.QUESTION
        });     
    },
    loadDisabledList: function()
    {
        var proxy = this.store.getProxy();
        
        Ext.apply(proxy, {
        url : this.loadDisabledUrl,
        extraParams : {}
        });
        
        this.store.reload();
    },      
    refresh: function()
    {
        this.store.reload();
    }
});

Ext.define('smartOA.commonClass.EditTreeViewPanel',
{
    extend : 'Ext.TreePanel',
    loadUrl : '',
    editJs : '',
    delUrl : '',
    itemName : '',
    constructor : function(conf)
    {   
   
        var store = Ext.create('Ext.data.TreeStore',
        {
            autoLoad: true,   
            proxy: {
                type: 'ajax',
                url : conf.loadUrl,
                reader: {
                    type: 'json',
                    root : 'Children'
                }
            },
            root: {
            text : 'allModulesRoot',        
            expanded: true
           } 
        });       
    
        Ext.apply(this,
        {
            rootVisible:false,
            autoScroll:true,
            store : store ,
            tbar: [{
                    text:mbLocale.addNewItem,
                    icon :'images/add.png',
                    iconCls :'add-icon',
                    handler: this.addNew,
                    scope: this
               },{
                    text: mbLocale.editItem,
                    icon :'images/application_edit.png',
                    iconCls :'delete-icon',
                    handler: this.edit,
                    scope: this
                },
                {
                    text: mbLocale.deleteItem,
                    icon :'images/cross.png',
                    iconCls :'save-icon',
                    handler: this.del,
                    scope: this
                }
                ] 
        });
   
        this.callParent(arguments);
    },
    listeners:{
        itemdblclick : function(view, record, item, index, e)
        {      
            this.edit();
        },
        itemContextmenu: function( view, record, item, index, e, eOpts )
        {
            var panel = this;     
            
            var contextMenu =  Ext.create('Ext.menu.Menu', {
                width : 20,
                items: [{                
                        text: mbLocale.editItem,
                        icon :'images/application_edit.png',
                        iconCls :'delete-icon',
                        handler:function(){  
                            panel.edit();  
                        }  
                    
                },
                {
                        text:mbLocale.addNewItem,
                        icon :'images/add.png',
                        iconCls :'add-icon',
                        handler:function(){  
                            panel.addNew();  
                        }  
                },                
                {
                        text: mbLocale.deleteItem,
                        icon :'images/cross.png',
                        iconCls :'save-icon',
                        handler:function(){  
                            panel.del();  
                        }  
                },
                {
                        text: mbLocale.refreshPage,
                        icon :'images/arrow_refresh.png',
                        iconCls :'save-icon',
                        handler:function(){  
                            panel.refresh();  
                        }  
                }]
            });                
            e.stopEvent();
            contextMenu.showAt(e.getXY());
            return false;
        }
    },       
    openDetailsWin : function(id)
    {
             smartOA.util.genWindow({
                    title    : this.itemName +'设置',
                    loader: {
                            url: this.editJs,
                            autoLoad: true,
                            scripts:true
                        },
                    width    : 440,
                    height   : 320,
                    maximizable: true,
                    modal: true,
                    layout   : 'fit',
                    resizable: true,
                    initId : id,
                    parentStore : this.store
                });         
    },        
    addNew : function()
    {
         this.openDetailsWin(0);
    },
    edit :function()
    {
        var selection = this.getSelectionModel().getSelection();
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要编辑的"+this.itemName);
            return;
        }
        
        this.openDetailsWin(selection[0].data.id);
    },
    del : function()
    {
        var selection = this.getSelectionModel().getSelection();
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要删除的"+this.itemName);
            return;
        }

        if(selection[0].data.leaf == false)
        {
            Ext.Msg.alert("错误", "请先删除子"+this.itemName);
            return;
        }
        
        var delStoreFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                smartOA.util.ajaxRequest(
                {
                    url : this.delUrl,
                    params : { 'id' : selection[0].data.id},
                    success : function(r, o)
                    {
                        var obj = Ext.JSON.decode(r.responseText);
                        
                        if(obj.success == true) 
                        {
                            Ext.Msg.alert("成功", obj.message);
                            this.store.reload();
                        }else
                        {
                            Ext.Msg.alert('失败', obj.message);
                        }                        
                    }
                }, this
                );
                
            }
        };
        
        Ext.Msg.show(
        {
           title : mbLocale.infoMsg,
           msg : mbLocale.delConfirmMsg,
           buttons : Ext.Msg.YESNO,
           scope : this,
           fn  : delStoreFun,
           icon :Ext.MessageBox.QUESTION
        });
        
    },
    refresh : function()
    {
        this.store.reload();
    }
});

Ext.define('smartOA.commonClass.RowEditListViewGridPanel',
{   
    extend : "Ext.grid.Panel",
    dataModel:'',
    loadUrl : '',
    saveUrl : '',
    delUrl : '', 
    isAutoLoad: true,
    constructor : function(conf)
    {           
         var myStore = Ext.create('Ext.data.Store', {
             model: this.dataModel,
             proxy: {
                 type: 'ajax',
                 url: conf.loadUrl,
                 reader: {
                     type: 'json',
                     root: 'lists'
                 }
             },
             autoLoad: this.isAutoLoad,
             autoSync: false
         });    
        
        Ext.apply(this, {
            autoScroll:true,
            columnLines : true,
            frame : false, 
            store : myStore,         
            plugins: [
                Ext.create('Ext.grid.plugin.RowEditing', {
                triggerEvent: 'celldblclick',
                autoCancel: false,
                pluginId : 'rowEditPlugin'
                })
            ],
            selType: 'rowmodel',
            tbar: [{
                    text:mbLocale.addNewItem,
                    icon :'images/add.png',
                    iconCls :'add-icon',
                    handler: this.addNew,
                    scope: this
               },{
                    text: mbLocale.editItem,
                    icon :'images/application_edit.png',
                    iconCls :'delete-icon',
                    handler: this.edit,
                    scope: this
                },
                {
                    text: mbLocale.deleteItem,
                    icon :'images/cross.png',
                    iconCls :'save-icon',
                    handler: this.delSelected,
                    scope: this
                },
                {
                    text: mbLocale.refreshPage,
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: this.refresh,
                    scope: this
                }
                ] 
        });
       
        this.callParent(arguments);
        this.regSaveFun(conf.saveUrl);
    },
    listeners:{
        itemdblclick : function(view, record, item, index, e)
        {      
            this.edit();
        },
        itemContextmenu: function( view, record, item, index, e, eOpts )
        {
            var panel = this;     
            
            var contextMenu =  Ext.create('Ext.menu.Menu', {
                        width : 20,
                        items: [{                
                                    text: mbLocale.addNewItem,
                                    icon :'images/application_edit.png',
                                    iconCls :'save-icon',
                                    handler:function(){  
                                        panel.addNew();  
                                    }
                                },
                                {                
                                    text: mbLocale.editItem,
                                    icon :'images/application_edit.png',
                                    iconCls :'delete-icon',
                                    handler:function(){  
                                        panel.edit();  
                                    }  
                            
                                },{
                                    text: mbLocale.deleteItem,
                                    icon :'images/cross.png',
                                    iconCls :'save-icon',
                                    handler:function(){  
                                        panel.delSelected();  
                                    }  
                        }]
                });
                
            e.stopEvent();
            contextMenu.showAt(e.getXY());
            return false;
        }
    },    
    addNew : function()
    {
        var rowEditor = this.getPlugin('rowEditPlugin');
        
        rowEditor.cancelEdit();
        
        var record = Ext.create(this.dataModel);
        
        this.getStore().insert(0, record);
        rowEditor.startEdit(0,0);
    },
    edit : function()
    {
        var rowEditor = this.getPlugin('rowEditPlugin');
        
        var selection = this.getSelectionModel().getSelection();
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要编辑的行");
            return;
        }        
        
        rowEditor.startEdit(selection[0].index, 0);
        
    },
    delSelected : function()
    {
        var model = this.getSelectionModel( );
        var selection = model.getSelection();
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要删除的行");
            return;
        }       
        
        var delDeptFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                smartOA.util.ajaxRequest(
                {
                    url : this.delUrl,
                    params : {'id': selection[0].raw.id},
                    success : function(r, o)
                    {
                        var obj = Ext.JSON.decode(r.responseText);
                        
                        if(obj.success == true) 
                        {
                            Ext.Msg.alert("成功", obj.message);
                            this.store.reload();
                        }else
                        {
                            Ext.Msg.alert('失败', obj.message);
                        }   
                    }
                }, this
                );
                
            }
        };
        
        Ext.Msg.show(
        {
           title : mbLocale.infoMsg,
           msg : mbLocale.delConfirmMsg,
           buttons : Ext.Msg.YESNO,
           scope : this,
           fn  : delDeptFun,
           icon :Ext.MessageBox.QUESTION
        });     
    },
    refresh: function()
    {
        this.store.reload();
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


Ext.define('smartOA.commonClass.EnumDataGridPanel',
{   
    extend : "smartOA.commonClass.RowEditListViewGridPanel", 
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

Ext.define('smartOA.commonClass.GeneTreeNodeEditForm',
{
    extend : 'Ext.form.Panel',
    initId : 0,
    parentStore : null,
    comboLoadUrl : '',
    dataLoadUrl : '',
    saveUrl : '',
    nameText : '',
    constructor : function(conf)
    {               
        var comboStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : conf.comboLoadUrl,
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }           
        });               

        var combo = new Ext.form.ComboBox({
                name:'entity.supNode.id',
                selectOnFocus:true,
                valueField:'id',
                hiddenName:'entity.supNode.id',
                displayField:'name',
                fieldLabel: '上级'+ conf.nameText,
                emptyText:'请选择上级'+ conf.nameText,
                editable:false,
                allowBlank:false,
                forceSelection:true,
                triggerAction:'all',
                store:comboStore,
                typeAhead: true,
                 width : 80
            });
        Ext.apply(this, 
        {
            frame: true,
 //           plain:true,
            labelAlign: 'left',
            style:'padding:1px',  
            buttonAlign : 'center',
            layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                bodyPadding: 10,
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 80,
                    labelStyle: 'font-weight:bold',
                    margins: '2 0 0 5'
                },             
            items: [
            {
                name : 'entity.id',
                xtype: 'hiddenfield'
            },
            {
                xtype : 'textfield',
                fieldLabel: conf.nameText + '名称',
                name: 'entity.name',
                allowBlank:false
            }, 
            combo,
            {
                xtype : 'textareafield',
                fieldLabel: conf.nameText + '描述',
                name: 'entity.description',
                allowBlank:true,
                grow : true,
                flex: 1
            }
            ],
             buttons: [{
                        text: mbLocale.submitButton,
                        handler: function(){
                            var form =  this.up('form').getForm();
                            
                            if(form.isValid())
                            {
                                form.submit({
                                url: conf.saveUrl,
                                method: 'POST',
                                disabled:true,
                                waitMsg: mbLocale.waitingMsg,
                                success: function(form, action) {                                          
                                        Ext.Msg.alert('成功', action.result.message);
                                        conf.parentStore.reload();
                                        Ext.WindowMgr.getActive().close();      
                                },
                                failure: function(form, action) {
                                    Ext.Msg.alert('失败', action.result.message);
                                }
                            });
                            }else
                            {
                                Ext.Msg.alert('输入错误', '请输入正确内容');
                            }
                        }                    
                    },{
                        text: mbLocale.closeButton,
                        scope:this,
                        handler: function(){
                            
                            var win = Ext.WindowMgr.getActive();
                            win.close();
                            }
                    }]
        }); 
        
        this.callParent(arguments); 
    },
    afterRender : function()
    {
        this.callParent(arguments); 

        if(this.initId == 0)
            return;
        this.form.load({
                url : this.dataLoadUrl,
               params:{'id': this.initId},
               failure: function(form, action)
               {                  
                    Ext.WindowMgr.getActive().close();
                    Ext.Msg.alert('错误', action.result.message);
                                        
               }               
            });        
    }
});


Ext.define('smartOA.commonClass.TreeListViewPanel',
{
    extend : 'Ext.TreePanel',
    
    constructor : function(conf)
    {   
   
        var mystore = Ext.create('Ext.data.TreeStore',
        {
            autoLoad: true,   
            proxy: {
                type: 'ajax',
                url : conf.loadUrl,
                reader: {
                    type: 'json',
                    root : 'Children'
                },
                extraParams :{'id':conf.rootId}
            },
            root: {
            text : 'allModulesRoot',        
            expanded: true
           } 
        });       
    
        Ext.apply(this,
        {
            rootVisible:false,
            autoScroll:true,
            title: conf.title,
            resizable: true,
            store : mystore ,
//            collapsible: true,
            tbar: [
                {
                    text: mbLocale.refreshPage,
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: function()
                    {
                        mystore.reload();
                    },
                    scope: this
                }
                ] 
        });
   
        this.callParent(arguments);
    }
});