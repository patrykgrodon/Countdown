import { RANDOM_EVENT_MARGIN } from "../config.js";
class RandomView {
  constructor() {
    this._parentEl = document.querySelector(".random-box");
    this._currEl = "";
  }
  render(events) {
    events.forEach((ev) => {
      const eventEl = document.createElement("div");
      eventEl.classList.add("random__event");
      eventEl.dataset.id = ev.id;

      const markup = `
      <div class ="random__event__info">
      <h3 class="random__event__name">${ev.name}</h3>
      <p class="random__event__date">${ev.date}</p>
      <p class="random__event__time">${ev.time}</p>
      </div>
      <button class="random__event__btn">Dodaj do swoich wydarzeń</button>
      `;
      eventEl.insertAdjacentHTML("afterbegin", markup);
      this._parentEl.insertAdjacentElement("afterbegin", eventEl);
    });
    this._init();
  }
  _init() {
    let moves = 0;
    const { elCanBeDisplayed } = this._calcEventValues();
    let indexOfLastElementInView = elCanBeDisplayed - 1;
    const randomEvents = document.querySelectorAll(".random__event");
    this._moveSlider(randomEvents, moves, indexOfLastElementInView);
  }
  _moveSlider(randomEvents, moves, indexOfLastElementInView) {
    const { totalMargin, totalWidth, elCanBeDisplayed } =
      this._calcEventValues();
    randomEvents.forEach((ev) => {
      ev.style.margin = `0 ${totalMargin}rem`;
      ev.style.transform = `translateX(${-(totalWidth * moves)}rem)`;
    });
    indexOfLastElementInView += 1;
    if (indexOfLastElementInView > randomEvents.length - 1)
      indexOfLastElementInView = elCanBeDisplayed - 1;
    moves += 1;
    if (moves > randomEvents.length - elCanBeDisplayed) moves = 0;
    setTimeout(
      this._moveSlider.bind(
        this,
        randomEvents,
        moves,
        indexOfLastElementInView
      ),
      3000
    );
  }
  _calcEventValues() {
    const randomSectionWidth =
      document.querySelector(".random").offsetWidth / 10;
    const evWidth = document.querySelector(".random__event").offsetWidth / 10;
    const evMinMargin = RANDOM_EVENT_MARGIN;
    const evStartTotalWidth = evWidth + evMinMargin * 2;
    const elCanBeDisplayed = Math.floor(randomSectionWidth / evStartTotalWidth);
    const spaceLeft = randomSectionWidth - evStartTotalWidth * elCanBeDisplayed;
    const totalMargin = evMinMargin + spaceLeft / elCanBeDisplayed / 2;
    const totalWidth = evWidth + totalMargin * 2;
    return { totalMargin, totalWidth, elCanBeDisplayed };
  }
  addHandlerSlider(handler) {
    window.addEventListener("load", handler);
  }
  addHandlerAddEvent(handler) {
    const modal = document.querySelector(".modal");
    modal.addEventListener("click", (e) => {
      if (
        (!e.target.classList.contains("modal__answer-1") &&
          !e.target.classList.contains("modal__answer-2")) ||
        modal.dataset.type !== "add"
      )
        return;
      e.preventDefault();
      if (e.target.classList.contains("modal__answer-1")) {
        handler(this._currEl);
      }
      this._hideModal();
    });
  }
  addHandlerDisplayModal() {
    this._parentEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("random__event__btn")) return;
      const eventEl = e.target.closest(".random__event");
      this._currEl = eventEl;
      this._displayModal();
    });
  }
  getEventData(eventEl) {
    const name = eventEl.querySelector(".random__event__name").innerHTML;
    const date = eventEl.querySelector(".random__event__date").innerHTML;
    const time = eventEl.querySelector(".random__event__time").innerHTML;

    return { name, date, time };
  }
  _displayModal() {
    const modal = document.querySelector(".modal");
    const modalQuestion = document.querySelector(".modal__question");
    const currElName = this._currEl.querySelector(
      ".random__event__name"
    ).innerHTML;
    modal.classList.remove("hidden");
    modalQuestion.innerHTML = `
    Czy na pewno chcesz dodać wydarzenie ${currElName}?`;
    modal.dataset.type = "add";
  }
  _hideModal() {
    const modal = document.querySelector(".modal");
    modal.classList.add("hidden");

    modal.dataset.type = "none";
  }
}

export default new RandomView();
