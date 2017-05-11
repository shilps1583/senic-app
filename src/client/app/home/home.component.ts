import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../shared/device/device.service';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {

  errorMessage: string;
  device: any = {};
  state: Boolean;
  brightness: number;
  constructor(public deviceService: DeviceService) {}

  ngOnInit() {
    this.getDevice();
  }

  getDevice() {
    this.deviceService.get()
      .subscribe(
        device => {
          this.device = device;
          this.state = this.device.state === 'on';
          this.brightness = this.device.brightness;
        },
        error => this.errorMessage = <any>error
      );
  }

  toggleState($event: any) {
    this.state = $event.target.checked;
    if (this.state !== this.device.state) {
      if (this.state) {
        this.deviceService.turnOn(this.device.id, this.device.brightness)
        .subscribe(
          device => {
            this.device = device;
          },
          error => this.errorMessage = <any>error
        );
      } else {
        this.deviceService.turnOff(this.device.id)
        .subscribe(
          device => {
            this.device = device;
          },
          error => this.errorMessage = <any>error
        );
      }
    }
  }

  setBrightness(level: number) {
    if (level < 0) {
      level = 0;
    } else if (level > 255) {
      level = 255;
    }
    if (level !== this.device.brightness) {
      this.brightness = level;
      this.deviceService.turnOn(this.device.id, this.brightness)
      .subscribe(
        device => {
          if (device) {
            this.device = device;
            this.state = this.device.state === 'on';
          }
        },
        error => this.errorMessage = <any>error
      );
    }
  }
}
