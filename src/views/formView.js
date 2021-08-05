const formHeader = document.querySelector(".form__header");
const formInputs = document.querySelectorAll(".form__input");
const formLabels = document.querySelectorAll(".form__label");
const formValids = document.querySelectorAll(".form__valid");
const formAddBtn = document.querySelector(".form__btn--add");
const formAddNextBtn = document.querySelector(".form__btn--add-next");

class formView {
  constructor() {
    this._open = false;
    this._form = document.querySelector(".form");
  }

  _clear() {
    const formNameEl = document.querySelector(".form__name");
    const formDateEl = document.querySelector(".form__date");
    const formTimeEl = document.querySelector(".form__time");
    formNameEl.value = "";
    formDateEl.value = "";
    formTimeEl.value = "";
  }
  _init() {
    formHeader.innerHTML =
      "Wpisz informacje dotyczące wydarzenia, które chcesz dodać do Minutnika.";
    formAddBtn.classList.remove("hidden");
    formAddNextBtn.classList.add("hidden");
    formInputs.forEach((input) => input.classList.remove("hidden"));
    formLabels.forEach((label) => label.classList.remove("hidden"));
    this._clear();
  }

  _displayAddNextView() {
    formHeader.innerHTML = "Wydarzenie zostało dodane do twojej listy.";
    formAddBtn.classList.add("hidden");
    formAddNextBtn.classList.remove("hidden");
    formInputs.forEach((input) => input.classList.add("hidden"));
    formLabels.forEach((label) => label.classList.add("hidden"));
    formValids.forEach((valid) => valid.classList.add("hidden"));
    this._clear();
  }
  addHandlerToogleForm() {
    document.body.addEventListener("click", (e) => {
      if (
        !e.target.classList.contains("display__form") &&
        !e.target.classList.contains("form__btn--close")
      )
        return;
      e.preventDefault();
      if (e.target.classList.contains("display__form")) this._openForm();
      if (e.target.classList.contains("form__btn--close")) this._closeForm();
    });
  }

  getFormData(e) {
    if (e.target.classList.contains("form__btn--add-next")) return;
    const eventName = document.querySelector(".form__name").value;
    const eventDate = document.querySelector(".form__date").value;
    const eventTime = document.querySelector(".form__time").value || "00:00";

    const validation = this._checkValidation(eventName, eventDate);

    return validation
      ? { name: eventName, date: eventDate, time: eventTime }
      : validation;
  }
  showEventExistMsg() {
    const formNameEl = document.querySelector(".form__name");
    document.querySelector(".form__valid-name").textContent =
      "Wydarzenie o tej nazwie już istnieje.";
    this._showValidText(formNameEl, "name");
    this._hideValidText(formNameEl, "name");
  }
  _showValidText(el, inputType) {
    el.style.border = "1px solid red";
    el.style.boxShadow = "0 0 0 1px red";
    document
      .querySelector(`.form__valid-${inputType}`)
      .classList.remove("hidden");
    document
      .querySelector(`.form__valid-${inputType}`)
      .classList.add("form__valid");
  }
  _hideValidText(el, inputType) {
    setTimeout(() => {
      el.style.border = "1px solid var(--color-secondary)";
      el.style.boxShadow = "none";
      document
        .querySelector(`.form__valid-${inputType}`)
        .classList.add("hidden");
      document
        .querySelector(`.form__valid-${inputType}`)
        .classList.remove("form__valid");
    }, 3000);
  }
  _checkValidation(eventName, eventDate) {
    const nameValidation =
      eventName && eventName.length >= 3 && eventName.length < 30
        ? true
        : false;
    const dateValidation = eventDate ? true : false;
    const validation = nameValidation && dateValidation;
    if (!nameValidation) {
      const formNameEl = document.querySelector(".form__name");
      document.querySelector(".form__valid-name").textContent =
        "Wpisz nazwę wydarzenia(min. 3 znaki max. 30).";

      this._showValidText(formNameEl, "name");
      this._hideValidText(formNameEl, "name");
    }
    if (!dateValidation) {
      const formDateEl = document.querySelector(".form__date");
      this._showValidText(formDateEl, "date");
      this._hideValidText(formDateEl, "date");
    }
    return validation;
  }
  changeView(e, validation) {
    if (e.target.classList.contains("form__btn--add-next")) {
      this._init();
      return;
    }
    if (!validation) return;
    this._displayAddNextView();
  }

  _openForm() {
    if (this._open) return;
    this._open = true;
    this._form.classList.remove("hidden");
  }

  _closeForm() {
    if (!this._open) return;
    this._open = false;
    this._form.classList.add("hidden");
    this._init();
  }
}
export default new formView();
