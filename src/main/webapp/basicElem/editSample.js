

Ext.define('smartOA.salesMgt.EditSamplePanel',
{
    extend : 'Ext.form.Panel',
    fileUpload : true, 
    constructor : function()
    {    
        Ext.apply(this, 
        {
            buttonAlign : 'center',
            layout : "form",                  
            items: [{  
                    id : 'upload',  
                    name : 'upload',  
                    fieldLabel : '上传图片',  
                    xtype: 'filefield', 
                    anchor : '20%'  
                }, {  
                    xtype : 'box',  
                    anchor : '80%',
                    id : 'browseImage',  
                    fieldLabel : "预览图片",  
                    width: 300,
                    autoEl : {  
                        width : 245,  
                        height : 326,  
                        tag : 'img',  
                        src : Ext.BLANK_IMAGE_URL,  
                        style : 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale);',  
                        complete : 'off'
                    }  
  
                }
            ],                       
             buttons: [{
                        text: mbLocale.submitButton,
                        handler: function(){
                        	var form =  this.up('form').getForm();
                        	if(form.isValid())
                        	{
                        		form.submit({
                                url: 'basicElem/saveProdSample.action',
                                method: 'POST',
                                waitMsg: mbLocale.waitingMsg,
                                success: function(form, action) {      
                                        Ext.Msg.alert('成功', action.result.message);
                                },
                                failure: function(form, action) {
                                    var obj = Ext.util.JSON.decode(action.response.responseText);
                                    Ext.Msg.alert('失败', obj.message);
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
                            Ext.WindowMgr.getActive().close();
                            }
                    }]
        });
        
        this.callParent(arguments); 
        
        var upload = this.down("[name=upload]");

        upload.on('change', function(field, newValue, oldValue) {  
            
                    var dom = upload.fileInputEl.dom;
                    var dataurl = window.URL.createObjectURL(dom.files.item(0));
                    var browse = Ext.get('browseImage');
                    
                    var url = 'file://'  +  dom.value;  
                            
                    //是否是规定的图片类型 
                    var img_reg = /\.([jJ][pP][gG]){1}$|\.([jJ][pP][eE][gG]){1}$|\.([gG][iI][fF]){1}$|\.([pP][nN][gG]){1}$|\.([bB][mM][pP]){1}$/;          
                                        
                    if (img_reg.test(url)) {  
  
                        if (Ext.isIE) {  
                            var image = Ext.get('imageBrowse').dom;  
                            image.src = Ext.BLANK_IMAGE_URL;// 覆盖原来的图片  
                            image.filters  
                                    .item("DXImageTransform.Microsoft.AlphaImageLoader").src = url;  
  
                        }// 支持FF  
                        else {  
                            Ext.get('browseImage').dom.src = dataurl; 
                        }  
                    }  
        }, this);         
    }
});

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
     
     var formpanel = new smartOA.salesMgt.EditSamplePanel();
     
     var win = Ext.widget('window',
     {
        closable : true,
        title : '产品设置',
        width    : 540,
        height   : 420,
        maximizable: true,
        modal: true,
        layout   : 'fit',
        items :[formpanel],
        resizable: true
     });
     
     win.show();
     win.center();     

});
//</script>