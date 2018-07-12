const assert = require('assert');
const SDK = require('../index.js');

describe('sdk', function() {

    describe('#getUserInfo()', function () {
      it('should return -1 when the value is not present', function () {
        let sdk = new SDK({appUid: '111', appSecret: '222'});
        sdk.getUserInfo('1').then(function(res){
          console.log(res);
          assert.equal('0', res.code);
          assert.equal(32, res.data.length);
        }, function(error){
          assert(false, "Open API Don't work");
        });
      });
    });

    describe('#prePay()', function () {
      it('should return pay structure when the api is ok', function () {
        let sdk = new SDK({appUid: '111', appSecret: '222'});
        let params = {
          openUid: '',
          totalFee: '',
          outTradeNo: '',
          feeType: '',
          exchange: 'true',
          body: 'body',
        }
        sdk.prePay(params).then(function(res){
          console.log(res);
          assert.equal('0', res.code);
          assert.equal(32, res.data.length);
        }, function(error){
          assert(false, "Open API Don't work");
        });
      });
    });

    describe('#verifyNotifySign()', function () {
      it('should return true if verify the sign', function () {
        let sdk = new SDK({appUid: '111', appSecret: '222'});
        let params = {
          outTradeNo: '',
          totalFee: '',
          feeType: '',
          payAt: '',
          timestamp: '',
          scode: '',
          sign: '',
        }
        assert.equal(true, sdk.verifyNotifySign(params));
      });
    });

  });