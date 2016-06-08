(function(){
	
	/**
	 * @class Rs.Clipboard
	 * �û���ͨ�������������������壬�ݲ�֧��chrome��safari�����汾���������
<pre><code>
Rs.onReady(function() {

    Rs.Clipboard.setData("�������������");
	    	    		
}, this);
</code></pre>
	 * @singleton
	 */
	Rs.Clipboard = (function(){
		
		//���ü�����������
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
	    			alert("��������ܾ�!\n�����������ַ������'about:config'���س�\nȻ�� 'signed.applets.codebase_principal_support'����Ϊ'true'");   
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
			 * ������������������
		     * @method setData 
		     * @param {String} txt �ı����� 
		     * @return {Boolean} �Ƿ����óɹ�
		     */
			setData : copyToClipboard
		};
	})();
	
})();