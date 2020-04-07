var shell = require('shelljs');
var ffmpeg = require('fluent-ffmpeg');

var command = ffmpeg();

ffmpeg('../res.mp4')
  .output('res.mp4')
  .on('end', function () {
    console.log('Finished processing')
  })
  .run()

// shell.exec('sh ../bilinearwarp -f input "230,20 300,20 250,165 50,190" ../e01.jpg slide7.jpg', { async: true });

