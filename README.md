# skerlingo App Configuartion
* First Install the smart git on your Machine `https://www.syntevo.com/smartgit/download/`
* Clone the Project through Smart Git `https://github.com/Skerling/skerlingo.git`
* Install Node JS version 20.10.0    `https://nodejs.org/en/download`
* Install Angular Cli  (open Cmd From search bar at bottom) version 13.3.3
`npm install -g @angular/cli`

# How to Run Skerlingo App
* Open project root directory and run command `npm uninstall cordova-res  -f`
* Open project root directory and run command `npm install -g cordova-res –f`
* Open project root directory and run command `set NODE_OPTIONS=--openssl-legacy-provider`
* Open project root directory and run command `npm i –f`
* after successful npm i  now run  `ng serve -o` to open project in browser

-> if still getting errors in cli try following in order
* sudo npm uninstall cordova-res && sudo npm install -g cordova-res --unsafe-perm=true
* npm start


# Angular Migration 9 to 13 + Auth0 Implementation

* To implement Auth0, we first need to upgrade the version of the Skerlingo app to 13. The old version was in Angular 9, so we have to migrate Angular from 9 to 13 step by step.
* We upgrade the packages that are compatible with Angular 13.
* We also upgrade Cordova and Capacitor to be compatible with Android Studio.
* For the implementation of Auth0, we first create an account on Auth0 with the email 'support@skerlingo.com', and then add the configuration in Auth0.
* Auth0 provides us with the Domain and ClientID, which we use to make callback URLs and login CORS URLs with specific syntax. We add these callback URLs in Auth0 and make other changes, such as implementing Terms in Auth0.
Capacitor Angular Auth0 Callback URL: YOUR_PACKAGE_ID://dev-vt4ij30pzod3gqyx.us.auth0.com/capacitor/YOUR_PACKAGE_ID/callback
* When a user signs up in Auth0 after the account is created, we also register this account in our database by sending an API request. Before that, we check if the email is already registered. If registered, we create an account; if already registered, we do not allow the user to create an account.
* When a user wants to log out, we send an API call to Auth0 to log the user out.
* When a user wants to delete the account, we delete the user's information from Auth0 and our database.

Email: support@skerlingo.com / skerlingo
Auth0: support@skerlingo.com / Skerlingo123