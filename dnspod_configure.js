Template.configureLoginServiceDialogForDnspod.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForDnspod.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'secret', label: 'Client secret'}
  ];
};
