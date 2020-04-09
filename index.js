var shell = require("shelljs");
var ffmpeg = require("fluent-ffmpeg");
var fs = require("fs");

// Set appear time and fps for it
const time = 6;
const fpt = time * 30;

// Get path for photo folder
const path = __dirname.replace("web-stream", "preparedFotos/");
const inputList = [];
const filters = [];

fs.readdirSync(path).forEach((file) => {
  inputList.push(path + file);
});

const videoTime = (time * 1.4 * inputList.length) / 4;

// Initialize ffmpeg object;
const command = ffmpeg();

// Set video template path as gis and specify video length
command.input(__dirname + "/background.gif");
command.inputFormat("gif");
command.addInputOption(["-ignore_loop 0", `-t ${videoTime}`]);

// Apply all images path to ffmpeg object
const chainedInputs = inputList.reduce(
  (result, inputItem) => result.addInput(inputItem),
  command,
);

// Genarate filters for amount of photos;
for (let index = 4; index < inputList.length + 1; index += 4) {
  filters.push(
    {
      filter: "overlay",
      options: {
        enable: `gte(t,${(index - 4) * 1.5})`,
        x: `W-1720-((n-${fpt}*${index === 4 ? 0 : index / 4})*.5)`,
        y: `(((n-${fpt}*${index === 4 ? 0 : index / 4 - 1})*2.5)-h)`,
      },
      inputs: `${index - 4 === 0 ? "[0:v]" : "[tmp]"}[${index - 4 + 1}:v]`,
      outputs: "tmp",
    },
    {
      filter: "overlay",
      options: {
        enable: `gte(t,${(index - 4) * 1.5})`,
        x: `W-1440-((n-${fpt}*${index === 4 ? 0 : index / 4})*.1)`,
        y: `(((n-${fpt}*${index === 4 ? 0 : index / 4 - 1})*3)-h)`,
      },
      inputs: `[tmp][${index - 4 + 2}:v]`,
      outputs: "tmp",
    },
    {
      filter: "overlay",
      options: {
        enable: `gte(t,${(index - 4) * 1.5})`,
        x: `W-680+((n-${fpt}*${index === 4 ? 0 : index / 4})*.5)`,
        y: `(((n-${fpt}*${index === 4 ? 0 : index / 4 - 1})*2.5)-h)`,
      },
      inputs: `[tmp][${index - 4 + 3}:v]`,
      outputs: "tmp",
    },
    {
      filter: "overlay",
      options: {
        enable: `gte(t,${(index - 4) * 1.5})`,
        x: `W-1020+((n-${fpt}*${index === 4 ? 0 : index / 4})*.1)`,
        y: `(((n-${fpt}*${index === 4 ? 0 : index / 4 - 1})*3)-h)`,
      },
      inputs: `[tmp][${index - 4 + 4}:v]`,
      outputs: "tmp",
    },
  );
}

// Execute video creation
chainedInputs
  .addOption(["-framerate 30"])
  .complexFilter(filters, "tmp")
  .on("progress", function (progress) {
    // Log processing info
    console.log("progress", progress);
  })
  .output(__dirname + "/output2.mp4")
  .addOutputOption(["-y"])
  .run();
