(function () {
  Accounts.oauth.registerService('dnspod', 2, function (query) {
    var config = Accounts.loginServiceConfiguration.findOne({
      service: 'dnspod'
    });
    if (!config) {
      throw new Accounts.ConfigError("DNSPod AuthService not configured");
    }

    var accessToken = getAccessToken(config, query);
    var identity = getIdentity(config, accessToken.accessToken);
    
    var returnVal = {
      serviceData: {
        id: identity.id,
        accessToken: accessToken.accessToken,
      },
      options: {
        profile: {
          id : identity.id
        }
      }
    };
    console.log(returnVal);
    return returnVal;
    
  });

  var getAccessToken = function (config, query) {
    var result = Meteor.http.post("https://www.dnspod.cn/OAuth/Access.Token", {
      params: {
        code: query.code,
        client_id: config.clientId,
        client_secret: config.secret,
        redirect_uri: Meteor.absoluteUrl("_oauth/dnspod?close"),
        grant_type: 'authorization_code'
      }
    });

    if (result.error) {
      console.log("Error in getting access token, details: " + result.error);
      throw result.error;
    }

    var content = JSON.parse(result.content);
    var dnspodAccessToken = content.access_token;

    return {
      accessToken: dnspodAccessToken
    };
  };

  var getIdentity = function (config, accessToken) {

    var userInfoResult = Meteor.http.post("https://dnsapi.cn/User.Detail", {
      params: {
        format: 'json',
        access_token: accessToken
      }
    });
    var userInfoContent = JSON.parse(userInfoResult.content);
    var user
    if (userInfoContent && userInfoContent.status && userInfoContent.status.code === "1") {
       user = userInfoContent.info.user;
    } else {
      console.log("Error in getting account's user information, details: " + userInfoContent.msg);
      throw new Error(userInfoContent.msg);
    }
    if (userInfoContent.ret) {// 'ret' > 0
      console.log("Error in getting account's user information, details: " + userInfoContent.msg);
      throw new Error(userInfoContent.msg);
    }

    return {
      id: user.id,
      name: user.nick,
      real_name: user.real_name
    };
  };
})();