const randomEvents = [
  {
    name: "Koniec wakacji",
    date: "2021-09-01",
    time: "00:00",
    id: 0,
  },

  {
    name: "Święta Bożego Narodzenia",
    date: "2021-12-24",
    time: "00:00",
    id: 1,
  },

  {
    name: "Nowy rok",
    date: "2022-01-01",
    time: "00:00",
    id: 2,
  },

  {
    name: "Święto Trzech Króli",
    date: "2022-01-06",
    time: "00:00",
    id: 3,
  },
  {
    name: "Pierwszy mecz Barcelony w La Liga",
    date: "2021-08-15",
    time: "20:00",
    id: 4,
  },
  {
    name: "El Clasico",
    date: "2021-10-24",
    time: "18:30",
    id: 5,
  },
  {
    name: "MŚ 2022 Katar",
    date: "2022-11-21",
    time: "00:00",
    id: 5,
  },
];
export const state = {
  events: [],
  randomEvents,
};

export const addEvent = function (data) {
  state.events.push({ ...data, id: state.events.length });
  setLocalStorage();
};

export const removeEvent = function (data) {
  const [elToDelete] = state.events.filter((ev) => ev.id === data.id);
  const elToDeleteIndex = state.events.indexOf(elToDelete);
  // Removing el from state
  state.events.splice(elToDeleteIndex, 1);
  setLocalStorage();
};

const setLocalStorage = function () {
  localStorage.setItem("events", JSON.stringify(state.events));
};

export const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem("events"));
  if (!data) return;

  state.events = data;

  return data;
};

const reset = function () {
  localStorage.removeItem("workouts");
};
