const { interval, bufferCount, pipe, of, tap, map, from } = rxjs;
import { songs } from './data/soyonara-lyrics-data.js';
// Selected target element
const originalLyric = document.querySelector('#original-lyric');
const mmTranslatedLyric = document.querySelector('#mm-tranlated-lyric');
const audio = document.querySelector('audio');
// Properties
const MILLSEC_VALUE_OF_ONE_MINUTE_VALUE = 60000;
const MILLSEC_VALUE_OF_ONE_SECOND_VALUE = 1000;
let second = 0;
let secondDig = 0;
let minuteDig = 0;
let songInterval = () => {};

// Methods
const intervals = () => {
  songInterval = setInterval(() => {
    second++;
    if (second > 59) {
      second = 0;
      minuteDig++;
    }
    // setLyric(second);
    setLyricByFind(second);
  }, MILLSEC_VALUE_OF_ONE_SECOND_VALUE);
  setTimeout(() => {
    clearInterval(songInterval);
    second = 0;
  }, convertMinSecToMillseconds(songs.duration));
};

const changeMinuteSecondTimeFormatFromSecond = (second) => {
  if (second < 10) {
    secondDig = '0' + second;
  }
  if (second > 9) {
    secondDig = second;
  }
  return minuteDig + ':' + secondDig;
};

const setLyricByFind = (second) => {
  const minuteSecondTimeFormat = changeMinuteSecondTimeFormatFromSecond(second);
  console.log(minuteSecondTimeFormat);
  const song = songs.lyrics.find((song) => {
    return song.timestamp === minuteSecondTimeFormat;
  });
  if (song) {
    originalLyric.innerText = song.jp;
    mmTranslatedLyric.innerText = song.mm;
  }
};

const setLyric = (second) => {
  for (let index = 0; index < songs.lyrics.length; index++) {
    if (
      convertSecToMillseconds(second) ===
      convertMinSecMilliToMillseconds(songs.lyrics[index].timestamp)
    ) {
      originalLyric.innerText = songs.lyrics[index].jp;
      mmTranslatedLyric.innerText = songs.lyrics[index].mm;
    }
  }
};
let time = 0;
const setLyricByAudio = () => {
  songInterval = setInterval(() => {
    console.log(time++);
    let curTime = +audio.currentTime.toFixed();
    console.log(convertTime(audio.currentTime, 30));
  });
  setTimeout(() => {
    clearInterval(songInterval);
    audio.currentTime = 0;
  }, convertMinSecToMillseconds(songs.duration));
};

const setLyricByUsingRxjs = () => {
  return from(songs.lyrics).pipe(
    // tap((res) => console.log(res)),
    bufferCount(10),
    map((res) => {
      return [
        {
          from: res[0].timestamp,
          to: res[res.length - 1].timestamp,
          lyrics: res,
        },
      ];
    })
  );
};

const convertMinSecToMillseconds = (minSec) => {
  const [min, sec] = minSec.split(':');
  return (
    min * MILLSEC_VALUE_OF_ONE_MINUTE_VALUE +
    sec * MILLSEC_VALUE_OF_ONE_SECOND_VALUE
  );
};

const convertMinSecMilliToMillseconds = (minSecMilli) => {
  // console.log(minSecMilli);
  const [min, sec] = minSecMilli.split(':');
  return (
    min * MILLSEC_VALUE_OF_ONE_MINUTE_VALUE +
    sec * MILLSEC_VALUE_OF_ONE_SECOND_VALUE
    // frame -> sec -> milliseconds
    // (frame / 30) * MILLSEC_VALUE_OF_ONE_SECOND_VALUE
  );
};

const convertTime = (input, fps) => {
  const pad = (input) => {
    return input < 10 ? '0' + input : input;
  };
  fps = typeof fps !== 'undefined' ? fps : 24;
  return [
    // pad(Math.floor(input / 3600)),
    pad(Math.floor((input % 3600) / 60)),
    pad(Math.floor(input % 60)),
    // pad(Math.floor((input * fps) % fps)),
  ].join(':');
};

const convertSecToMillseconds = (sec) => {
  return sec * MILLSEC_VALUE_OF_ONE_SECOND_VALUE;
};
// Invoke
// audio.onplay = () => interval();
// audio.onplay = () => setLyricByAudio();

// console.log(convertTime(13555.3515135));
// setInterval(() => {
// interval()
//   .pipe(
//     map(() => {
//       return setLyricByUsingRxjs().subscribe((x) => x);
//     })
//   )
//   .subscribe((x) => {
//     console.log(x);
//   });
// setLyricByUsingRxjs().subscribe((x) => {
//   console.log('Next: ', x);
// });
// }, 1000);

const setLyricTimeOutIds = [];

// audio.onplay = (e) => {
//   for (let index = 0; index < songs.lyrics.length; index++) {
//     // console.log(e);
//     // console.log(e.target.currentTime);
//     // console.log(convertTime(e.target.currentTime));
//     // console.log(convertSecToMillseconds(e.target.currentTime));

//     if (
//       convertMinSecMilliToMillseconds(songs.lyrics[index].timestamp) >=
//       convertSecToMillseconds(e.target.currentTime)
//     ) {
//       console.log(
//         songs.lyrics[index].timestamp,
//         '=>',
//         convertMinSecMilliToMillseconds(songs.lyrics[index].timestamp)
//       );
//       console.log(
//         convertTime(e.target.currentTime),
//         '=>',
//         convertSecToMillseconds(e.target.currentTime)
//       );
//       console.log(
//         convertMinSecMilliToMillseconds(songs.lyrics[index].timestamp) -
//           convertSecToMillseconds(e.target.currentTime)
//       );
//       setLyricTimeOutIds.push(
//         setTimeout(() => {
//           originalLyric.innerText = songs.lyrics[index].jp;
//           mmTranslatedLyric.innerText = songs.lyrics[index].mm;
//         }, convertMinSecMilliToMillseconds(songs.lyrics[index].timestamp) - convertSecToMillseconds(e.target.currentTime))
//       );
//     }

//     // console.log(setLyricTimeOutIds);
//   }
// };

audio.onplay = (event) => {
  songs.lyrics.forEach((lyric) => {
    if (
      convertMinSecMilliToMillseconds(lyric.timestamp) >=
      convertSecToMillseconds(event.target.currentTime)
    ) {
      console.log(
        lyric.timestamp,
        '=>',
        convertMinSecMilliToMillseconds(lyric.timestamp)
      );
      console.log(
        convertTime(event.target.currentTime),
        '=>',
        convertSecToMillseconds(event.target.currentTime)
      );
      console.log(
        convertMinSecMilliToMillseconds(lyric.timestamp) -
          convertSecToMillseconds(event.target.currentTime)
      );
      setLyricTimeOutIds.push(
        setTimeout(() => {
          originalLyric.innerText = lyric.jp;
          mmTranslatedLyric.innerText = lyric.mm;
        }, convertMinSecMilliToMillseconds(lyric.timestamp) - convertSecToMillseconds(event.target.currentTime))
      );
    }
  });
};

audio.onpause = (e) => {
  setLyricTimeOutIds.forEach(function (timer) {
    clearTimeout(timer);
  });
};
