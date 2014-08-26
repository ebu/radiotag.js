radiotag.js
===========

This project contains a javascript implementation of a RadioTAG client.

More information on RadioTAG: [RadioDNS.org](http://radiodns.org)

RadioTAG is based on [EBU-CPA](http://tech.ebu.ch/cpa) 
(EBU Cross-Platform Authentication) in order to authenticate tags.
A javascript library is available here: [cpa.js](https://github.com/ebu/cpa.js)


## Usage

### Installation with Bower

[Bower](https://github.com/bower/bower) is a package manager for the web.

> bower install radiotag.js


### RequireJS

You can use [RequireJS](http://requirejs.org/) in order to include the cpa library.

> HTML:

    <script data-main="js/main" src="require.js"></script>

> js/main.js 

    require.config({
      baseUrl: 'js',
      paths: {
        'radiotag': '../bower_components/radiotag.js/dist/radiotag.min'
      }
    });
    
    require(['radiotag'], function(radiotag) {
      radiotag.getAuthProvider('http://tag.ebu.io/', 
        function(err, authProvider) {
          console.log(err, authProvider.apBaseUrl, authProvider.modes);
        });
    });


### Stand-alone

You can use the RadioTag library directly in the HTML page:

    <script src="radiotag.js"></script>

The `radiotag` object is used to expose the library :
 
    <script>
       radiotag.getAuthProvider('http://tag.ebu.io/',  
         function(err, authProvider) {
           console.log(err, authProvider.apBaseUrl, authProvider.modes);
         });
    </script>
    
### Node.JS

Install the radiotag.js package using NPM:

    npm install radiotag.js

Use require to access within node:

    var radiotag = require('radiotag.js');

    radiotag.getAuthProvider('http://tag.ebu.io/',  
     function(err, authProviderBaseUrl, modes) {
       console.log(err, authProviderBaseUrl, modes);
     });

## Development 

### Build

> npm install

> bower install

> grunt


## Related Projects

Cross-Platform Authentication Javascript Library:
* [CPA.js](https://github.com/ebu/cpa.js)

This library has been developed alongside the EBU CPA Client Reference Implementation.
* [CPA Client](https://github.com/ebu/cpa-client)



## Contributors

* [Chris Needham](https://github.com/chrisn) (BBC)
* [Michael Barroco](https://github.com/barroco) (EBU)
* [Thomas Parisot](https://github.com/oncletom) (BBC)
* [Andrew Nicolaou](https://github.com/andrewn) (BBC)

## Copyright & License

Copyright (c) 2014, EBU-UER Technology & Innovation

The code is under BSD (3-Clause) License. (see LICENSE.txt)

