let http = require('http');
let crypto = require('crypto');
let qs = require('querystring');


/*
 * 生成随机字符串
 */
let NonceStr = function () {
    return Math.random().toString(36).substr(2, 15);
};

/*
* 生成时间戳
*/
let Timestamp = function () {
    return parseInt(new Date().getTime() / 1000, 0) + '';
};

/*
* 签名
*/
let sign = function (string, app_secret) {
    return crypto.createHmac('sha256', String(app_secret)).update(string).digest('hex')
};

class SDK {
    /**
     * api = new HuoBi(opts);
     * @param {Object} opts 选项参数
     * @param {String} opts.appUid 在HuobiChat开放平台上申请得到的appid
     * @param {String} opts.appSecret 在HuobiChat开放平台上申请得到的appsecret
     * @param {String} opts.apiHost 在HuobiChat开放平台上的api请求host
     */
    constructor(opts={}){
        this.appUid = opts.appUid;
        this.appSecret = opts.appSecret;
        this.host = opts.host || 'http://open.api.test.hbtalk.org';
    }


    /**
     * 请求的基本封装
     * @param {String} path 请求路径
     * @param {String} content 请求体
     */
    request(path, content) {
        let options = {  
            hostname: this.host,
            path: path,  
            port: 80,
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/json; charset=UTF-8'  
            }  
        };
        return new Promise(function (resolve,reject) {
            let req = http.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    return resolve(chunk);
                });
                req.on('error', function (e) {
                    return reject(e);
                });
            });
            req.write(JSON.stringify(content));
            req.end();
        })
    };

    /**
     * 通过code获取用户信息
     * @param {String} code H5客户端通过login接口获取的code
     */
    getUserInfo(code) {
        let _this = this;
        return new Promise(function(resolve, reject){
            try {
                const param ={
                    appUid: _this.appUid,
                    code: code,
                    timeStamp: Timestamp(),
                    nonceStr: NonceStr()
                };
                let objs = [];
                objs.push(`app_uid=${param.appUid}`);
                objs.push(`code=${param.code}`);
                objs.push(`time_stamp=${param.timeStamp}`);
                objs.push(`nonce_str=${param.nonceStr}`);
                objs.push(`app_secret=${_this.appSecret}`);
                let string = objs.sort().join('&');

                param.sign = sign(string, _this.appSecret);
                let path = '/app_users/getUserInfo';
                return _this.request(path, param).then(function(chunk){
                    return resolve(chunk);
                }).catch(function(err){
                    return reject(err)
                })
            }catch (err){
                return reject(err)
            }
        })
    };

    /**
     * 统一下单
     * @param {Object} opts 选项参数
     * @param {String} opts.openUid 用户code授权后平台下达的openid
     * @param {String} opts.totalFee 总金额
     * @param {String} opts.outTradeNo 平台单号
     * @param {String} opts.feeType 火币类型 默认ht
     * @param {String} opts.exchange 
     * @param {String} opts.notifyUrl 
     * @param {String} opts.body 订单描述
     */
    prePay( opts ) {
        let _this = this;
        return new Promise(function(resolve, reject){
            try {
                const params ={
                    appUid: _this.appUid,
                    timestamp: Timestamp(),
                    nonceStr: NonceStr(),
                    feeType: opts.feeType || "HT",
                    totalFee: opts.totalFee,
                    exchange: opts.exchange || 'false',
                    notifyUrl: opts.notifyUrl,
                    openUid: opts.openUid,
                    outTradeNo: opts.outTradeNo,
                    body: opts.body
                };
                let objs = [];
                objs.push(`app_uid=${params.appUid}`);
                objs.push(`timestamp=${params.timestamp}`);
                objs.push(`nonce_str=${params.nonceStr}`);
                objs.push(`fee_type=${params.feeType}`);
                objs.push(`exchange=${params.exchange}`);
                objs.push(`notify_url=${parmas.notifyUrl}`);
                objs.push(`open_uid=${parmas.openUid}`);
                objs.push(`total_fee=${params.totalFee}`);
                objs.push(`out_trade_no=${params.outTradeNo}`);
                objs.push(`body=${params.body}`);
                objs.push(`app_secret=${params.appSecret}`);
                
                let string = params.sort().join('&')
                params.sign = sign(string, _this.appSecret);
                let path = `/payment/prepay`;
                return _this.request(path, params).then(function(chunk){
                    return resolve(chunk);
                }).catch(function(err){
                    return reject(err)
                })
            }catch (err){
                return reject(err)
            }
        })
    };

    /**
     * 验证订单通知机制
     * @param {Object} opts 选项参数
     * @param {String} opts.outTradeNo 第三方平台单号
     * @param {String} opts.totalFee 第三方平台单号
     * @param {String} opts.feeType 支付货币的类型 
     * @param {String} opts.payAt 支付的时间
     * @param {String} opts.timestamp 时间戳
     * @param {String} opts.scode Huobi Chat支付流水号 
     * @param {String} opts.sign API签名
     */
    verifyNotifySign( opts ) {
        let _this = this;
        try {
            let objs = [];
            objs.push(`app_uid=${_this.appUid}`);
            objs.push(`total_fee=${opts.totalFee}`);
            objs.push(`fee_type=${opts.feeType}`);
            objs.push(`timestamp=${opts.timestamp}`);
            objs.push(`out_trade_no=${opts.outTradeNo}`);
            objs.push(`scode=${opts.scode}`);
            objs.push(`app_secret=${params.appSecret}`);
            
            let string = objs.sort().join('&')
            let sign = sign(string, _this.appSecret);
            return sign == opts.sign
        }catch (err){
            return false
        }
    };
    

}


module.exports = SDK;