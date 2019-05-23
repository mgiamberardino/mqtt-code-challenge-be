import Device from "./Device";
import MQTTDeviceController from "./MQTTDeviceController";

for (const id of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
  new MQTTDeviceController(new Device(id, `Device${id}`, { interval: 5000 }));
}
