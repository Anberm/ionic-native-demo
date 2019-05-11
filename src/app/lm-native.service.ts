import { Injectable } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
// import { Alipay } from '@ionic-native/alipay/ngx';
import { HotCodePush, HotCodePushRequestOptions } from '@ionic-native/hot-code-push/ngx';
// import { Wechat } from '@ionic-native/wechat/ngx';
import { Platform } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LmWebSocket } from './lm-websocket';


export interface NativeResult {
  IsSuccess: boolean;
  Result: any;
}
@Injectable()
export class LmNativeService {

  msgWS: LmWebSocket;
  constructor(public _qrScanner: QRScanner,
    // public _alipay: Alipay,
    public _hotCodePush: HotCodePush,
    // public _wechat: Wechat,
    public _device: Device,
    public _localNotify: LocalNotifications,
    public _backgroundMode: BackgroundMode,
    public plt: Platform
  ) {
    this.msgWS = new LmWebSocket('ws://121.40.165.18:8800');
    setInterval(() => {
      this.msgWS.send(new Date());
    }, 10000);
    this.msgWS.LmObservable().subscribe((x: string) => {
      const msg: ILocalNotification = {
        title: 'My first notification',
        text: x,
        foreground: true
      };
      this.schedule(msg);
    });
    document.addEventListener('deviceready', () => {
      // cordova.plugins.backgroundMode is now available
      // this._backgroundMode.excludeFromTaskList();
      console.log('-----------------------------deviceready----------------------------');
      this._backgroundMode.on('activate').subscribe(x => {
        console.log('-----------------------------activate----------------------------');
        console.log(x);
      });
    }, false);
  }

  isNative() {
    return this.plt.is('hybrid');
  }

  // 二维码扫码
  qrScan(): Promise<NativeResult> {
    return new Promise((resolve, reject) => {
      // Optionally request the permission early
      this._qrScanner.prepare()
        .then((status: QRScannerStatus) => {
          if (status.authorized) {
            // camera permission was granted


            // start scanning
            const scanSub = this._qrScanner.scan().subscribe((text: string) => {
              console.log('Scanned something', text);
              resolve({
                IsSuccess: true,
                Result: text
              });
              this._qrScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning
            });
            this._qrScanner.show();

          } else if (status.denied) {
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
            resolve({
              IsSuccess: false,
              Result: '无权限访问！'
            });
          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
            resolve({
              IsSuccess: false,
              Result: '权限被拒绝！'
            });
          }
        })
        .catch((e: any) => {
          resolve({
            IsSuccess: false,
            Result: e
          });
        });
    });
  }
  // 支付宝支付
  // aliPay(alipayOrder: string): Promise<NativeResult> {
  //   return new Promise((resolve, reject) => {
  //     // alipayOrder is a string that has been generated and signed by the server side.
  //     this._alipay.pay(alipayOrder)
  //       .then(result => {
  //         resolve({
  //           IsSuccess: true,
  //           Result: result
  //         });
  //       })
  //       .catch(error => {
  //         resolve({
  //           IsSuccess: false,
  //           Result: error
  //         });
  //       });
  //   });
  // }

  // 热更新
  hotCodePush(options: HotCodePushRequestOptions): Promise<NativeResult> {
    return new Promise((resolve, reject) => {
      this._hotCodePush.fetchUpdate(options).then(data => {
        resolve({
          IsSuccess: true,
          Result: data
        });

      }).catch(error => {
        resolve({
          IsSuccess: false,
          Result: error
        });
      });
    });
  }
  // 微信支付
  // wechatPay(params: any) {
  //   return new Promise((resolve, reject) => {
  //     this._wechat.sendPaymentRequest(params).then(result => {
  //       resolve({
  //         IsSuccess: true,
  //         Result: result
  //       });
  //     }).catch(error => {
  //       resolve({
  //         IsSuccess: false,
  //         Result: error
  //       });
  //     });
  //   });
  // }

  // 设备 uuid

  getDeviceUUID() {
    return new Promise((resolve, reject) => {
      resolve({
        IsSuccess: true,
        Result: this._device.uuid
      });

    });
  }

  // 本地消息
  schedule(params: ILocalNotification | ILocalNotification[]) {
    this._localNotify.schedule(params);
  }

  // 后台模式

  backgroundMode() {
    // this._backgroundMode.
  }

}
