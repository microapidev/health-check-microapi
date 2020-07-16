const Service = require("./Service");
const {
  sendNotUpNotification,
  sendUpNotification,
  sendDownNotification,
} = require("./notification");
const getApiStatus = require("./getApiStatus");

class RequestLoop {
  constructor(services, updateDbStatus) {
    this.queue = services;
    this.intervalIds = new Map();
    this.healthManagement = new HealthManagement(services, updateDbStatus);
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
    }, 6000);
    this.intervalIds.set(service.service_name, intervalId);
  }

  checkHealth(service) {
    getApiStatus(service.service_url).then((status) => {
      this.healthManagement.manageService(service, status);
    });
  }
}

class HealthManagement {
  constructor(services, updateDbStatus) {
    this.servicesStatus = new Map(
      services.map((service) => [service.service_name, service.service_status])
    );
    this.updateDbStatus = updateDbStatus;
  }

  manageService(service, status) {
    let previousStatus = this.servicesStatus.get(service.service_name);
    this.servicesStatus.set(service.service_name, status);

    if (previousStatus === undefined && !status) {
      sendNotUpNotification(service.service_name);
    } else if (previousStatus !== status) {
      this.updateDbStatus(service.service_name, status);
      if (status) {
        sendUpNotification(service.service_name);
      } else {
        sendDownNotification(service.service_name);
      }
    }
  }
}

module.exports = RequestLoop;
