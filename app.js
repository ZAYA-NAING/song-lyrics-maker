import { sayonaraSongInfo } from './data/soyonara-lyrics-data.js';
// Selected target element
const audio = document.querySelector('audio');
// Properties
const MILLSEC_VALUE_OF_ONE_MINUTE_VALUE = 60000;
const MILLSEC_VALUE_OF_ONE_SECOND_VALUE = 1000;
let setLyricTimeOutIds = [];

// Methods
const convertMinSecToMillseconds = (minSec) => {
  const [min, sec] = minSec.split(':');
  return (
    min * MILLSEC_VALUE_OF_ONE_MINUTE_VALUE +
    sec * MILLSEC_VALUE_OF_ONE_SECOND_VALUE
  );
};

const convertSecToMillseconds = (sec) => {
  return sec * MILLSEC_VALUE_OF_ONE_SECOND_VALUE;
};

const clearLyricsTimeOutIds = () => {
  setLyricTimeOutIds.forEach(function (timer) {
    clearTimeout(timer);
  });
};

// Events
audio.onplay = (event) => {
  const originalLyric = document.querySelector('#original-lyric');
  const mmTranslatedLyric = document.querySelector('#mm-tranlated-lyric');
  sayonaraSongInfo.lyrics.forEach((lyric) => {
    const lyricTimestampMilliseconds = convertMinSecToMillseconds(
      lyric.timestamp
    );
    const currentTime = convertSecToMillseconds(event.target.currentTime);
    if (lyricTimestampMilliseconds >= currentTime) {
      setLyricTimeOutIds.push(
        setTimeout(() => {
          originalLyric.innerText = lyric.jp;
          mmTranslatedLyric.innerText = lyric.mm;
        }, lyricTimestampMilliseconds - currentTime)
      );
    }
  });
};

audio.onpause = () => {
  clearLyricsTimeOutIds();
};
