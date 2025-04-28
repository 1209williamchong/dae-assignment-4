import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dae.assignment4',
  appName: '開源軟體瀏覽器',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'android.keystore',
      keystoreAlias: 'androiddebugkey',
      keystorePassword: 'android',
      keystoreKeyPassword: 'android'
    }
  }
};

export default config; 