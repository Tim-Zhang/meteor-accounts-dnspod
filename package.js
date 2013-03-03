Package.describe({
  summary: "Login service for DNSPod"
});

Package.on_use(function(api) {
  api.use('accounts-base', ['client', 'server']);
  api.use('accounts-oauth2-helper', ['client', 'server']);
  api.use('http', ['client', 'server']);

  api.add_files('dnspod_common.js', ['client', 'server']);
  api.add_files('dnspod_server.js', 'server');
  api.add_files('dnspod_client.js', 'client');
});
