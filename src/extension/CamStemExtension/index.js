(function() {
  var csInterface = new CSInterface();

  window.addEventListener("load", function() {
    var demucsPathInput = document.getElementById("demucsPath");
    var modelDirInput   = document.getElementById("modelDir");
    var modelSelect     = document.getElementById("modelSelect");
    var qualitySelect   = document.getElementById("qualitySelect");

    var saveBtn         = document.getElementById("savePathBtn");
    var checkAudioBtn   = document.getElementById("checkAudioBtn");
    var splitAudioBtn   = document.getElementById("splitAudioBtn");
    // NEW:
    var placeStemsBtn   = document.getElementById("placeStemsBtn");

    var statusEl        = document.getElementById("status");

    // Restore user paths from localStorage
    var savedDemucsPath = localStorage.getItem("camstem_demucsPath");
    if (savedDemucsPath) demucsPathInput.value = savedDemucsPath;

    var savedModelDir   = localStorage.getItem("camstem_modelDir");
    if (savedModelDir)   modelDirInput.value   = savedModelDir;

    // 1) Save Paths
    saveBtn.addEventListener("click", function() {
      var dp = demucsPathInput.value.trim();
      var md = modelDirInput.value.trim();
      if (!dp || !md) {
        statusEl.textContent = "[JS] Please fill in demucs path + model folder.\n";
        return;
      }
      localStorage.setItem("camstem_demucsPath", dp);
      localStorage.setItem("camstem_modelDir",   md);
      statusEl.textContent = "[JS] Saved paths:\n" + dp + "\n" + md;
    });

    // 2) Check Audio
    checkAudioBtn.addEventListener("click", function() {
      statusEl.textContent = "[JS] Checking audio selection...\n";
      csInterface.evalScript("checkAudioSelection()", function(resultStr) {
        statusEl.textContent += "[JS] => checkAudioSelection returned:\n" + resultStr + "\n";
      });
    });

    // 3) Split Audio + Import
    splitAudioBtn.addEventListener("click", function() {
      var demucsExe = demucsPathInput.value.trim();
      var modelDir  = modelDirInput.value.trim();

      if (!demucsExe || !modelDir) {
        statusEl.textContent = "[JS] Must provide demucs path + model folder.\n";
        return;
      }

      // 1) Check audio
      statusEl.textContent = "[JS] Checking selected audio...\n";
      csInterface.evalScript("checkAudioSelection()", function(resultStr) {
        statusEl.textContent += "[JS] => checkAudioSelection returned:\n" + resultStr + "\n";

        // parse out "Selected Audio Path:"
        var lines = resultStr.split("\n");
        var inputAudio = null;
        for (var i = 0; i < lines.length; i++) {
          if (lines[i].indexOf("Selected Audio Path:") >= 0) {
            inputAudio = lines[i].replace("Selected Audio Path:", "").trim();
          }
        }
        if (!inputAudio) {
          statusEl.textContent += "[JS] => No valid selected audio found. Aborting.\n";
          return;
        }

        // 2) spawn Demucs
        var chosenModel = modelSelect.value;
        var chosenPreset = qualitySelect.value;

        statusEl.textContent += "[JS] => Found inputAudio = " + inputAudio + "\n";
        spawnDemucs(demucsExe, modelDir, chosenModel, chosenPreset, inputAudio);
      });
    });

    // 4) Place Stems on Timeline (MANUAL)
    placeStemsBtn.addEventListener("click", function() {
      statusEl.textContent += "\n[JS] => Placing stems on timeline manually...\n";
      csInterface.evalScript("placeStemsManually()", function(resp) {
        statusEl.textContent += "[JS] => placeStemsManually returned:\n" + resp + "\n";
      });
    });

    /**
     * spawnDemucs(...) => runs demucs-cxfreeze + final subfolder => importStemsFolder
     */
    function spawnDemucs(demucsExe, modelFolder, modelName, mp3Preset, inputPath) {
      statusEl.textContent += "[JS] spawnDemucs called...\n";

      let childProc;
      try {
        childProc = require("child_process");
      } catch (e) {
        statusEl.textContent += "[JS] Node not available => " + e + "\n";
        return;
      }

      function getDir(fp) {
        let idx = Math.max(fp.lastIndexOf("\\"), fp.lastIndexOf("/"));
        if (idx < 0) return fp;
        return fp.substring(0, idx);
      }
      function getBaseName(filePath) {
        let slash = Math.max(filePath.lastIndexOf("\\"), filePath.lastIndexOf("/"));
        let justFile = (slash < 0) ? filePath : filePath.substring(slash + 1);
        let dot = justFile.lastIndexOf(".");
        if (dot < 0) return justFile;
        return justFile.substring(0, dot);
      }

      let outputDir = getDir(inputPath);
      let args = [
        "-n", modelName,
        "--repo", modelFolder,
        "-o", outputDir,
        "--mp3",
        "--mp3-preset", mp3Preset,
        inputPath
      ];

      statusEl.textContent += "[JS] DEMUCS CMD:\n" + demucsExe + " " + args.join(" ") + "\n";

      let logBuffer = "";
      let finalBaseFolder = null;
      let trackBaseName   = null;

      const proc = childProc.spawn(demucsExe, args, { cwd: outputDir });

      proc.stdout.on("data", (chunk) => {
        let txt = chunk.toString();
        statusEl.textContent += txt; // show raw output

        // parse lines
        logBuffer += txt;
        let lines = logBuffer.split(/\r?\n/);
        logBuffer = lines.pop(); // leftover partial
        for (let ln of lines) {
          parseDemucsLine(ln);
        }
      });

      proc.stderr.on("data", (chunk) => {
        statusEl.textContent += "\n[ERR] " + chunk.toString();
      });

      proc.on("close", (code) => {
        if (logBuffer.trim()) {
          parseDemucsLine(logBuffer);
          logBuffer = "";
        }

        statusEl.textContent += `\n[JS] Demucs exited with code ${code}\n`;

        if (code === 0 && finalBaseFolder && trackBaseName) {
          let subFolder = finalBaseFolder.replace(/\\/g, "/") + "/" + trackBaseName;
          statusEl.textContent += `[JS] => subFolder = ${subFolder}\n`;

          let escaped = subFolder
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/\r/g, "")
            .replace(/\n/g, "");

          //  => importStemsFolder
          let jsxCall = `importStemsFolder("${escaped}", "${modelName}")`;
          statusEl.textContent += "[JS] => evalScript => " + jsxCall + "\n";
          csInterface.evalScript(jsxCall, function(resp) {
            statusEl.textContent += "\n[JS] importStemsFolder response:\n" + resp + "\n";
            statusEl.textContent += "[JS] Now click 'Place Stems on Timeline' if you want to place them.\n";
          });
        } else if (code === 0) {
          statusEl.textContent += "[JS] Demucs finished but we couldn't parse finalBaseFolder or trackBaseName.\n";
        }
      });

      proc.on("error", (err) => {
        statusEl.textContent += "\n[JS] spawn error => " + err.toString() + "\n";
      });

      function parseDemucsLine(line) {
        let stIdx = line.indexOf("Separated tracks will be stored in");
        if (stIdx >= 0) {
          let partial = line.substring(stIdx);
          let splitted = partial.split("in");
          if (splitted.length > 1) {
            let folder = splitted[1].trim();
            let dotPos = folder.indexOf(".");
            if (dotPos >= 0) {
              folder = folder.substring(0, dotPos);
            }
            finalBaseFolder = folder.trim();
            statusEl.textContent += `\n[JS] => finalBaseFolder: ${finalBaseFolder}\n`;
          }
        }

        let sepIdx = line.indexOf("Separating track ");
        if (sepIdx >= 0) {
          let partial2 = line.substring(sepIdx + "Separating track ".length).trim();
          trackBaseName = getBaseName(partial2);
          statusEl.textContent += `\n[JS] => trackBaseName: ${trackBaseName}\n`;
        }
      }
    }
  });
})();
