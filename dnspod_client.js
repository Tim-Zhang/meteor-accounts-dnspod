(function () {
  Meteor.loginWithDnspod = function (options, callback) {
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

    var scope = ['get_user_info'];
    if (Accounts.dnspod._options && Accounts.dnspod._options.scope) {
      scope = _.union(scope, Accounts.dnspod._options.scope);
    }
    var flatScope = _.map(scope, encodeURIComponent).join(',');

    var loginUrl = 
          'https://www.dnspod.cn/OAuth/Authorize' + 
          '?response_type=code' + 
          '&client_id=' + config.clientId + 
          '&redirect_uri=' + Meteor.absoluteUrl('_oauth/dnspod?close');

    Accounts.oauth.initiateLogin(state, loginUrl, callback);
  };

})();
