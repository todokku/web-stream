var ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const generateBackground = () => {
  return new Promise((resolve, reject) => {
    const generateVideo = ffmpeg();
    const generatePalette = ffmpeg();
    const generateGif = ffmpeg();

    if (fs.existsSync(__dirname + "/assets/background.gif")) {
      console.log("Gif exists. Exiting generation...");
      resolve();
    } else {
      generateVideo
        .input(__dirname + "/assets/background.png")
        .inputOption("-loop 1")
        .addOptions([
          "-t 3",
          "-c:v libx264",
          "-pix_fmt yuv420p",
          "-framerate 60",
          "-vf scale=1920:1080",
        ])
        .output(__dirname + "/assets/background.mp4")
        .on("progress", (progress) => {
          console.log("Generating video... 📼");
          console.log("Current time mark: ", progress.timemark);
          console.log("Current frame: ", progress.frames);
          console.log("Current fps: ", progress.currentFps);
        })
        // When video generated, start implementing palette
        .on("end", () => {
          generatePalette
            .input(__dirname + "/assets/background.mp4")
            .addOptions(["-vf palettegen"])
            .output(__dirname + "/assets/backgroundPalette.png")
            .on("progress", (progress) => {
              console.log("Generating palette... 🎨");
              console.log("Current time mark: ", progress.timemark);
              console.log("Current frame: ", progress.frames);
              console.log("Current fps: ", progress.currentFps);
            })
            // When palette generated, start implementing gif
            .on("end", () => {
              generateGif
                .input(__dirname + "/assets/background.mp4")
                .addInput(__dirname + "/assets/backgroundPalette.png")
                .complexFilter(
                  [{ filter: "paletteuse", inputs: "[0:v]", outputs: "[tmp]" }],
                  "tmp",
                )
                .on("progress", (progress) => {
                  console.log("Generating gif... 🌅");
                  console.log("Current time mark: ", progress.timemark);
                  console.log("Current frame: ", progress.frames);
                  console.log("Current fps: ", progress.currentFps);
                })
                // When gif generated, resovle promise and delete unnecessery files
                .on("end", async () => {
                  fs.unlinkSync(__dirname + "/assets/background.mp4");
                  fs.unlinkSync(__dirname + "/assets/backgroundPalette.png");
                  console.log("Unnecessary stuff deleted...");
                  resolve();
                  console.log(
                    "Your gif for background is in folder 'assets', name: background.gif ✅",
                  );
                })
                .output(__dirname + "/assets/background.gif")
                .run();
            })
            .run();
        })
        .run();
    }
  });
};

module.exports = generateBackground;
