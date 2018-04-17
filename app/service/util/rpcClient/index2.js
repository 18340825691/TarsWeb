
var TarsClient  = require("@tars/rpc/protal.js").client;
var TarsProxy = require("./NodeTarsProxy").tars;

//ʹ�������ļ���ʼ��ͨ����
TarsClient.initialize(__dirname + "/config.conf");

var rpcProxyObj = {};
var rpcProxyFactory = (prxName, servent, proxy) => {
    rpcProxyObj[prxName] = TarsClient.stringToProxy(proxy, servent);
};

//���ɴ�����
//var prx = TarsClient.stringToProxy(TarsProxy.NodeTarsProxy, TarsClient.configure.get("main.DevServer"));        //�ͻ��˺ͷ���˶�������IDC�������ͻ���ͨ�����أ���ѯ��б�Ȼ����÷����
//var prx = TarsClient.stringToProxy(TarsProxy.NodeTarsProxy, TarsClient.configure.get("main.ProxyServer"));      //�ͻ��˲����ڱ��أ�����˲�����IDC�������ͻ���ͨ�����ر����������IDC����
var servant=TarsClient.configure.get("main.LocalServer");
// var tarsPrx = TarsClient.stringToProxy(TarsProxy.NodeTarsProxy,servant);      //�ͻ��˺ͷ���˶������ڱ��ء��ͻ���ֱ�����ط���
rpcProxyFactory('tarsPrx', servant, TarsProxy.NodeTarsProxy);

var prx = rpcProxyObj['tarsPrx'];
for(var i in prx){
    console.log(i);
}


//���ô����෽��
var rpcProxyApply = async(prxName, func, args) =>{
    var prx = rpcProxyObj[prxName];
    var result = await prx[func].apply(prx, args);

    return {
        result: result.response.arguments,
        __return: result.response.return
    }

}

module.exports = rpcProxyApply
