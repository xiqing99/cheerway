<script type="text/javascript">

Ext.define("smartOA.security.selectEmpGridPanel",
{   
    extend : "Ext.grid.Panel",
    parentStore : ' ',
    constructor : function()
    {  
        Ext.define('EmpGenInfo', {
             extend: 'Ext.data.Model',
             fields: [
                 {name: 'id', type: 'int'},
                 {name: 'name', type: 'string'},
                 {name: 'email',  type: 'string'},
                 {name: 'extNum',  type: 'string'},
                 {name: 'mobileNum',  type: 'string'},
                 {name: 'qq',  type: 'string'},
                 {name: 'deptName'},
                 {name: 'posName'},
                 {name: 'disabled', type: 'boolean'},
                 {name: 'description'}
             ]
         });        
         
        var myStore = Ext.create('Ext.data.Store', {
            model : 'EmpGenInfo',
            proxy: {
                type: 'ajax',
                url: "basicElem/loadAllEmpGenInfo.action",
                reader: {
                    type: 'json'
                }
            },
            autoLoad : true
        });     

        var selModel = Ext.create('Ext.selection.CheckboxModel');        
        
        Ext.apply(this, {
            store: myStore,
            columnLines : true,
            autoScroll:true,
            frame : true,   
            dataModel: 'EmpGenInfo', 
            columns: [
              {xtype: 'rownumberer'},
              {text : '', dataIndex:'id', hidden: true},
              {text : "姓名" , dataIndex : 'name', sortable : true, width : 100, align : 'center'},
              {text : "部门" , dataIndex : 'deptName', sortable : true, width : 120, align : 'center'},
              {text : "职位" , dataIndex : 'posName',  sortable : true, filter:true, width : 120, align : 'center'},
              {text : "邮箱" , dataIndex : 'email', sortable : true, flex:1, align : 'center'}
              
              ],             
            selModel: selModel,
            tbar: [
               {
                    text:'选择',
                    icon :'images/accept.png',
                    iconCls :'add-icon',
                    handler: this.saveAndReturn,
                    scope: this
               },
               {
                    text:'取消',
                    icon :'images/cross.png',
                    iconCls :'add-icon',
                    handler: function()
                    {
                        Ext.WindowMgr.getActive().close();
                    },
                    scope: this
               }               
            ],
            features:[
                {
                    ftype : 'searching',
                    minChars : 2,
                    width : 100,
                    position : 'top',
                    iconCls: 'Zoom',
                    menuStyle: 'radio',
                    showSelectAll : false,
                    checkIndexes: ['name'],
                    align : 'right',
                    mode : 'local'
                }]
        });

        this.callParent(arguments);
    },
    saveAndReturn: function()
    {
        var records = this.getSelectionModel().getSelection();
        var convRecords = new Array();
        for(var rec in records)
        {
            var data = records[rec].data;
            
            for(var i =0; i<this.parentStore.getCount(); i++)
            {
                var oldRec = this.parentStore.getAt(i).getData();
                
                if(data.id == oldRec.id)
                {
                    Ext.Msg.alert('提醒', data.name +' 已经存在, 请不要重复选择');
                    return;
                }
            }

            var convRec = {id:data.id,  name:data.name, email:data.email, 
                            deptName:data.deptName, posName:data.posName};
                            
            convRecords.push(convRec);
        }                
        
        this.parentStore.insert(this.parentStore.getCount(), convRecords);
        
        Ext.WindowMgr.getActive().close();
    }    
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side'
    
    var win = Ext.WindowMgr.getActive();    
    
    var framePanel = Ext.create('smartOA.security.selectEmpGridPanel',
                        {
                            parentStore : win.store
                        });
    win.add(framePanel);
    win.doLayout(); 

});
</script>