var shell = require('shelljs');
var ffmpeg = require('fluent-ffmpeg');

var command = ffmpeg();

ffmpeg('../res.mp4')
  .output('res.mp4')
  .on('end', function () {
    console.log('Finished processing')
  })
  .run()
