import { Observable } from 'rxjs';

export class LmWebSocket {
    private ws: WebSocket;
    constructor(uri: string) {
        this.ws = new WebSocket(uri);
    }
    LmObservable() {
        return new Observable(
            observer => {
                this.ws.onmessage = (event) => {
                    return observer.next(event.data);
                };
                this.ws.onerror = (event) => {
                    return observer.error(event);
                };
                this.ws.onclose = (event) => {
                    return observer.complete();
                };
            }
        );
    }

    send(msg: any) {
        if (this.ws && this.ws.readyState === 1) {
            this.ws.send(msg);
        }
    }

    /**
     * 关闭
     */
    close() {
        if (this.ws && this.ws.readyState === 1) {
            this.ws.close();
        }
    }
}
