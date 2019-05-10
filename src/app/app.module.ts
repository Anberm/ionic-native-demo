import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { HotCodePush } from '@ionic-native/hot-code-push/ngx';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { Alipay } from '@ionic-native/alipay/ngx';
import { Wechat } from '@ionic-native/wechat/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Device } from '@ionic-native/device/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

//#region providers

export const PROVIDERS = [
  //#region native
  StatusBar,
  SplashScreen,
  NativePageTransitions,
  AppMinimize,
  HotCodePush,
  QRScanner,
  Alipay,
  Wechat,
  Device,
  LocalNotifications,
  BackgroundMode,
  //#endregion
];
//#endregion
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
   ...PROVIDERS,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
