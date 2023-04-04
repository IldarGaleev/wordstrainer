const guiStrings={
  Start:"Начать",
  Stop:"Остановить",
  ImportWordsFromFile:"",
}


let timeInterval = 5000;
let answerTime = 0.8;

let timerElement = document.querySelector("div#timeDisplay");
let timebar = document.querySelector("div#estimated-time");
let showAnswerTime = document.querySelector("input#showAnswerTime");
let wordN = document.querySelector("#wordN");
let wordElement = document.querySelector("#word");
let pronounceElement = document.querySelector("#pronounce");
let translationElement = document.querySelector("#translate");


let wordsFile = document.querySelector("input#wordsFile");

let hideOnStart = document.querySelectorAll(".hideOnStart");

let durationInput = document.querySelector("input#durationInput");
let timerBtn = document.querySelector("button#timerBtn");

let currentWordN = 0;
let currentWord = null;

let list = [
  { w: "えんぴつ", p: "ЭМПиЦУ", t: "Карандаш" },
  { w: "いえ", p: "ИЭ", t: "Дом" },
  { w: "いいえ", p: "И:Э", t: "Нет" },
  { w: "いい", p: "И:", t: "Хороший" },
  { w: "いけ", p: "ИКЭ", t: "Пруд" },
  { w: "き", p: "КИ", t: "Дерево" },
  { w: "あかい", p: "АКАЙ", t: "Красный" },
];

let workList = [];
let badWords = [];
let badWordsStorage = {};

function reloadWords() {
  if (localStorage.wordsList != null) {
    list = JSON.parse(localStorage.wordsList);
    workList = [];
    randomWord();
  }
}

function reloadProperty() {
  if (localStorage.timeInterval != null) {
    timeInterval = Number(localStorage.timeInterval);
    durationInput.value = timeInterval / 1000;
  }

  if (localStorage.answerTime != null) {
    let st = Number(localStorage.answerTime);
    answerTime = 1 - st;
    showAnswerTime.value = st;
  }

  if (localStorage.badWords != null) {
    badWordsStorage = JSON.parse(localStorage.badWords);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomWord() {
  if (workList.length === 0) {
    workList = prepareWords(list);
  }
  currentWordN += 1;
  wordN.textContent = currentWordN;
  id = getRandomInt(workList.length);
  let w = workList.splice(id, 1)[0];
  currentWord = w;
  displayWord(w);
}

function prepareWords(sourceList) {
  currentWordN = 0;
  if (badWords.length > 0) {
    let newL = Array.from(badWords);
    badWords = [];
    return newL;
  } else {
    return Array.from(sourceList);
  }
}

function displayWord(w) {
  wordElement.textContent = w.w;
  pronounceElement.textContent = w.p;
  translationElement.textContent = w.t;
}

let estimatedTimer = null;
function startTimer() {

  let newInterval = Math.max(1, Number(durationInput.value)) * 1000;
  localStorage.timeInterval = newInterval;
  timeInterval = newInterval;

  let timerBarKeyframes = [
    { width: "100%" },
    { width: 0 }
  ];
  let k = 1 / timeInterval;

  let easeInKeyframe = [
    { opacity: 0 },
    { opacity: 1, offset: (k * 150) },
    { opacity: 1, offset: (k * (timeInterval - 300)) },
    { opacity: 0 }
  ];


  let animationArgs = { duration: timeInterval };

  function timeHandler() {
    wordN.style.opacity = 0;
    wordElement.style.opacity = 0;
    pronounceElement.style.opacity = 0;
    translationElement.style.opacity = 0;
    randomWord();

    let hiddenElementKeyframes = [
      { opacity: 0 },
      { opacity: 0, offset: answerTime, easing: 'ease-out' },
      { opacity: 1, offset: (k * (timeInterval - 300)) },
      { opacity: 0 }
    ];
    wordN.animate(easeInKeyframe, animationArgs);
    wordElement.animate(easeInKeyframe, animationArgs);
    timebar.animate(timerBarKeyframes, animationArgs);
    pronounceElement.animate(hiddenElementKeyframes, animationArgs);
    translationElement.animate(hiddenElementKeyframes, animationArgs);
  }

  timerElement.style.visibility = "visible";
  hideOnStart.forEach(x => { x.style.display = "none" });

  timeHandler();
  estimatedTimer = setInterval(timeHandler, timeInterval + 100, 0);
}

function stopTimer() {
  timerElement.style.visibility = "collapse";
  hideOnStart.forEach(x => { x.style.display = "inline" });
  clearInterval(estimatedTimer);
  wordN.style.opacity = 1;
  wordElement.style.opacity = 1;
  pronounceElement.style.opacity = 1;
  translationElement.style.opacity = 1;

  let wAnimation = wordElement.getAnimations()[0];
  let pAnimation = pronounceElement.getAnimations()[0];
  let tAnimation = translationElement.getAnimations()[0];

  let currOpacity = getComputedStyle(pronounceElement).opacity;
  let estimatedAnimationTime = Math.min(500, (timeInterval - pAnimation.currentTime));
  let animationArg = { duration: estimatedAnimationTime };
  keyframes = [
    { opacity: Math.max(0, currOpacity) },
    { opacity: 1 }
  ];

  if (pAnimation != null) {
    wAnimation.cancel();
    pAnimation.cancel();
    tAnimation.cancel();

    wordN.animate(keyframes, animationArg);
    wordElement.animate(keyframes, animationArg);
    pronounceElement.animate(keyframes, animationArg);
    translationElement.animate(keyframes, animationArg);
  }
}

timerBtn.addEventListener("click", () => {
  if (timerBtn.dataset.state === "start") {
    timerBtn.dataset.state = "stop";
    timerBtn.textContent = guiStrings.Stop;
    timerBtn.blur();
    startTimer();
  } else {
    timerBtn.dataset.state = "start";
    timerBtn.textContent = guiStrings.Start;
    currentWord = null;
    stopTimer();

    let stat = badWords.reduce((words, currWord) => {
      const { w } = currWord;
      words[w] = words[w] ?? 0;
      words[w] += 1;
      return words;
    }, badWordsStorage);

    console.log(stat);
    badWords = [];
    localStorage.badWords = JSON.stringify(stat);
  }
});



showAnswerTime.addEventListener("input", () => {
  answerTime = 1.0 - showAnswerTime.value;
  localStorage.answerTime = showAnswerTime.value;
});

function CSVToJSON(csv) {
  const lines = csv.split(/\r?\n/);
  const separator = /\t/;
  const keys = lines[0].split(separator);
  return lines.slice(1).map(line => {
    return line.split(separator).reduce((acc, cur, i) => {
      const toAdd = {};
      toAdd[keys[i]] = cur;
      return { ...acc, ...toAdd };
    }, {});
  });
};

wordsFile.addEventListener("change", () => {
  let readFile = wordsFile.files[0].text();
  readFile.then((f) => {
    localStorage.wordsList = JSON.stringify(CSVToJSON(f));
    reloadWords();
  })
});

document.addEventListener('keydown', function (event) {
  if (event.code === 'Space') {
    if (currentWord != null) {
      badWords.push(currentWord);
      getRandomInt(workList.length);
      currentWord = null;
    }
  }
});

reloadWords();
reloadProperty();