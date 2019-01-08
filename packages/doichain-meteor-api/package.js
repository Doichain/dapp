Package.describe({
  name: 'doichain:doichain-meteor-api',
  version: '0.0.24',
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
            'nimble:restivus@0.8.12'
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
});


Npm.depends({
    '@babel/runtime':'7.2.0',
    'simpl-schema':'1.5.3',
    'scribe-js':'2.0.4',
    'namecoin': '0.1.4',
    'secp256k1':'3.6.1',
    'crypto-js':'3.1.9-1',
    'standard-ecies':'1.0.0',
    'bs58':'4.0.1',
    'hashids':'1.2.2',
    'bitcore-message':'1.0.4',
    'bitcore-lib':'0.16.0'
});


Package.onTest(api => {
     api.use('practicalmeteor:chai@2.1.0_1');
});