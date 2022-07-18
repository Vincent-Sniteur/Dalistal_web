const drawer = document.getElementById("navigation-drawer");
const drawerButton = document.getElementById("navigation-drawer-toggler");
const drawerOverlay = document.getElementById("navigation-drawer-overlay");
const fab = document.getElementById("fab");

const timeDays = document.getElementById("timer-days");
const timeHours = document.getElementById("timer-hours");
const timeMinutes = document.getElementById("timer-minutes");
const timeSeconds = document.getElementById("timer-seconds");

let drawerIsOpen = false;

let lastTimeLeft = false;
let timeLeft = 1209600; // 14 days

let lastScrollY = 0;
let scrollY = 0;

function openDrawer() {
  if (!drawerIsOpen) {
    drawer.classList.add("drawer--open");
    drawerOverlay.classList.add("overlay--visible");
    drawerIsOpen = true;
  }
}

function closeDrawer() {
  if (drawerIsOpen) {
    drawer.classList.remove("drawer--open");
    drawerOverlay.classList.remove("overlay--visible");
    drawerIsOpen = false;
  }
}

function closeDrawerOnDesktop() {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  if (isDesktop && drawerIsOpen) closeDrawer();
}

function getFormatedTime(seconds) {
  const formatedTime = { seconds: seconds };
  formatedTime.days = Math.floor(formatedTime.seconds / 86400);
  formatedTime.seconds %= 86400;
  formatedTime.hours = Math.floor(formatedTime.seconds / 3600);
  formatedTime.seconds %= 3600;
  formatedTime.minutes = Math.floor(formatedTime.seconds / 60);
  formatedTime.seconds %= 60;
  Object.keys(formatedTime).forEach((unit) => {
    formatedTime[unit] = (`0${formatedTime[unit].toString()}`.slice(-2));
  });
  return formatedTime;
}

function displayTime(seconds = timeLeft) {
  const time = getFormatedTime(seconds);
  if (lastTimeLeft && time.days !== lastTimeLeft.days) timeDays.innerText = time.days;
  if (lastTimeLeft && time.hours !== lastTimeLeft.hours) timeHours.innerText = time.hours;
  if (lastTimeLeft && time.minutes !== lastTimeLeft.minutes) timeMinutes.innerText = time.minutes;
  if (lastTimeLeft && time.seconds !== lastTimeLeft.seconds) timeSeconds.innerText = time.seconds;
  lastTimeLeft = time;
}

function decreaseTime() {
  timeLeft = timeLeft - 1;
  displayTime(timeLeft);
  if (timeLeft <= 0) clearInterval(intervalID);
}

function showFab() {
  scrollY = window.scrollY;
  if (scrollY > 0 && scrollY > lastScrollY) {
    fab.classList.add("fab--visible");
  } else if (scrollY <= 0 && scrollY < lastScrollY) {
    fab.classList.remove("fab--visible");
  }
  lastScrollY = scrollY;
}

function scrollTop(event) {
  event.preventDefault();
  window.scrollTo(0, 0);
}

drawerButton.addEventListener("click", openDrawer);
drawerOverlay.addEventListener("click", closeDrawer);
fab.addEventListener("click", scrollTop);
window.addEventListener("resize", closeDrawerOnDesktop);
window.addEventListener("scroll", showFab)

displayTime();
const intervalID = setInterval(decreaseTime, 1000);
