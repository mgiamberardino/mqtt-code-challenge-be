import { Client } from "mqtt";
import Device, { DeviceInformation, IObserver } from "./Device";
import mqttInternalBroker from "./MQTTInternalBroker";

export default class MQTTDeviceController implements IObserver<DeviceInformation> {
  private commands = {
    LOCK: (device: Device) => device.switchLock(),
    POWER: (device: Device) => device.switchPower(),
  }
  constructor(private device: Device) {
    device.addObserver(this);
    mqttInternalBroker.addMessageListener(`device/${device.getId()}/cmd`, this.execute.bind(this))
  }
  public update(message: any) {
    mqttInternalBroker.publish(`device/${this.device.getId()}/status`, JSON.stringify(message));
  }
  public execute(cmd: string) {
    if (this.commands[cmd]) {
      this.commands[cmd](this.device);
    }
  }
}
