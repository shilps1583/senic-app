import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../config/env.config';

@Injectable()
export class DeviceService {

  constructor(private http: Http) {}

  get(): Observable<any> {
    return this.http.get(`${Config.API}api/states`)
                    .map((res: Response) => this.mapResponse(res.json()))
                    .catch(this.handleError);
  }

  turnOn(deviceId: string, brightness: number): Observable<any[]> {
    let data = {
      'entity_id': deviceId,
      'brightness': brightness
    };
    return this.http.post(`${Config.API}api/services/light/turn_on`,data)
                    .map((res: Response) => this.mapResponse(res.json(),deviceId))
                    .catch(this.handleError);
  }

  turnOff(deviceId: string): Observable<any[]> {
    let data = {
      'entity_id': deviceId
    };
    return this.http.post(`${Config.API}api/services/light/turn_off`,data,)
                    .map((res: Response) => this.mapResponse(res.json(),deviceId))
                    .catch(this.handleError);
  }

  private mapResponse(json: any, deviceId: string = '') : any {
    let lightDevice;
    if (deviceId !== '') {
      lightDevice = json.find((s: any) => s.entity_id === deviceId);
    } else {
      let lightGroup = json.find((s: any) => s.entity_id === 'group.all_lights');
      if (lightGroup) {
        lightDevice = json.find((s: any) => lightGroup.attributes.entity_id.some((e: any) => e === s.entity_id));
      }
    }
    //console.log(lightDevice);
    if (lightDevice) {
      let device = {
        id: lightDevice.entity_id,
        name: lightDevice.attributes.friendly_name,
        state: lightDevice.state,
        brightness: lightDevice.attributes.brightness
      };
      return device;
    }
    return null;
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}

