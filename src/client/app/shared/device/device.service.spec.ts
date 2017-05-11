import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Observable } from 'rxjs/Observable';

import { DeviceService } from './device.service';

export function main() {
  describe('Device Service', () => {
    let deviceService: DeviceService;
    let mockBackend: MockBackend;

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          DeviceService,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
          }
        ]
      });
    });

    it('should return an Observable when get called', async(() => {
      expect(TestBed.get(DeviceService).get()).toEqual(jasmine.any(Observable));
    }));

    it('should resolve to device when get called', async(() => {
      let deviceService = TestBed.get(DeviceService);
      let mockBackend = TestBed.get(MockBackend);

      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify([
          {
            'attributes': {
            'brightness': 150,
            'friendly_name': 'Lightbringer',
            'max_mireds': 500,
            'min_mireds': 154,
            'supported_features': 1
            },
            'entity_id': 'light.lightbringer',
            'last_changed': '2017-05-10T13:26:47.856756+00:00',
            'last_updated': '2017-05-10T13:27:04.620333+00:00',
            'state': 'on'
          },
          {
            'attributes': {
            'azimuth': 115.8,
            'elevation': 85.54,
            'friendly_name': 'Sun',
            'next_dawn': '2017-05-11T23:53:44+00:00',
            'next_dusk': '2017-05-11T13:42:34+00:00',
            'next_midnight': '2017-05-11T18:48:22+00:00',
            'next_noon': '2017-05-11T06:48:23+00:00',
            'next_rising': '2017-05-12T00:17:13+00:00',
            'next_setting': '2017-05-11T13:19:06+00:00'
            },
            'entity_id': 'sun.sun',
            'last_changed': '2017-05-11T05:58:56.702453+00:00',
            'last_updated': '2017-05-11T06:31:30.699644+00:00',
            'state': 'above_horizon'
            },
            {
              'attributes': {
              'auto': true,
              'entity_id': [
              'light.lightbringer'
              ],
              'friendly_name': 'all lights',
              'hidden': true,
              'order': 0
              },
              'entity_id': 'group.all_lights',
              'last_changed': '2017-05-10T13:26:47.858098+00:00',
              'last_updated': '2017-05-10T13:26:47.858098+00:00',
              'state': 'on'
            }
          ])})));
      });

      deviceService.get().subscribe((data: any) => {
        expect(data).toEqual({id: 'light.lightbringer', name: 'Lightbringer', state: 'on', brightness: 150});
      });
    }));
  });
}
