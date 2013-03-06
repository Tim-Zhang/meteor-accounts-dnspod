## accounts-dnspod

Meteor OAuth 2.0 login service for DNSPod

### Package Dependencies

* accounts
* accounts-oauth2-helper
* http
* templating

### Usage

1. `meteor add accounts-dnspod`
2. post https://www.dnspod.cn/Apps with parameter appname,callback,appindex and make sure you have logined, then make sure you set up your config and secret correctly.
3. simply add the `{{loginButtons}}` helper to an HTML file.

### Credits

* Shamelessly based on
  - [@meteor](https://github.com/meteor/meteor)'s Google OAuth2 login service
  - [@yonggao](https://github.com/yonggao/meteor-accounts-qq)'s QQ OAuth2 login service
  - [@erundook](https://github.com/erundook/meteor-accounts-vkontakte)'s VKontakte OAuth2 login service

