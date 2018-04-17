var client  = require("@tars/rpc/protal.js").client;
var TarsProxy = require("./NodeTarsProxy");

//����RPC������
var RPCClientPrx = (tafClient, proxy, moduleName, interfaceName, servantName, setInfo) => {
    if(tafClient && tafClient.constructor!=client.constructor){
        setInfo = servantName;
        servantName = interfaceName;
        interfaceName = moduleName;
        moduleName = proxy;
        proxy = tafClient;
    }else{
        client = tafClient||client;
    }
    var module = proxy[moduleName];
    var rpcClient = client.stringToProxy(module[interfaceName+'Proxy'], servantName, setInfo);

    for(var p in rpcClient){
        if(!rpcClient.hasOwnProperty(p) && p!='getTimeout' && p!='setTimeout'){
            ((p, fun) => {
                rpcClient[p] = async function(...args){
                    try{
                        var _args = args;
                        var rst = await (async ()=>{
                            var result = await fun.apply(rpcClient, _args);
                            var args = result.response.arguments;
                            var rst = {__return: result.response.return};
                            for(var p in args){
                                if(typeof args[p] == 'object'){
                                    rst[p] = args[p].toObject();
                                }else{
                                    rst[p] = args[p];
                                }
                            }
                            return rst;
                        })();
                        return rst;
                    }catch(e){
                        if(e.response){
                            throw new Error(e.response && e.response.error && e.response.error.message);
                        }else{
                            throw(e);
                        }
                    }
                };
            })(p, rpcClient[p]);

        }
    }
    return rpcClient;
};

//����rpc�ṹ��
var RPCStruct = function(proxy, moduleName){
    var module = proxy[moduleName];
    var rpcStruct = {};
    for(var p in module){
        if(module.hasOwnProperty(p)){
            if(typeof module[p] == 'function'){
                if(new module[p]()._classname){
                    rpcStruct[p] = module[p];
                }
            }else{
                rpcStruct[p] = module[p];
            }
        }
    }
    return rpcStruct;
};

//���TARS����
module.exports = {
    tarsPrx : RPCClientPrx(TarsProxy, 'tars', 'NodeTars', 'TARS.NodeTarsServer.NodeTarsObj@tcp -h 127.0.0.1 -p 14002 -t 10000'),
    tarsStruct : RPCStruct(TarsProxy, 'tars')
};



