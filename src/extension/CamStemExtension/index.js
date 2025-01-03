(function() {
  var csInterface = new CSInterface();

  // We'll store some info for the extension usage:
  let lastAudioName   = null;   // for "Splitting Stems..." log
  let lastChosenModel = null;   // for 4 vs. 6-stem usage
  let hasSplitYet     = false;  // whether we've successfully run a split

  /******************************************************************************
   * PART A: HARDCODED ITEMS + DECRYPTION + PLATFORM CHECK
   * (As described in your main.js, but now all local to the extension.)
   ******************************************************************************/
  const HARD_CODED_KEY = "DA3K9Y5kdGQ217dhKehCT4Jip0ehJ7rY";  // from your main.js
  const STRIPE_SECRET_KEY = "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";

  // We'll allow a 14-day validity window for the key's date
  function isKeyValid(dateStr) {
    const keyDate = new Date(dateStr);
    const currentDate = new Date();
    const diffInDays = (currentDate - keyDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 14;
  }

  // Reverse string, used for clerk + stripe ID
  function reverseString(str) {
    return str.split('').reverse().join('');
  }

  // Decrypt + parse the key:
  // => date|platformCode|revClerkID|revStripeID
  // => date check, platform check
  async function processSoftwareKey(encryptedHex) {
    const cipherBytes = new Uint8Array(
      encryptedHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

    const enc = new TextEncoder();
    const dec = new TextDecoder();

    // Import the "HARD_CODED_KEY" as AES-CTR key
    const keyData = enc.encode(HARD_CODED_KEY);
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-CTR', length: 256 },
      false,
      ['decrypt']
    );

    // IV of all zeroes
    const iv = new Uint8Array(16);

    // Decrypt
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-CTR', counter: iv, length: 64 },
      cryptoKey,
      cipherBytes
    );
    const decrypted = dec.decode(decryptedBuffer);

    // Split => 4 parts
    const parts = decrypted.split('|');
    if (parts.length !== 4) {
      throw new Error('Invalid key format. Expected 4 parts.');
    }
    const [ dateStr, platformCodeStr, revClerkID, revStripeID ] = parts;

    // 1) Date check
    if (!isKeyValid(dateStr)) {
      throw new Error('Software key is expired (older than 14 days).');
    }

    // 2) Platform check => Mac => 1, Windows => 2
    let currentPlatformCode = 2;
    const agent = navigator.userAgent.toLowerCase();
    if (agent.includes("mac os") || agent.includes("macintosh")) {
      currentPlatformCode = 1;
    }
    const neededPlatform = parseInt(platformCodeStr, 10);
    if (neededPlatform !== currentPlatformCode) {
      throw new Error('Software key does not match the current platform.');
    }

    // 3) Reverse clerk + stripe IDs
    const clerkID = reverseString(revClerkID);
    const stripeID = reverseString(revStripeID);

    return { clerkID, stripeID };
  }

  /******************************************************************************
   * PART B: STORING + REMOVING KEY + CLERK/STRIPE ID
   * We'll store them all in localStorage so the user doesn't re-enter each time.
   ******************************************************************************/
  async function saveSoftwareKey(encryptedHex) {
    localStorage.setItem("camstem_softwareKey", encryptedHex);
  }
  async function getSavedKey() {
    return localStorage.getItem("camstem_softwareKey") || null;
  }
  async function removeSavedKey() {
    localStorage.removeItem("camstem_softwareKey");
  }

  /******************************************************************************
   * PART C: STRIPE + CLERK CHECK
   * We'll do a real fetch call to Stripe using your live secret key.
   * Then we can store clerkID in localStorage if needed.
   ******************************************************************************/
  async function checkSubscriptionStatus(stripeID) {
    try {
      // Example: call Stripe's subscription list endpoint
      const url = "https://api.stripe.com/v1/subscriptions?customer=" + encodeURIComponent(stripeID);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + STRIPE_SECRET_KEY
        }
      });
      const data = await res.json();
      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        return { active: false, reason: "No subscriptions found for that Stripe ID." };
      }
      // Check if there's an active or trialing sub
      const activeFound = data.data.some(
        (sub) => sub.status === 'active' || sub.status === 'trialing'
      );
      if (activeFound) {
        return { active: true };
      } else {
        return { active: false, reason: "Subscription is canceled or not active." };
      }
    } catch (err) {
      return { active: false, reason: err.message };
    }
  }

  /******************************************************************************
   * PART D: ON LOAD => set up DOM, overlay logic, etc.
   ******************************************************************************/
  window.addEventListener("load", function() {
    // DOM references
    const openSettingsBtn    = document.getElementById("openSettingsBtn");
    const settingsModal      = document.getElementById("settingsModal");
    const closeSettings      = document.getElementById("closeSettings");

    const demucsPathInput    = document.getElementById("demucsPath");
    const modelDirInput      = document.getElementById("modelDir");
    const modelSelect        = document.getElementById("modelSelect");
    const qualitySelect      = document.getElementById("qualitySelect");

    const saveBtn            = document.getElementById("savePathBtn");
    const splitAudioBtn      = document.getElementById("splitAudioBtn");
    const placeStemsBtn      = document.getElementById("placeStemsBtn");
    const statusEl           = document.getElementById("status");
    const userMessageEl      = document.getElementById("userMessage");

    // Auth
    const authKeyInput       = document.getElementById("authKeyInput");
    const validateKeyBtn     = document.getElementById("validateKeyBtn");
    const removeKeyBtn       = document.getElementById("removeKeyBtn");

    // Confirm modals
    const splitConfirmModal  = document.getElementById("splitConfirmModal");
    const splitCancelBtn     = document.getElementById("splitCancelBtn");
    const splitProceedBtn    = document.getElementById("splitProceedBtn");

    const placeStemsModal    = document.getElementById("placeStemsModal");
    const placeCancelBtn     = document.getElementById("placeCancelBtn");
    const placeProceedBtn    = document.getElementById("placeProceedBtn");
    const placeStemsWarning  = document.getElementById("placeStemsWarning");

    // Overlay
    const greyOutOverlay     = document.getElementById("greyOutOverlay");
    const goToSettingsBtn    = document.getElementById("goToSettingsBtn");

    // Helper
    function setUserMessage(msg) {
      userMessageEl.textContent = msg || "";
    }
    function showOverlayAndMessage(msg) {
      greyOutOverlay.style.display = "flex";
      greyOutOverlay.querySelector("p").textContent = msg || "";
    }
    function hideOverlay() {
      greyOutOverlay.style.display = "none";
    }

    /******************************************************************************
     * 1) Re-check auth on load
     ******************************************************************************/
    async function recheckAuthAndOverlay() {
      const existingKey = await getSavedKey();
      if (!existingKey) {
        showOverlayAndMessage("You must enter and validate an Auth Key in Settings to use this extension.");
        return;
      }
      try {
        // Decrypt / parse
        const { clerkID, stripeID } = await processSoftwareKey(existingKey);
        // Check subscription with real Stripe
        const subRes = await checkSubscriptionStatus(stripeID);
        if (!subRes.active) {
          showOverlayAndMessage("Subscription error: " + subRes.reason);
        } else {
          hideOverlay();
        }
      } catch (err) {
        showOverlayAndMessage("Auth error: " + err.message);
      }
    }
    recheckAuthAndOverlay();

    // 2) Opening + closing settings
    function openSettingsPanel() {
      hideOverlay();
      settingsModal.style.display = "flex";
      // load existing key
      getSavedKey().then((k) => {
        if (k) authKeyInput.value = k;
      });
    }
    goToSettingsBtn.addEventListener("click", openSettingsPanel);
    openSettingsBtn.addEventListener("click", openSettingsPanel);

    closeSettings.addEventListener("click", async function() {
      settingsModal.style.display = "none";
      await recheckAuthAndOverlay();
    });

    // if user clicks outside modals
    window.addEventListener("click", function(e) {
      if (e.target === settingsModal) {
        settingsModal.style.display = "none";
        recheckAuthAndOverlay();
      }
      if (e.target === splitConfirmModal) {
        splitConfirmModal.style.display = "none";
      }
      if (e.target === placeStemsModal) {
        placeStemsModal.style.display = "none";
      }
    });

    /******************************************************************************
     * 3) Save demucs + model paths to localStorage
     ******************************************************************************/
    const existingDemucs = localStorage.getItem("camstem_demucsPath");
    const existingModel  = localStorage.getItem("camstem_modelDir");
    if (existingDemucs) demucsPathInput.value = existingDemucs;
    if (existingModel)  modelDirInput.value   = existingModel;

    saveBtn.addEventListener("click", function() {
      const dp = demucsPathInput.value.trim();
      const md = modelDirInput.value.trim();
      if (!dp || !md) {
        statusEl.textContent += "[JS] Please fill in both paths.\n";
        setUserMessage("Please fill in both paths before saving.");
        return;
      }
      localStorage.setItem("camstem_demucsPath", dp);
      localStorage.setItem("camstem_modelDir", md);
      statusEl.textContent += "[JS] Saved settings:\n" + dp + "\n" + md + "\n";
      setUserMessage("Settings saved.");
    });

    /******************************************************************************
     * 4) Validate Key + Remove Key => real clerk + stripe check
     ******************************************************************************/
    validateKeyBtn.addEventListener("click", async function() {
      const softwareKey = authKeyInput.value.trim();
      if (!softwareKey) {
        setUserMessage("Please enter a software key.");
        return;
      }
      setUserMessage("");
      validateKeyBtn.disabled = true;
      try {
        // Decrypt
        const { clerkID, stripeID } = await processSoftwareKey(softwareKey);

        // Save the key
        await saveSoftwareKey(softwareKey);

        // Now check subscription with Stripe
        const subRes = await checkSubscriptionStatus(stripeID);
        if (!subRes.active) {
          setUserMessage("Subscription error: " + subRes.reason);
          validateKeyBtn.disabled = false;
          return;
        }

        // success
        setUserMessage("Software key validated and subscription is active!");
        hideOverlay();
      } catch (err) {
        setUserMessage("Key validation failed: " + err.message);
      } finally {
        validateKeyBtn.disabled = false;
      }
    });

    removeKeyBtn.addEventListener("click", async function() {
      await removeSavedKey();
      authKeyInput.value = "";
      setUserMessage("All saved keys have been removed.");
      showOverlayAndMessage("Please enter and validate an Auth Key in Settings.");
    });

    /******************************************************************************
     * 5) "Split Audio" => confirm modal
     ******************************************************************************/
    splitAudioBtn.addEventListener("click", function() {
      if (greyOutOverlay.style.display === "flex") {
        setUserMessage("Please validate an Auth Key first.");
        return;
      }
      splitConfirmModal.style.display = "flex";
    });
    splitCancelBtn.addEventListener("click", function() {
      splitConfirmModal.style.display = "none";
      setUserMessage("Split audio canceled.");
    });
    splitProceedBtn.addEventListener("click", function() {
      splitConfirmModal.style.display = "none";
      startSplitProcess();
    });

    function startSplitProcess() {
      setUserMessage("Split Process Started. Checking selected audio track...");

      const demucsExe = demucsPathInput.value.trim();
      const modelDir  = modelDirInput.value.trim();
      if (!demucsExe || !modelDir) {
        statusEl.textContent += "[JS] Must provide demucs path + model folder.\n";
        setUserMessage("Cannot split; please fill in paths first.");
        return;
      }

      statusEl.textContent += "[JS] Checking audio selection...\n";
      csInterface.evalScript("checkAudioSelection()", function(resultStr) {
        statusEl.textContent += "[JS] => checkAudioSelection returned:\n" + resultStr + "\n";

        const lines = resultStr.split("\n");
        let inputAudio = null;
        for (const line of lines) {
          if (line.includes("Selected Audio Path:")) {
            inputAudio = line.replace("Selected Audio Path:", "").trim();
          }
        }
        if (!inputAudio) {
          statusEl.textContent += "[JS] => No valid selected audio found. Aborting.\n";
          setUserMessage("No valid audio clip selected. Please select a clip in the timeline first.");
          return;
        }

        lastAudioName   = inputAudio;
        lastChosenModel = modelSelect.value;

        setTimeout(() => {
          statusEl.textContent += "[JS] Splitting Stems of " + lastAudioName + "\n";
          setUserMessage("Splitting Stems of " + lastAudioName + "...");
        }, 3000);

        runDemucsProcess(demucsExe, modelDir, lastChosenModel, qualitySelect.value, lastAudioName);
      });
    }

    /******************************************************************************
     * 6) "Place Stems" => confirm modal
     ******************************************************************************/
    placeStemsBtn.addEventListener("click", function() {
      if (greyOutOverlay.style.display === "flex") {
        setUserMessage("Please validate an Auth Key first.");
        return;
      }
      if (!hasSplitYet) {
        setUserMessage("No stems to place yet! Please split audio first.");
        return;
      }
      if (lastChosenModel === "htdemucs_6s") {
        placeStemsWarning.textContent = "Please ensure the first 6 audio tracks are empty...";
      } else {
        placeStemsWarning.textContent = "Please ensure the first 4 audio tracks are empty...";
      }
      placeStemsModal.style.display = "flex";
    });
    placeCancelBtn.addEventListener("click", function() {
      placeStemsModal.style.display = "none";
      setUserMessage("Place stems canceled.");
    });
    placeProceedBtn.addEventListener("click", function() {
      placeStemsModal.style.display = "none";
      doPlaceStemsNow();
    });

    function doPlaceStemsNow() {
      statusEl.textContent += "\n[JS] => Placing stems on timeline...\n";
      setUserMessage("Placing stems on timeline...");

      csInterface.evalScript("placeStemsManually()", function(resp) {
        statusEl.textContent += "[JS] => placeStemsManually returned:\n" + resp + "\n";
        setUserMessage("Stems placed on timeline (check your sequence).");
      });
    }

    /******************************************************************************
     * 7) runDemucsProcess => spawn demucs-cxfreeze
     ******************************************************************************/
    function runDemucsProcess(demucsExe, modelFolder, modelName, mp3Preset, inputPath) {
      statusEl.textContent += "[JS] runDemucsProcess called...\n";

      let childProc;
      try {
        childProc = require("child_process");
      } catch (e) {
        statusEl.textContent += "[JS] Node not available => " + e + "\n";
        setUserMessage("Error: Node not available in this environment.");
        return;
      }

      function getDir(fp) {
        const idx = Math.max(fp.lastIndexOf("\\"), fp.lastIndexOf("/"));
        return idx < 0 ? fp : fp.substring(0, idx);
      }
      function getBaseName(filePath) {
        const slash = Math.max(filePath.lastIndexOf("\\"), filePath.lastIndexOf("/"));
        const justFile = (slash < 0) ? filePath : filePath.substring(slash + 1);
        const dot = justFile.lastIndexOf(".");
        return dot < 0 ? justFile : justFile.substring(0, dot);
      }

      const outputDir = getDir(inputPath);
      const args = [
        "-n", modelName,
        "--repo", modelFolder,
        "-o", outputDir,
        "--mp3",
        "--mp3-preset", mp3Preset,
        inputPath
      ];

      statusEl.textContent += "[JS] DEMUCS CMD:\n" + demucsExe + " " + args.join(" ") + "\n";

      let logBuffer       = "";
      let finalBaseFolder = null;
      let trackBaseName   = null;

      const proc = childProc.spawn(demucsExe, args, { cwd: outputDir });

      proc.stdout.on("data", (chunk) => {
        const txt = chunk.toString();
        statusEl.textContent += txt;

        logBuffer += txt;
        const lines = logBuffer.split(/\r?\n/);
        logBuffer = lines.pop();
        lines.forEach((ln) => parseDemucsLine(ln));
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
          const subFolder = finalBaseFolder.replace(/\\/g, "/") + "/" + trackBaseName;
          statusEl.textContent += `[JS] => subFolder = ${subFolder}\n`;

          const escaped = subFolder
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/\r/g, "")
            .replace(/\n/g, "");

          const jsxCall = `importStemsFolder("${escaped}", "${modelName}")`;
          statusEl.textContent += "[JS] => evalScript => " + jsxCall + "\n";

          csInterface.evalScript(jsxCall, function(resp) {
            statusEl.textContent += "\n[JS] importStemsFolder response:\n" + resp + "\n";
            statusEl.textContent += "[JS] Split Process Complete\n";
            setUserMessage("Split Process Complete! Stems imported into Premiere.");
            hasSplitYet = true;
          });
        } else if (code === 0) {
          statusEl.textContent += "[JS] Demucs finished but no final folder/base name found.\n";
          setUserMessage("Demucs finished, but no final stems folder found. Check logs.");
        } else {
          setUserMessage("Demucs process ended with an error. Check logs for details.");
        }
      });

      proc.on("error", (err) => {
        statusEl.textContent += "\n[JS] spawn error => " + err.toString() + "\n";
        setUserMessage("Error spawning Demucs process. Check logs.");
      });

      function parseDemucsLine(line) {
        const stIdx = line.indexOf("Separated tracks will be stored in");
        if (stIdx >= 0) {
          let partial = line.substring(stIdx);
          const splitted = partial.split("in");
          if (splitted[1]) {
            let folder = splitted[1].trim();
            const dotPos = folder.indexOf(".");
            if (dotPos >= 0) {
              folder = folder.substring(0, dotPos);
            }
            finalBaseFolder = folder.trim();
            statusEl.textContent += `\n[JS] => finalBaseFolder: ${finalBaseFolder}\n`;
          }
        }

        const sepIdx = line.indexOf("Separating track ");
        if (sepIdx >= 0) {
          const partial2 = line.substring(sepIdx + "Separating track ".length).trim();
          trackBaseName = getBaseName(partial2);
          statusEl.textContent += `\n[JS] => trackBaseName: ${trackBaseName}\n`;
        }
      }
    }
  });
})();
