const Service = require("./Service");
const {
  sendNotUpNotification,
  sendUpNotification,
  sendDownNotification,
} = require("./notification");

class RequestLoop {
  constructor(subscribedServices) {
    this.queue = subscribedServices;
    this.intervalIds = new Map();
    this.healthManagement = new HealthManagement();
    this.sampleStatus = 0;
  }

  start() {
    this.queue.forEach((service) => {
      this.addOne(service);
    });
  }

  stopAll() {
    for (let intervalId of this.intervalIds.values()) {
      clearInterval(intervalId);
    }
    this.intervalIds.clear();
  }

  stopOne(name) {
    clearInterval(this.intervalIds.get(name));
    this.intervalIds.delete(name);
  }

  addOne(service) {
    let intervalId = setInterval(() => {
      this.checkHealth(service);
    }, 5000);
    this.intervalIds.set(service.name, intervalId);
  }

  checkHealth(service) {
    let status = this.sampleStatus;
    console.log(`Checking ${service.name}`);
    this.healthManagement.manageService(service, status);
  }
}

class HealthManagement {
  constructor() {
    this.servicesStatus = new Map();
  }

  manageService(service, status) {
    let previousStatus = this.servicesStatus.get(service.name);
    this.servicesStatus.set(service.name, status);

    if (previousStatus === undefined && status === 0) {
      sendNotUpNotification(service.name);
    } else if (previousStatus !== status) {
      if (status === 1) {
        sendUpNotification(service.name);
      } else if (status === 0) {
        sendDownNotification(service.name);
      }
    }
  }
}
let dummy = [
  ["comment", "comment url"],
  ["auth", "auth url"],
  ["user", "user url"],
];
let services = dummy.map(([name, url]) => new Service(name, url));

let loop = new RequestLoop(services);
loop.start();

setTimeout(() => loop.stopAll(), 20000);
module.exports = RequestLoop;
