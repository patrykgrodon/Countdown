const modal = document.querySelector(".modal");
class eventView {
  constructor() {
    this._parentEl = document.querySelector(".events-box");
  }
  _clear() {
    this._parentEl.innerHTML = "";
  }
  render(events) {
    this._clear();
    events.forEach((ev) => {
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
  addHandlerEditEvent(handler) {
    this._parentEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("event__edit")) return;
      handler(e.target.closest(".event"));
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
}
export default new eventView();
