(function(){
	
	/**
	 * @class Rs.Clipboard
	 * 用户可通过此类访问浏览器剪贴板，暂不支持chrome和safari两个版本的浏览器。
<pre><code>
Rs.onReady(function() {

    Rs.Clipboard.setData("剪贴板里的内容");
	    	    		
}, this);
</code></pre>
	 * @singleton
	 */
	Rs.Clipboard = (function(){
		
		//设置剪贴板里内容
		function copyToClipboard(txt){
	    	txt = ""+txt;
	    	if(window.clipboardData){
	    		window.clipboardData.clearData();
	    		window.clipboardData.setData("Text", txt);
	    		return true;
	    	}else if(navigator.userAgent.indexOf("Opera") != -1){   
	    		window.location = txt;
	    		return true;
	    	}else if(window.netscape){
	    		try{
	    			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");   
	    		}catch(e){
	    			alert("被浏览器拒绝!\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");   
	    		}
	    		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);   
	    		if (!clip){
	    			return false;
	    		}
	    		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);   
	    		if (!trans){
	    			return false;
	    		}
	    		trans.addDataFlavor('text/unicode');   
	    		var str = new Object(),
	    			len = new Object(),
	    			str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString),
	    			copytext = txt;
	    		str.data = copytext;
	    		trans.setTransferData("text/unicode",str,copytext.length*2);   
	    		var clipid = Components.interfaces.nsIClipboard;   
	    		if (!clip){
	    			return false;
	    		}
	    		clip.setData(trans, null, clipid.kGlobalClipboard);
	    		return true;
	    	}
	    };
		
		return {
			
			/**
			 * 给剪贴板里设置内容
		     * @method setData 
		     * @param {String} txt 文本内容 
		     * @return {Boolean} 是否设置成功
		     */
			setData : copyToClipboard
		};
	})();
	
})();