const deps = require('../../package.json').dependencies;
const mf = require('@angular-architects/module-federation/webpack');
const sharedMappings = new mf.SharedMappings();

 module.exports = mf.withModuleFederationPlugin({
   name: "history-app",

   exposes: {
     "./routes": "./src/app/routes.ts",

     "./web-components": "./src/bootstrap.ts",
   },

   shared: mf.share({
    
    '@angular/core': { requiredVersion: deps['@angular/core'] },
    '@angular/common': { requiredVersion: deps['@angular/common'] },
    '@angular/common/http': { requiredVersion: deps['@angular/common'] },
    '@angular/router': { requiredVersion: deps['@angular/router'] },
    '@angular/forms': { requiredVersion: deps['@angular/forms'] },
    '@angular/platform-browser': { requiredVersion: deps['@angular/platform-browser'] },
    '@angular/platform-browser/animations': { requiredVersion: deps['@angular/platform-browser'] },
    '@angular/animations': { requiredVersion: deps['@angular/animations'] },
    
    "rxjs": { requiredVersion: deps['rxjs'] },
    'rxjs/operators': { requiredVersion: deps['rxjs'] },
    
    '@angular/cdk': { requiredVersion: deps['@angular/cdk'] },
    '@angular/material/core': { requiredVersion: deps['@angular/material'] },
    '@angular/material/sidenav': { requiredVersion: deps['@angular/material'] },
    '@angular/material/icon': { requiredVersion: deps['@angular/material'] },
    '@angular/material/button': { requiredVersion: deps['@angular/material'] },
    '@angular/material/divider': { requiredVersion: deps['@angular/material'] },
    '@angular/material/input': { requiredVersion: deps['@angular/material'] },
    '@angular/material/form-field': { requiredVersion: deps['@angular/material'] },
    '@angular/material/autocomplete': { requiredVersion: deps['@angular/material'] },
    '@angular/material/dialog': { requiredVersion: deps['@angular/material'] },
    '@angular/material/menu': { requiredVersion: deps['@angular/material'] },
    '@angular/material/snack-bar': { requiredVersion: deps['@angular/material'] },
    '@angular/cdk/layout': { requiredVersion: deps['@angular/material'] },

    '@youtube/common-ui': {requiredVersion: false},
    
    '@ngrx/store': { requiredVersion: deps['@ngrx/store'] },
   ...sharedMappings.getDescriptors(),
  }),

 });