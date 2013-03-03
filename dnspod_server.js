(function () {
  Accounts.oauth.registerService('dnspod', 2, function (query) {
    var config = Accounts.loginServiceConfiguration.findOne({
      service: 'qq'
    });
    if (!config) {
      throw new Accounts.ConfigError("DNSPod AuthService not configured");
    }

    var accessToken = getAccessToken(config, query);
    var identity = getIdentity(config, accessToken.accessToken);
    
    return {
      serviceData: {
        id: identity.id,
        accessToken: accessToken.accessToken
      },
      options: {
        profile: {
          openId : identity.id,
          name: identity.name,
          figureUrl: identity.figureUrl,
          figureUrlAt50 : identity.figureUrlAt50,
          figureUrlAt100 : identity.figureUrlAt100,
          level: identity.level
        }
      }
    };
    
  });

  var getAccessToken = function (config, query) {
    var result = Meteor.http.get("https://www.dnspod.cn/OAuth/Access.Token", {
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

    var dnspodAccessToken;
    _.each(result.content.split('&'), function (kvString) {
      var kvArray = kvString.split('=');
      if (kvArray[0] === 'access_token')
        dnspodAccessToken = kvArray[1];
    });
    return {
      accessToken: dnspodAccessToken
    };
  };

  var getIdentity = function (config, accessToken) {
    var meResult = Meteor.http.get("https://www.dnspod.cn/User.Detail", {
      params: {
        access_token: accessToken
      }
    });

    // The response content in /me requires trickly JSONP callback to parse
    var meContent = {};
    var callbackExp = /^\s*callback\s*\((.+)\)\s*;\s*$/;
    var matched = meResult.content.match(callbackExp);
    if (matched && matched.length === 2) {
      meContent = JSON.parse(matched[1]);
      if (meContent.error) {
        console.log("Error in getting account's open id, details: " + meContent.error);
        throw new Error(meContent.error);
      }
    } else {
      throw new Error("Error in getting account's open id");
    }

    var userInfoResult = Meteor.http.get("https://www.dnspod.cn/User.Detail", {
      params: {
        access_token: accessToken,
        oauth_consumer_key: config.clientId,
        openid: meContent.openid
      }
    });
    var userInfoContent = JSON.parse(userInfoResult.content);
    if (userInfoContent.ret) {// 'ret' > 0
      console.log("Error in getting account's user information, details: " + userInfoContent.msg);
      throw new Error(userInfoContent.msg);
    }

    return {
      id: meContent.openid,
      name: userInfoContent.nickname,
      figureUrl: userInfoContent.figureurl,
      figureUrlAt50: userInfoContent.figureurl_1,
      figureUrlAt100: userInfoContent.figureurl_2,
      level: userInfoContent.level
    };
  };
})();
