import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed
 } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { HomeComponent } from './home.component';
import { DeviceService } from '../shared/device/device.service';

export function main() {
  describe('Home component', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [HomeComponent],
        providers: [
          { provide: DeviceService, useValue: new MockDeviceService() }
        ]
      });

    });

    it('should work',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(HomeComponent);
            let homeInstance = fixture.debugElement.componentInstance;
            let homeDOMEl = fixture.debugElement.nativeElement;
            let mockDeviceService =
              fixture.debugElement.injector.get<any>(DeviceService) as MockDeviceService;
            let deviceServiceSpy = spyOn(mockDeviceService, 'get').and.callThrough();

            mockDeviceService.returnValue = {id: 'light.lightbringer', name: 'Lightbringer', state: 'on', brightness: 150};

            fixture.detectChanges();

            expect(homeInstance.deviceService).toEqual(jasmine.any(MockDeviceService));
            expect(homeInstance.state).toEqual(true);
            expect(homeInstance.brightness).toEqual(150);
            expect(homeDOMEl.querySelectorAll('.switch').length).toEqual(1);
            expect(homeDOMEl.querySelectorAll('.brightness').length).toEqual(1);
            expect(deviceServiceSpy.calls.count()).toBe(1);

            deviceServiceSpy = spyOn(mockDeviceService, 'turnOff').and.callThrough();
            mockDeviceService.returnValue = {id: 'light.lightbringer', name: 'Lightbringer', state: 'off'};
            homeInstance.toggleState({target:{checked:false}});
            fixture.detectChanges();
            expect(deviceServiceSpy.calls.count()).toBe(1);
            expect(homeInstance.state).toEqual(false);
            expect(homeDOMEl.querySelector('.brightness')).toEqual(null);

            deviceServiceSpy = spyOn(mockDeviceService, 'turnOn').and.callThrough();
            mockDeviceService.returnValue = {id: 'light.lightbringer', name: 'Lightbringer', state: 'on', brightness:150};
            homeInstance.toggleState({target:{checked:true}});
            fixture.detectChanges();
            expect(deviceServiceSpy.calls.count()).toBe(1);
            expect(homeInstance.state).toEqual(true);
            expect(homeDOMEl.querySelectorAll('.brightness').length).toEqual(1);
            expect(deviceServiceSpy.calls.count()).toBe(1);

            homeInstance.setBrightness(200);
            fixture.detectChanges();
            expect(deviceServiceSpy.calls.count()).toBe(2);
            expect(homeInstance.state).toEqual(true);
            expect(homeInstance.brightness).toEqual(200);
            expect(homeDOMEl.querySelectorAll('.brightness').length).toEqual(1);
          });

      }));
  });
}

class MockDeviceService {

  returnValue: any;

  get(): Observable<any> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }

  turnOn(): Observable<any> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }

  turnOff(): Observable<any> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }

  deviceEvents(): Observable<any> {
    return Observable.create((observer: any) => {
    });
  }
}
