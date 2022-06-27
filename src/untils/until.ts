import { path } from '@ffmpeg-installer/ffmpeg';
import { ffprobe, FfprobeData } from 'fluent-ffmpeg';
import { resolve } from 'path';
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(path);

export function defaultAvatar(): string {
  return 'public/uploads/images/avatar_default.jpg';
}

export function ffmpegSync(
  file: Express.Multer.File,
  index: number,
  startTime: number,
  endTime: number,
): Promise<string> {
  const stringFile = `./${file.path}`;
  const videoFile = resolve(stringFile);
  const outPut = `./${file.destination}/${index}${file.filename}`;
  const valueReturn = `${file.destination}/${index}${file.filename}`;
  return new Promise((resolvePromise, reject) => {
    console.log('Start', startTime)
    console.log('End', endTime)
    ffprobe(videoFile, (err: any, metaData: FfprobeData) => {
      ffmpeg()
        .input(videoFile)
        .inputOptions([`-ss ${startTime}`])
        .outputOptions([`-to ${endTime}`])
        .output(resolve(outPut))
        .on('end', () => {
          resolvePromise(valueReturn);
        })
        .on('error', (err: any) => reject(new Error(err)))
        .run();
    });
  });
}

interface StartEndDateNowTimeStamp {
  startOfDay: number,
  endOfDay: number,
}

export function getStartEndDateNowTimeStamp(): StartEndDateNowTimeStamp {
  const now = new Date().getTime();
  let startOfDay = new Date(now - (now % 86400000));
  let endDate = new Date(now - (now % 86400000) + 86400000);

  return {
    startOfDay: startOfDay.getTime(),
    endOfDay: endDate.getTime()
  }
}
