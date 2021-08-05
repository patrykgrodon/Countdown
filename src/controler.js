import * as model from "./model.js";

import formView from "../src/views/formView.js";
import randomView from "../src/views/randomView.js";
import eventView from "../src/views/eventView.js";

const controlEvents = function () {
  // 1. Get events from storage
  const events = model.getLocalStorage();
  // 2. Render events
  eventView.render(events);
};

const controlSearchEvents = function (input) {
  // 1. Display correct Events
  eventView.searchEvents(input, model.state.events);
};

const controlAddEventForm = function (e) {
  // 1. Getting data from form
  const data = formView.getFormData(e);
  if (!data) {
    formView.changeView(e, data);
    return;
  }
  // 2. Checking if event already exist
  if (
    model.state.events.some(
      (ev) => ev.name.toLowerCase() === data.name.toLowerCase()
    )
  ) {
    formView.showEventExistMsg();
    return;
  }
  // 3. Adding data to state
  model.addEvent(data);

  // 4. Render events
  eventView.render(model.state.events);

  // 5. Scroll to added event
  eventView.scrollToEvents();

  // 6. Change formView
  formView.changeView(e, data);
};
const controlRemoveEvent = function (eventData) {
  // 1. Removing event from state
  model.removeEvent(eventData);

  // 2. Render events
  eventView.render(model.state.events);
};
const controlAddEventRandom = function (eventEl) {
  // 1. Getting data from randomEl
  const data = randomView.getEventData(eventEl);
  // 2. Checking if event is already added
  if (
    model.state.events.some(
      (ev) => ev.name.toLowerCase() === data.name.toLowerCase()
    )
  ) {
    eventView.scrollToEvent(data.name);
    return;
  }
  // 3. Adding data to state
  model.addEvent(data);

  // 4. Render events
  eventView.render(model.state.events);

  // 5. Scroll to added event
  eventView.scrollToEvents();
};
const controlSlider = function () {
  randomView.render(model.state.randomEvents);
};

const init = function () {
  controlEvents();
  formView.addHandlerToogleForm();
  eventView.addHandlerAddEvent(controlAddEventForm);
  eventView.addHandlerRemoveEvent(controlRemoveEvent);
  eventView.addHandlerDisplayModal();
  eventView.addHandlerScrollToEvents();
  eventView.addHandlerSearchEvents(controlSearchEvents);
  eventView.addHandlerSortEvents();
  randomView.addHandlerDisplayModal();
  randomView.addHandlerAddEvent(controlAddEventRandom);
  randomView.addHandlerInitSlider(controlSlider);
};

init();
