const listenForEvents = Symbol();

export default class FreeAllMedia {
  constructor() {
    this[listenForEvents]();
  }

  iframe(domID, campaignURL) {
    const container = window.document.getElementById(domID);

    if (container) {
      const iframeElement = window.document.createElement("iframe");
      iframeElement.frameBorder = 0;
      iframeElement.width = "100%";
      iframeElement.height = "100%";
      iframeElement.setAttribute("src", campaignURL);
      container.appendChild(iframeElement);
      return iframeElement;
    } else {
      throw new Error(`FAM: "${domID}" is not a valid DOM element ID.`);
    }
  }

  window(campaignURL) {
    return window.open(campaignURL);
  }

  on(eventName, eventHandler) {
    let handlerWrapper = function () { eventHandler(); };

    switch (eventName) {
      case "start":
      case "end":
      break;
      case "close":
      case "video:play":
      case "video:pause":
      case "video:end":
      case "video:mute":
      case "video:unmute":
      case "activity:start":
        handlerWrapper = function (event) {
          const activity = event.detail.activity;
          eventHandler(activity);
        };
      break;
      case "activity:end":
        handlerWrapper = function (event) {
          const activity = event.detail.activity;
          const results = event.detail.results;
          eventHandler(activity, results);
        };
      break;
      case "image:impression":
      case "image:clickthrough":
        handlerWrapper = function (event) {
          const activity = event.detail.activity;
          const creative = event.detail.creative;
          eventHandler(activity, creative);
        };
      break;
      default:
        throw new Error(`FAM: "${eventName}" is not a valid FAM event name. See README for full list of event names.`);
    }

    window.document.addEventListener(`fam:${eventName}`, handlerWrapper);
  }

  [listenForEvents]() {
    const eventListenerName = window.addEventListener ? "addEventListener" : "attachEvent";
    const eventListener = window[eventListenerName];
    const eventName = eventListenerName === "attachEvent" ? "onmessage" : "message";

    eventListener(eventName, event => {
      if (event.data.origin && event.data.origin === "FreeAllMedia") {
        const customEvent = new CustomEvent(event.data.event, { detail: event.data.payload });
        document.dispatchEvent(customEvent);
      }
    }, false);
  }
}
