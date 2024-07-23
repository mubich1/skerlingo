import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example13.app',
  appName: 'angular13App',
  webDir: 'www',
  server: {
    androidScheme: 'https'
    // url : 'http://192.168.18.84:4200',
    // cleartext : true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 500,
      splashFullScreen: true,
      launchFadeOutDuration: 100,
      showSpinner:true,
      androidSpinnerStyle: 'large',
      spinnerColor:'#F8830D'
    },
    GoogleAuth: {
      scopes: ["profile","email"],
      serverClientId: "869527433296-t8n6fdr55ejdscqutut20recsunho7jq.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
      clientId: "869527433296-t8n6fdr55ejdscqutut20recsunho7jq.apps.googleusercontent.com",
      androidClientId: "869527433296-t8n6fdr55ejdscqutut20recsunho7jq.apps.googleusercontent.com",
    },
  }
};

export default config;
