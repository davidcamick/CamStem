/**
 * index.jsx
 *
 * 1) checkAudioSelection() - find selected clip in timeline
 * 2) importStemsFolder(folderPath, modelName) - import only (no timeline)
 *    - Removes duplicates so "drums.mp3" won't appear multiple times
 * 3) placeStemsManually() - user calls this manually after import
 *    - Finds the bin "CamStem - ???"
 *    - Looks for "drums.mp3", "bass.mp3", etc.
 *    - Places them on the timeline, removes original clip
 */

//--------------------------------------
// A) Utility: arrayContains
//--------------------------------------
function arrayContains(arr, val) {
    if (!arr || !val) return false;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            return true;
        }
    }
    return false;
}

//--------------------------------------
// B) Utility: getBaseName(filePath)
//--------------------------------------
function getBaseName(filePath) {
    if (!filePath) return "";
    var slashPos = Math.max(filePath.lastIndexOf("\\"), filePath.lastIndexOf("/"));
    var justFile = (slashPos < 0) ? filePath : filePath.substring(slashPos + 1);
    var dotPos   = justFile.lastIndexOf(".");
    if (dotPos < 0) return justFile;
    return justFile.substring(0, dotPos);
}

//--------------------------------------
// C) checkAudioSelection()
//--------------------------------------
function checkAudioSelection() {
    var log = [];
    log.push("=== checkAudioSelection() ===");

    if (!app.project) {
        return "No app.project? Maybe no project open?";
    }
    var seq = app.project.activeSequence;
    if (!seq) {
        return "No active sequence found.";
    }

    log.push("Found an active sequence.");
    log.push("Checking " + seq.audioTracks.numTracks + " audio tracks for a selected clip...");

    var foundClip = null;
    for (var t = 0; t < seq.audioTracks.numTracks; t++) {
        var track = seq.audioTracks[t];
        log.push("  Track #" + t + " => " + track.clips.numItems + " clip(s)");
        for (var c = 0; c < track.clips.numItems; c++) {
            var clip = track.clips[c];
            if (clip.isSelected()) {
                foundClip = clip;
                log.push("    Found SELECTED clip at track " + t + ", clip " + c);
                break;
            }
        }
        if (foundClip) break;
    }

    if (!foundClip) {
        log.push("No audio clip is selected in the timeline. Exiting.");
        return log.join("\n");
    }
    if (!foundClip.projectItem) {
        log.push("Selected clip has no projectItem? Exiting.");
        return log.join("\n");
    }
    if (!foundClip.projectItem.canChangeMediaPath()) {
        log.push("Cannot retrieve file path (canChangeMediaPath=false). Exiting.");
        return log.join("\n");
    }

    var filePath = foundClip.projectItem.getMediaPath();
    if (!filePath) {
        log.push("No file path found for the selected clip. Exiting.");
        return log.join("\n");
    }

    log.push("Selected Audio Path: " + filePath);
    return log.join("\n");
}

//--------------------------------------
// D) importStemsFolder(folderPath, modelName)
//--------------------------------------
function importStemsFolder(folderPath, modelName) {
    var logs = [];
    logs.push("=== importStemsFolder() ===");
    logs.push("folderPath = " + folderPath);
    logs.push("modelName = " + modelName);

    try {
        if (!folderPath) {
            logs.push("Error: folderPath is empty/null.");
            return logs.join("\n");
        }

        logs.push("Recursively gathering .mp3/.wav from => " + folderPath);

        // 1) gather .mp3/.wav
        var allAudioFiles = [];

        function gatherFilesRecursively(fld) {
            if (!fld.exists) return;
            var items = fld.getFiles();
            if (!items) return;
            for (var i = 0; i < items.length; i++) {
                var it = items[i];
                if (it instanceof File) {
                    var nm = it.name.toLowerCase();
                    if (nm.length >= 4) {
                        var ext = nm.substring(nm.length - 4);
                        if (ext === ".mp3" || ext === ".wav") {
                            logs.push("[Audio] " + it.fsName);
                            allAudioFiles.push(it.fsName);
                            continue;
                        }
                    }
                    logs.push("[Skip] " + it.fsName);
                } else if (it instanceof Folder) {
                    gatherFilesRecursively(it);
                }
            }
        }

        var rootFolder = new Folder(folderPath);
        if (!rootFolder.exists) {
            logs.push("Folder doesn't exist => " + rootFolder.fsName);
            return logs.join("\n");
        }
        gatherFilesRecursively(rootFolder);

        if (allAudioFiles.length === 0) {
            logs.push("No audio files found => done.");
            return logs.join("\n");
        }

        logs.push("Found " + allAudioFiles.length + " file(s). Importing at project root...");

        // 2) create new bin
        var newBinName = "CamStem - " + rootFolder.name;
        logs.push("Creating bin => " + newBinName);
        var newBin = app.project.rootItem.createBin(newBinName);
        if (!newBin) {
            logs.push("Couldn't create bin => older PPro?");
            return logs.join("\n");
        }
        logs.push("Created bin => " + newBin.name);

        // 3) import them
        var importRes = app.project.importFiles(allAudioFiles);
        logs.push("importFiles => type: " + (typeof importRes));

        // 4) move them into new bin
        var newlyImported = [];

        function moveMatches(folderItem) {
            for (var c = 0; c < folderItem.children.numItems; c++) {
                var child = folderItem.children[c];
                if (child && typeof child.getMediaPath === "function") {
                    var mp = child.getMediaPath();
                    // see if mp is in allAudioFiles
                    for (var i = 0; i < allAudioFiles.length; i++) {
                        if (allAudioFiles[i] === mp) {
                            // move child into bin if not already
                            if (child.parent !== newBin && typeof child.moveBin === "function") {
                                logs.push("Moving => " + child.name + " => " + newBin.name);
                                child.moveBin(newBin);
                            }
                            newlyImported.push(child);

                            // remove from array so we don't match it again => fix duplicates
                            allAudioFiles.splice(i, 1);
                            break; // done with this child
                        }
                    }
                }
                if (child && child.children && child.children.numItems > 0) {
                    moveMatches(child);
                }
            }
        }

        logs.push("Scanning entire project for newly imported stems...");
        moveMatches(app.project.rootItem);

        logs.push("Found " + newlyImported.length + " newly imported item(s).");
        logs.push("Import completed. No timeline action taken yet.");

    } catch (ex) {
        logs.push("Exception => " + ex.toString());
    }

    return logs.join("\n");
}

//--------------------------------------
// E) placeStemsManually()
//--------------------------------------
function placeStemsManually() {
    var logs = [];
    logs.push("=== placeStemsManually() ===");

    var seq = app.project.activeSequence;
    if (!seq) {
        logs.push("No active sequence => cannot place stems.");
        return logs.join("\n");
    }

    // 1) find the original selected clip
    var foundClip = null;
    for (var t = 0; t < seq.audioTracks.numTracks; t++) {
        var trackObj = seq.audioTracks[t];
        for (var c = 0; c < trackObj.clips.numItems; c++) {
            var clip = trackObj.clips[c];
            if (clip.isSelected()) {
                foundClip = clip;
                break;
            }
        }
        if (foundClip) break;
    }
    if (!foundClip) {
        logs.push("No selected clip => won't remove anything, continuing...");
    }

    // 2) Find the last "CamStem - ..." bin
    var lastCamStemBin = null;
    for (var i = app.project.rootItem.children.numItems - 1; i >= 0; i--) {
        var item = app.project.rootItem.children[i];
        if (item && item.type === 2 && item.name.indexOf("CamStem - ") === 0) {
            lastCamStemBin = item;
            break;
        }
    }
    if (!lastCamStemBin) {
        logs.push("Did not find a 'CamStem - xxx' bin. Exiting.");
        return logs.join("\n");
    }

    logs.push("Using bin => " + lastCamStemBin.name);

    // 3) gather items from that bin
    var allProjectItems = [];
    function gatherAllItems(bin) {
        for (var c = 0; c < bin.children.numItems; c++) {
            var child = bin.children[c];
            allProjectItems.push(child);
            if (child && child.type === 2 && child.children && child.children.numItems > 0) {
                gatherAllItems(child);
            }
        }
    }
    gatherAllItems(lastCamStemBin);

    logs.push("Found " + allProjectItems.length + " item(s) in that bin.");

    // 4) place items named exactly "drums.mp3", "bass.mp3", etc.
    var desiredNames = ["drums.mp3", "bass.mp3", "vocals.mp3", "other.mp3", "piano.mp3", "guitar.mp3"];
    var matchedItems = [];

    for (var d = 0; d < desiredNames.length; d++) {
        var wantName = desiredNames[d].toLowerCase();
        var foundItem = null;
        for (var c = 0; c < allProjectItems.length; c++) {
            var pItem = allProjectItems[c];
            if (!pItem || !pItem.name) continue;

            var pName = pItem.name.toLowerCase();
            if (pName === wantName) {
                foundItem = pItem;
                break;
            }
        }
        if (foundItem) {
            matchedItems.push(foundItem);
            logs.push("Matched => " + wantName + " => " + foundItem.name);
        } else {
            logs.push("No project item matched => " + wantName);
        }
    }

    if (matchedItems.length === 0) {
        logs.push("No stems matched => done.");
        return logs.join("\n");
    }

    // 5) ensure enough tracks
    while (seq.audioTracks.numTracks < matchedItems.length) {
        seq.audioTracks.addTrack();
        logs.push("Created a new audio track => now have " + seq.audioTracks.numTracks);
    }

    // 6) insert each matched item
    var insertTime = foundClip ? foundClip.start : 0.0;
    for (var idx = 0; idx < matchedItems.length; idx++) {
        var trackObj2 = seq.audioTracks[idx];
        var pItem2    = matchedItems[idx];
        logs.push("Placing " + pItem2.name + " on track #" + idx);
        trackObj2.insertClip(pItem2, insertTime);
    }

    // 7) remove original
    if (foundClip && typeof foundClip.remove === "function") {
        foundClip.remove(false, false);
        logs.push("Removed the originally selected clip from the timeline.");
    }

    logs.push("All stems placed on timeline successfully.");
    return logs.join("\n");
}
