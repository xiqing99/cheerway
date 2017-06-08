Ext.ns('smartOA.util');
smartOA.util = function() {
    var success = function(r,o){
        var res = Ext.decode(r.responseText);
        if (res&&res.message){
            if (!res.success){
                showMsg('failure',res.message);
            }else{
                showMsg('success',res.message);
            }
        }
    };
    var failure = function(r,o){
        var res = Ext.decode(r.responseText);
        if (!res){
            showMsg('failure', 'No Response From Server');
        }else if (res.message){
            showMsg('failure', res.message);
        }
    };
    
    var callback = function(el,s,r,o){
        if (Ext.get('session-expired')||Ext.get('access-denied')){
            var res = Ext.decode(r.responseText);
            showMsg('failure', res.message);
        }
    };
    
     return {
         proxyLoad : function () {
             c ={listeners:{
                        loadexception:function(proxy, options, resp, error) {
                         var res = Ext.decode(resp.responseText);
                         if (!res){
                            showMsg('failure', 'No Response From Server');
                         }else if (res.message){
                                showMsg('failure',res.message);
                             }
                        }
                    }
                 };
             return c;
        },
        autoLoad : function (c){
                 c = Ext.apply(c,{
                     callback: callback
                     }
                 );
             return c;
         },
         genWindow : function(c){
              if (c.id && Ext.getCmp(c.id)) {
                Ext.getCmp(c.id).center();
                return;
            }
             if (c.autoLoad){
                 c.autoLoad = Ext.apply(c.autoLoad,{
                         callback: callback,
                         nocache: true
                     }
                 );
             }
             var pbid = Ext.id();
            var win = new Ext.Window(Ext.apply({
                    closable : true,
                    border   : false,
                    width    : 640,
                    height   : 520,
                    plain    : true,
                    maximizable: true,
                    resizable: true,
                    constrainHeader: true,
                    html:    '<div id="'+pbid+'" style="height:100%;"></div>',
                    layout   : 'fit'
                },c));
            win.show();
            win.center();
            
            var close = false;
            win.on("beforeclose", function(panel)
            {
                var formPanel = panel.down('form');
                
                if(formPanel == null || formPanel.isDirty() == false)
                    return true;

                if(close)
                    return true;
                
                Ext.Msg.show(
                {
                   title : '提醒',
                   msg : '关闭窗口前请保存数据，确定关闭？',
                   buttons : Ext.Msg.YESNO,
                   scope : this,
                   fn:function(buttonId, text, opt)
                    {
                        if(buttonId == "yes")
                        {
                            close = true;
                            win.close();
                        }
                        
                    },
                   icon :Ext.MessageBox.QUESTION
                }); 
                
                return false;
            }
            );
            var myMask = new Ext.LoadMask(Ext.get(pbid), {msg:mbLocale.loadingMsg});
            myMask.show();
            return win;
        },
        ajaxRequest : function (c,scope){
  //          c.success = success.createSequence(c.success,scope);
 //           c.failure = failure.createSequence(c.failure,scope);
            Ext.Ajax.request(Ext.apply({
                scope:scope,
                method:'post',
                requestexception:function(conn,response,options){
                    showMsg('failure', 'No Response From Server');
                }
            },c));
        }
     };
}();

