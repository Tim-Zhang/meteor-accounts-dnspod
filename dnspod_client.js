(function () {
  Meteor.loginWithDnspod = function (options, callback) {
    console.log(options);
    console.log(callback);
    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }
    
    var config = Accounts.loginServiceConfiguration.findOne({
      service: 'dnspod'
    });
    if (!config) {
      callback && callback(new Accounts.ConfigError("Service not configured"));
      return;
    }

    var state = Meteor.uuid();
    console.log(state);

    var loginUrl = 
          'https://www.dnspod.cn/OAuth/Authorize' + 
          '?client_id=' + config.clientId + 
          '&redirect_uri=' + Meteor.absoluteUrl('_oauth/dnspod?close=close') +
          '&response_type=code'+
          '&state=' + state;
          ;

    Accounts.oauth.initiateLogin(state, loginUrl, callback);
  };

})();
