import { Client, connect } from "mqtt";

const MQTT_HOST = process.env.MQTT_HOST || "mqtt://localhost";

class MQTTInternalBroker {
  private client: Client;
  private listeners: {[key: string]: Array<(msg: string) => void>} = {};
  constructor() {
    this.client = connect(MQTT_HOST);
    this.client.on("connect", (err) => {
      console.log(`MQTT Client connected successfully to ${MQTT_HOST}`);
    });
    this.client.on("message", this.handleMessage.bind(this));
  }
  public addMessageListener(topic, fn: (msg: string) => void) {
    if (!this.listeners[topic]) {
      this.listeners[topic] = [];
      this.client.subscribe(topic);
    }
    this.listeners[topic].push(fn);
  }
  public publish(topic: string, message: string) {
    this.client.publish(topic, message);
  }
  private handleMessage(topic: string, message: Buffer): void {
    if (this.listeners[topic]) {
      for (const fn of this.listeners[topic]) {
        fn(message.toString());
      }
    }
  }
}

export default new MQTTInternalBroker();
