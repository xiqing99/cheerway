
Ext.define('js-lib.myapp.ux.EditVoucherPanel',
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
        
        console.log("load success");
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
        var itemsGrid = formpanel.down("[type=gridpanel]");
        var gridStore = itemsGrid.getStore();
//        var gridStore = Ext.getCmp('itemsGrid').getStore();
        
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
    moneyFormat: function(value)
    {
        var formpanel = this;
        
        var currencyName = formpanel.down("[name=entity.currencyName]");
      
        if(currencyName.getValue() === '人民币')
        {
            return Ext.util.Format.currency(value, '¥');
        }else
        {
            return Ext.util.Format.usMoney(value);
        }
    },
    print: function()
    {
        
    }
                 
});