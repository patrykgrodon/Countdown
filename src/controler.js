import * as model from "./model.js";

import formView from "../src/views/formView.js";
import randomView from "../src/views/randomView.js";
import eventView from "../src/views/eventView.js";

const controlEvents = function () {
  // 1. Render events
  const events = model.getLocalStorage();
  if (!events) return;
  eventView.render(events);
};

const controlAddEventForm = function (e) {
  // 1. Getting data from form
  const data = formView.getFormData(e);
  if (!data) {
    formView.changeContent(e, data);
    return;
  }
  // 2. Adding data to state
  model.addEvent(data);

  // 3. Render events
  eventView.render(model.state.events);
  eventView.scrollToEvents();
  // 4. Change formView
  formView.changeContent(e, data);
};
const controlRandomSlider = function () {
  randomView.render(model.state.randomEvents);
  // randomView.init();
};
const controlAddEventRandom = function (eventEl) {
  // 1. Getting data from randomEl
  const data = randomView.getEventData(eventEl);

  // 2. Adding data to state
  model.addEvent(data);
  // 3. Render events
  eventView.render(model.state.events);
  eventView.scrollToEvents();
};

const controlRemoveEvent = function (eventData) {
  // 1. Removing event from state
  model.removeEvent(eventData);

  // 2. Render events
  eventView.render(model.state.events);
};

const init = function () {
  controlEvents();
  formView.addHandlerToogleForm();
  eventView.addHandlerAddEvent(controlAddEventForm);
  eventView.addHandlerRemoveEvent(controlRemoveEvent);
  eventView.addHandlerDisplayModal();
  eventView.addHandlerScrollToEvents();
  randomView.addHandlerDisplayModal();
  randomView.addHandlerAddEvent(controlAddEventRandom);
  randomView.addHandlerSlider(controlRandomSlider);
};

init();
