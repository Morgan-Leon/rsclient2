<%@page contentType="text/html;charset=gbk" pageEncoding="GBK"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">
<html>
    <head>
        <meta http-equiv = "content-type" content = "text/html; charset=gbk" >
        <title>ExtJs UEditor</title>
        <link rel="stylesheet" type="text/css" href="/rsc/js/rs/resources/css/rs-all.css" />
        <script src="/rsc/js/rs/rs-debug.js"></script>
        <script type="text/javascript" src="/rsc/rsclient/userinfo"></script>

    </head>
    <body>
        <script type="text/javascript">
            Rs.engine({
                shell: 'border',
                onBeforeInitialize: function() {
                    Rs.BASE_PATH = '/rsc/js/rs';
                },
                environment: {
                    type: 'development',
                    config: {
                        clearCache : false ,
                        monitor: false
                    }
                },
                libraries: ['ext-3.3.1-debug'],
                apps: [{
                    folder: 'formpanel',
                    name: "ExtJs整合UEditor",
                    autoRun: true,
                    region: {
                        rid: 'center'
                    }
                }]
            });
        </script>
    </body>
</html>