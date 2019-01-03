Package.describe({
  name: 'doichain:doichain-meteor-api',
  version: '0.0.12',
  summary: 'Provides a Doichain REST API & webfrontend to an installed Doichain Node',
  git: 'https://github.com/Doichain/meteor-api.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {


    const use   = [
            'ecmascript',
            'mongo',
            'aldeed:collection2@3.0.1',
            'alanning:roles@1.2.16',
            'mdg:validated-method@1.2.0',
            'universe:i18n@1.20.1',
            'underscore@1.0.10',
            'vsivsi:job-collection@1.4.0',
            'nimble:restivus@0.8.12',
            'http@1.4.2'
        ],
        imply = [
            'mongo'
        ];

    api.versionsFrom('1.6.1');
    api.use(use);
    api.imply(imply);

    api.addFiles('private/version.json', 'server', { isAsset: true });
    api.mainModule('doichain-client-api.js', 'client');
    api.mainModule('doichain-server-api.js', 'server');
   // api.export('Doichain');
    //api.use('underscore@1.0.10',['client', 'server']);
  //api.use('aldeed:schema-index@3.0.0');
 //   api.use('aldeed:schema-deny@2.0.1','server');

  //api.use('accounts-password@1.5.1',['client', 'server']);

  //api.use('ddp-rate-limiter@1.0.7','server');
  //api.use('email@1.2.3','server');
  //api.use('http@1.4.2','server');
  //api.use('less@2.8.0','client');

  //api.use('planettraining:material-design-icons-font@2.2.3','client');

  //api.use('react-meteor-data@0.2.16','server');
  //api.use('rwatts:uuid@0.1.0','server');
  //api.use('sakulstra:aggregate@1.4.3','server');
  //api.use('session@1.2.0');
  //api.use('std:accounts-ui@1.3.3');
  //api.use('zetoff:accounts-material-ui@0.0.15');
});


Npm.depends({
    '@babel/runtime':'7.2.0',
    'simpl-schema':'1.5.3'
});
/*
'bcrypt': '1.0.3',
    'bitcore-message': '1.0.4',
    'bs58': '4.0.1',
    'classnames': '2.2.6',
    'crypto': '1.0.1',
    'crypto-js': '3.1.9-1',
    'fs': '0.0.1-security',
    'hashids': '1.2.2',
    'hoek': '5.0.3',
    'material-ui': '0.20.2',
    'meteor-node-stubs': '0.3.3',
    'mocha': '5.2.0',
    'namecoin': '0.1.4',
    'prop-types': '15.6.2',
    'react': '16.6.3',
    'react-addons-css-transition-group': '15.6.2',
    'react-dom': '16.6.3',
    'react-router': '3.2.1',
    'react-router-private-route': '0.0.3',
    'scribe-js': '2.0.4',
    'secp256k1': '3.5.0',
    'standard-ecies': '1.0.0',
    'uuid': '3.3.2' */

Package.onTest(api => {
     api.use('practicalmeteor:chai@2.1.0_1');
    // api.use([
    //     'accounts-base',
    //     'ecmascript',
    //     'tinytest',
    //     'random',
    //     'test-helpers',
    //     'oauth-encryption',
    //     'ddp',
    //     'accounts-password'
    // ]);
    //
    // api.addFiles('accounts_tests_setup.js', 'server');
    // api.mainModule('server_tests.js', 'server');
    // api.mainModule('client_tests.js', 'client');
});