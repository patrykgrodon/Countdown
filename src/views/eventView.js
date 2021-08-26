const modal = document.querySelector(".modal");
class eventView {
  constructor() {
    this._parentEl = document.querySelector(".events-box");
    this._events = [];
    this._sort = {
      active: false,
      type: "",
    };
  }
  _clear() {
    this._parentEl.innerHTML = "";
  }
  render(events, search = false) {
    this._events = events;
    this._clear();
    if (events.length === 0 && search === false) {
      this._displayNoEventsMessage();
      return;
    }
    this._hideNoEventsMessage();
    if (this._sort.active === true) this._sortEvents(this._sort.type);
    this._events.forEach((ev) => {
      const eventEl = document.createElement("div");
      eventEl.classList.add("event");
      eventEl.dataset.id = ev.id;

      const markup = `
      <div class ="event__info">
      <h3 class="event__name">${ev.name}</h3>
      <p class="event__date">${ev.date}</p>
      <p class="event__time">${ev.time}</p>

      </div>
      <p class="event__countdown"><span class="event__countdown-placeholder"></span></p>
       <img src="../../img/trash.svg" class="event__delete">
       </img>
      `;
      eventEl.insertAdjacentHTML("afterbegin", markup);
      this._parentEl.insertAdjacentElement("afterbegin", eventEl);
      this.startCountdown(eventEl);
    });
  }
  searchEvents(input, events) {
    const searchedEvents = events.filter((ev) => {
      const eventName = ev.name.toLowerCase();
      const inputValue = input.value.toLowerCase();
      return eventName.includes(inputValue);
    });
    this.render(searchedEvents, true);
    if (searchedEvents.length === 0) this._displayNoResultsMsg();
  }
  _sortEvents(type) {
    this._events.sort((a, b) => {
      const dateA = new Date(a.date.replaceAll("-", ", ") + " " + a.time);
      const dateB = new Date(b.date.replaceAll("-", ", ") + " " + b.time);
      return type === "desc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
  }
  addHandlerSearchEvents(handler) {
    const input = document.querySelector(".events__filter__input");
    input.addEventListener("input", () => {
      handler(input);
    });
  }
  addHandlerSortEvents() {
    const parentEl = document.querySelector(".events__filter__sort");
    parentEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("events__filter__btn")) return;
      if (e.target.classList.contains("events__filter__display"))
        this._toogleSort();
      if (e.target.classList.contains("events__sort")) {
        const sortType = e.target.dataset.type;
        this._sort.active = true;
        this._sort.type = sortType;
        this.render(this._events, "", sortType);
        if (sortType === "desc") {
          e.target.classList.add("events__filter__btn--active");
          document
            .querySelector(".events__sort--asc")
            .classList.remove("events__filter__btn--active");
        }
        if (sortType === "asc") {
          e.target.classList.add("events__filter__btn--active");
          document
            .querySelector(".events__sort--desc")
            .classList.remove("events__filter__btn--active");
        }
      }
    });
  }
  addHandlerAddEvent(handler) {
    const form = document.querySelector(".form");
    form.addEventListener("click", function (e) {
      if (!e.target.classList.contains("form__btn")) return;
      e.preventDefault();
      if (e.target.classList.contains("form__btn--add-next")) {
        handler(e);
        return;
      }
      handler(e);
    });
  }
  addHandlerRemoveEvent(handler) {
    modal.addEventListener("click", (e) => {
      e.preventDefault();
      if (
        (!e.target.classList.contains("modal__answer-1") &&
          !e.target.classList.contains("modal__answer-2")) ||
        modal.dataset.type !== "del"
      )
        return;
      if (e.target.classList.contains("modal__answer-1")) {
        const { date, time, eventId } = this._getEventData(this._currEl);
        handler({ date, time, id: eventId });
      }
      this._hideModal();
    });
  }
  addHandlerDisplayModal() {
    this._parentEl.addEventListener("click", (e) => {
      e.preventDefault();
      if (!e.target.classList.contains("event__delete")) return;
      this._currEl = e.target.closest(".event");
      this._displayModal();
    });
  }

  addHandlerScrollToEvents() {
    document.querySelector("body").addEventListener("click", (e) => {
      if (!e.target.classList.contains("display__events")) return;
      this.scrollToEvents();
    });
  }
  scrollToEvents() {
    document.querySelector(".events").scrollIntoView({ behavior: "smooth" });
  }
  scrollToEvent(eventName) {
    const eventsEl = Array.from(this._parentEl.querySelectorAll(".event"));
    const event = eventsEl.find((ev) => {
      const evName = ev.querySelector(".event__name").textContent;
      return evName === eventName;
    });

    event.scrollIntoView({ behavior: "smooth" });
  }
  startCountdown(el) {
    const eventEl = el.closest(".event");
    const { date, time } = this._getEventData(eventEl);
    const countDownTo = new Date(date.replaceAll("-", ", ") + " " + time);
    this._countdown(countDownTo, eventEl);
  }

  _countdown(countDownTo, eventEl) {
    const now = new Date().getTime();
    const distance = countDownTo - now;
    if (distance < 0) {
      eventEl.querySelector(".event__countdown").innerHTML =
        "Odliczanie zakończone!";
      clearInterval(this);
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const string = `${days ? days + "d " : ""} ${hours ? hours + "h " : ""} ${
      minutes ? minutes + "m " : ""
    }   ${seconds + "s"}`;
    eventEl.querySelector(".event__countdown-placeholder").innerHTML = string;
    setTimeout(this._countdown.bind(this, countDownTo, eventEl), 1000);
  }
  _getEventData(eventEl) {
    const date = eventEl.querySelector(".event__date").innerHTML;
    const time = eventEl.querySelector(".event__time").innerHTML;
    const eventId = +eventEl.dataset.id;

    return { date, time, eventId };
  }
  _displayModal() {
    const modalQuestion = document.querySelector(".modal__question");
    const currElName = this._currEl.querySelector(".event__name").innerHTML;
    modal.classList.remove("hidden");
    modalQuestion.innerHTML = `
    Czy na pewno chcesz usunąć wydarzenie ${currElName}?`;

    modal.dataset.type = "del";
  }
  _hideModal() {
    const modal = document.querySelector(".modal");
    modal.classList.add("hidden");

    modal.dataset.type = "none";
  }
  _displayNoEventsMessage() {
    document
      .querySelector(".events__valid__message")
      .classList.remove("hidden");
    document.querySelector(".events__header").classList.add("hidden");
    document.querySelector(".events__filter").classList.add("hidden");
  }
  _hideNoEventsMessage() {
    document.querySelector(".events__valid__message").classList.add("hidden");
    document.querySelector(".events__header").classList.remove("hidden");
    document.querySelector(".events__filter").classList.remove("hidden");
  }
  _toogleSort() {
    document.querySelector(".events__filter__list").classList.toggle("hide");
  }
  _displayNoResultsMsg() {
    this._parentEl.innerHTML = `<h3 class="events-box__header">Brak wyników</h3>`;
  }
}
export default new eventView();
