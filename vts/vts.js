const icon = `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`;

let elements = {
  //modals
  connectVTSModal: document.getElementById("connectVTSModal"),
  resetModal: document.getElementById("resetModal"),
  addCommandModal: document.getElementById("addCommandModal"),
  addExistingRewardModal: document.getElementById("addExistingRewardModal"),
  createNewRewardModal: document.getElementById("createNewRewardModal"),
  editCommandModal: document.getElementById("editCommandModal"),
  editRewardModal: document.getElementById("editRewardModal"),
  confirmDeletionModal: document.getElementById("confirmDeletionModal"),
  loginExpiredModal: document.getElementById("loginExpiredModal"),
  addSubAlertModal: document.getElementById("addSubAlertModal"),
  editSubAlertModal: document.getElementById("editSubAlertModal"),
  addGiftedSubAlertModal: document.getElementById("addGiftedSubAlertModal"),
  editGiftedSubAlertModal: document.getElementById("editGiftedSubAlertModal"),
  addBitsAlertModal: document.getElementById("addBitsAlertModal"),
  editBitsAlertModal: document.getElementById("editBitsAlertModal"),
  addRewardModal: document.getElementById("addRewardModal"),
  youtubeModal: document.getElementById("youtubeModal"),

  modal9footer: document.getElementById("modal9footer"),
  modal9body: document.getElementById("modal9body"),
  youtubeModalBody: document.getElementById("youtubeModalBody"),
  youtubeModalTitle: document.getElementById("youtubeModalTitle"),
  port: document.getElementById("port"),

  //commands
  commandName: document.getElementById("commandName"),
  commandNameEdit: document.getElementById("commandNameEdit"),
  commandCooldown: document.getElementById("commandCooldown"),
  commandCooldownEdit: document.getElementById("commandCooldownEdit"),
  addCommandSubmit: document.getElementById("addCommandSubmit"),
  modal7body: document.getElementById("modal7body"),
  modal7footer: document.getElementById("modal7footer"),

  //rewards
  addRewardSubmit: document.getElementById("addRewardSubmit"),
  newRewardName: document.getElementById("newRewardName"),
  newRewardDesc: document.getElementById("newRewardDesc"),
  newRewardCost: document.getElementById("newRewardCost"),
  newRewardColor: document.getElementById("newRewardColor"),
  newRewardCooldown: document.getElementById("newRewardCooldown"),
  newRewardCooldownUnit: document.getElementById("newRewardCooldownUnit"),
  newRewardLimit: document.getElementById("newRewardLimit"),
  newRewardUserLimit: document.getElementById("newRewardUserLimit"),
  createRewardSubmit: document.getElementById("createRewardSubmit"),
  modal8body: document.getElementById("modal8body"),
  modal8footer: document.getElementById("modal8footer"),
  existingRewardsList: document.getElementById("existingRewardsList"),

  //sub alerts
  subAlertMonths: document.getElementById("subAlertMonths"),
  subAlertMonthsEdit: document.getElementById("subAlertMonthsEdit"),
  addSubAlertSubmit: document.getElementById("addSubAlertSubmit"),
  modal12footer: document.getElementById("modal12footer"),

  //gifted sub alerts
  giftedSubsNumber: document.getElementById("giftedSubsNumber"),
  giftedSubsNumberEdit: document.getElementById("giftedSubsNumberEdit"),
  addGiftedSubAlertSubmit: document.getElementById("addGiftedSubAlertSubmit"),
  modal14footer: document.getElementById("modal14footer"),

  //bits alerts
  bitsNumber: document.getElementById("bitsNumber"),
  bitsNumberEdit: document.getElementById("bitsNumberEdit"),
  addBitsAlertSubmit: document.getElementById("addBitsAlertSubmit"),
  modal16footer: document.getElementById("modal16footer"),

  //navbar
  VTSstatus: document.getElementById("VTSstatus"),
  streamStatus: document.getElementById("streamStatus"),
  topright1: document.getElementById("topright1"),
  topright2: document.getElementById("topright2"),
  topright3: document.getElementById("topright3"),
  darkTheme: document.getElementById("darkTheme"),

  //settings
  createChannelPointsButton: document.getElementById("createChannelPointsButton"),
  addSubAlert: document.getElementById("addSubAlert"),
  addGiftedSubAlert: document.getElementById("addGiftedSubAlert"),
  addBitsAlert: document.getElementById("addBitsAlert"),
  commandCooldownGlobal: document.getElementById("commandCooldownGlobal"),
  hideDefault: document.getElementById("hideDefault"),
  backupInput: document.getElementById("backupInput"),

  //body
  commandsList: document.getElementById("commandsList"),
  rewardsListHeader: document.getElementById("rewardsListHeader"),
  rewardsList: document.getElementById("rewardsList"),
  subsListHeader: document.getElementById("subsListHeader"),
  subsList: document.getElementById("subsList"),
  giftsListHeader: document.getElementById("giftsListHeader"),
  giftsList: document.getElementById("giftsList"),
  bitsListHeader: document.getElementById("bitsListHeader"),
  bitsList: document.getElementById("bitsList"),
  logs: document.getElementById("logs"),
  toastContainer: document.getElementById("toastContainer"),
};

let client;
let PubSub;
let apiClient;
let loginButton;
let cooldowns = { global: 0 };
let connectVTSModal,
  resetModal,
  addCommandModal,
  addExistingRewardModal,
  createNewRewardModal,
  editCommandModal,
  editRewardModal,
  confirmDeletionModal,
  loginExpiredModal,
  addSubAlertModal,
  editSubAlertModal,
  addGiftedSubAlertModal,
  editGiftedSubAlertModal,
  addBitsAlertModal,
  editBitsAlertModal,
  addRewardModal,
  youtubeModal;
let YT_STREAM_ID;
let YT_CHAT_ID;
let retried = false;
let readChatTimeout;
let darkTheme = true;

const defaultModels = ["Akari", "Hijiki", "Hiyori_A", "Tororo", "Wanko"];

let VTS = {
  userID: "",
  channel: "",
  access_token: "",
  refresh_token: "",
  token: "",
  port: 8001,
  platform: "",
  commandCooldownGlobal: 0,
  hideDefault: true,
  commands: {},
  rewards: {},
  subs: {},
  gifts: {},
  bits: {},
};

let availableModels = [];
let hotkeysLoaded = false;

async function createReward() {
  if (!checkLogin()) {
    return;
  }
  elements.newRewardName.value = "";
  elements.newRewardDesc.value = "Powered by chat.vote/vts :)";
  elements.newRewardCost.value = "";
  elements.newRewardColor.value = "#22b14c";
  elements.newRewardCooldown.value = "";
  elements.newRewardLimit.value = "";
  elements.newRewardUserLimit.value = "";
  elements.newRewardCooldownUnit.value = "minutes";
  await loadHotkeys();
  createNewRewardModal.show();
  elements.createRewardSubmit.onclick = async function () {
    let newRewardName = elements.newRewardName.value;
    let newRewardDesc = elements.newRewardDesc.value;
    let newRewardCost = parseInt(elements.newRewardCost.value, 10);
    let newRewardColor = elements.newRewardColor.value;
    let newRewardCooldown = parseInt(elements.newRewardCooldown.value, 10);
    let newRewardCooldownUnit = elements.newRewardCooldownUnit.value;
    let newRewardLimit = parseInt(elements.newRewardLimit.value, 10);
    let newRewardUserLimit = parseInt(elements.newRewardUserLimit.value, 10);
    if (!newRewardName) {
      showToast("Reward name is required", "warning", 3000);
      return;
    }
    if (!newRewardCost || newRewardCost < 1) {
      showToast("Reward cost is required", "warning", 3000);
      return;
    }
    if (
      (newRewardCooldownUnit == "days" && newRewardCooldown > 7) ||
      (newRewardCooldownUnit == "hours" && newRewardCooldown > 168) ||
      (newRewardCooldownUnit == "minutes" && newRewardCooldown > 10080)
    ) {
      showToast("Redemption cooldown must be less than 7 days", "warning", 3000);
      return;
    }
    let templist = [];
    availableModels.forEach((model) => {
      let selectedHotkey = document.querySelector(`input[name="${model.modelID}hotkeylist2"]:checked`);
      if (!selectedHotkey) {
        return;
      }
      templist.push(model);
    });
    if (!templist.length) {
      showToast("No reward action selected", "warning", 5000);
      return;
    }
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${VTS.access_token}`);
    myHeaders.append("Client-Id", CLIENT_ID);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    let urlencoded = new URLSearchParams();
    urlencoded.append("title", newRewardName);
    urlencoded.append("cost", newRewardCost);
    urlencoded.append("prompt", newRewardDesc);
    urlencoded.append("background_color", newRewardColor);
    if (!isNaN(newRewardLimit)) {
      urlencoded.append("is_max_per_stream_enabled", "true");
      urlencoded.append("max_per_stream", newRewardLimit);
    }
    if (!isNaN(newRewardUserLimit)) {
      urlencoded.append("is_max_per_user_per_stream_enabled", "true");
      urlencoded.append("max_per_user_per_stream", newRewardUserLimit);
    }
    if (!isNaN(newRewardCooldown)) {
      switch (newRewardCooldownUnit) {
        case "days":
          newRewardCooldown = newRewardCooldown * 86400;
          break;
        case "hours":
          newRewardCooldown = newRewardCooldown * 3600;
          break;
        case "minutes":
          newRewardCooldown = newRewardCooldown * 60;
          break;
        default:
          break;
      }
      urlencoded.append("is_global_cooldown_enabled", "true");
      urlencoded.append("global_cooldown_seconds", newRewardCooldown);
    }
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };
    try {
      let response = await fetch(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${VTS.userID}`, requestOptions);
      if (response.status !== 200) {
        showToast(`Could not create reward`, "danger", 5000);
        return;
      }
      let result = await response.json();
      VTS.rewards[result.data[0].id] = {
        rewardid: result.data[0].id,
        rewardtitle: result.data[0].title,
        triggers: [],
      };
      for (let index = 0, j = availableModels.length; index < j; index++) {
        let selectedHotkey = document.querySelector(`input[name="${availableModels[index].modelID}hotkeylist2"]:checked`);
        if (!selectedHotkey) {
          if (!defaultModels.includes(availableModels[index].modelName)) {
            showToast(`No hotkey selected for "${availableModels[index].modelName}"`, "warning", 5000);
          }
          continue;
        }
        VTS.rewards[result.data[0].id].triggers.push({
          modelid: availableModels[index].modelID,
          modelname: availableModels[index].modelName,
          name: selectedHotkey.dataset.name,
          description: selectedHotkey.dataset.description,
          file: selectedHotkey.dataset.file,
          hotkeyid: selectedHotkey.value,
        });
      }
      loadLists();
      saveSettings();
      createNewRewardModal.hide();
    } catch (error) {
      console.log("error", error);
    }
  }; //onclick
} //createReward

async function updateRewards() {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${VTS.access_token}`);
  myHeaders.append("Client-Id", CLIENT_ID);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${VTS.userID}`, requestOptions);
    if (response.status !== 200) {
      showToast(`Could not update rewards`, "danger", 5000);
      return;
    }
    let result = await response.json();
    let twitchRewards = result.data;
    for (const [key, value] of Object.entries(VTS.rewards)) {
      let pos = result.data.findIndex((twitchRewards) => {
        return twitchRewards.id === key;
      });
      if (pos == -1) {
        showToast(`The "${value.rewardtitle}" reward does not exist on Twitch`, "danger", 6000);
      } else if (value.rewardtitle != twitchRewards[pos].title) {
        VTS.rewards[key].rewardtitle = twitchRewards[pos].title;
      }
    }
    let accordion = `<div class="accordion" id="rewardsAccordion">`;
    let rewardsList = `<div class="list-group">`;
    for (let index = 0, j = twitchRewards.length; index < j; index++) {
      let pic = twitchRewards[index].default_image.url_1x;
      if (twitchRewards[index].image) {
        pic = twitchRewards[index].image.url_1x;
      }
      rewardsList += `
      <label class="list-group-item">
      <input class="form-check-input" type="radio" id="${twitchRewards[index].id}_rewardslist" name="existingRewardsList"
      value="${twitchRewards[index].id}" data-title="${twitchRewards[index].title}" data-prompt="${twitchRewards[index].prompt}" 
      data-cost="${twitchRewards[index].cost}">
      <img src="${pic}" alt="reward image" style="height:2em;"> ${twitchRewards[index].title}<br>
      Prompt: ${twitchRewards[index].prompt}<br>
      Cost: ${twitchRewards[index].cost} ${twitchRewards[index].cost == 1 ? "point" : "points"}
      </label>`;
    }
    rewardsList += `</div>`;
    accordion += `
    <div class="accordion-item">
    <h2 class="accordion-header" id="rewardsAccordionHeading">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#rewardsAccordionCollapse" 
    aria-expanded="true" aria-controls="rewardsAccordionCollapse">
    Rewards
    </button>
    </h2>
    <div id="rewardsAccordionCollapse" class="accordion-collapse collapse" aria-labelledby="rewardsAccordionHeading" data-bs-parent="#rewardsAccordion">
    <div class="accordion-body">${rewardsList}</div>
    </div>
    </div>
    </div>`;
    elements.existingRewardsList.innerHTML = accordion;
    loadLists();
    saveSettings();
  } catch (error) {
    console.log("error", error);
  }
} //updateRewards

function openRewardsPage() {
  window.open(`https://dashboard.twitch.tv/u/${VTS.channel}/viewer-rewards/channel-points/rewards`, "_blank");
} //openRewardsPage

async function addCommand() {
  if (!checkLogin()) {
    return;
  }
  elements.commandName.value = "";
  elements.commandCooldown.value = 0;
  await loadHotkeys();
  addCommandModal.show();

  elements.addCommandSubmit.onclick = async function () {
    let commandName = elements.commandName.value.replace(/\s+/g, "");
    let cooldown = parseInt(elements.commandCooldown.value, 10) || 0;

    if (!commandName) {
      showToast("Invalid command name", "warning", 5000);
      return;
    }
    if (VTS.commands[commandName]) {
      showToast("Command name already in use", "warning", 5000);
      return;
    }
    if (cooldown > 3600 || cooldown < 0) {
      cooldown = 0;
    }

    VTS.commands[commandName] = {
      command: commandName,
      cooldown: cooldown,
      triggers: [],
    };
    for (let index = 0, j = availableModels.length; index < j; index++) {
      let selectedHotkey = document.querySelector(`input[name="${availableModels[index].modelID}hotkeylist0"]:checked`);
      if (!selectedHotkey) {
        if (!defaultModels.includes(availableModels[index].modelName)) {
          showToast(`No hotkey selected for "${availableModels[index].modelName}"`, "warning", 5000);
        }
        continue;
      }
      VTS.commands[commandName].triggers.push({
        modelid: availableModels[index].modelID,
        modelname: availableModels[index].modelName,
        name: selectedHotkey.dataset.name,
        description: selectedHotkey.dataset.description,
        file: selectedHotkey.dataset.file,
        hotkeyid: selectedHotkey.value,
      });
    }
    if (!VTS.commands[commandName].triggers.length) {
      delete VTS.commands[commandName];
      showToast("No command action selected", "warning", 5000);
      return;
    }

    loadLists();
    saveSettings();
    addCommandModal.hide();
  }; //addCommandSubmit
} //addCommand

async function addReward() {
  if (!checkLogin()) {
    return;
  }
  await updateRewards();
  await loadHotkeys();
  addExistingRewardModal.show();

  elements.addRewardSubmit.onclick = async function () {
    let selectedReward = document.querySelector(`input[name="existingRewardsList"]:checked`);
    if (!selectedReward) {
      showToast(`No reward selected`, "danger", 5000);
      return;
    }
    let rewardID = selectedReward.value;
    if (VTS.rewards[rewardID]) {
      showToast("Reward already in use", "warning", 5000);
      return;
    }
    if (!rewardID) {
      showToast("No reward ID found", "warning", 5000);
      return;
    }
    VTS.rewards[rewardID] = {
      rewardid: rewardID,
      rewardtitle: selectedReward.dataset.title,
      triggers: [],
    };
    for (let index = 0, j = availableModels.length; index < j; index++) {
      let selectedHotkey = document.querySelector(`input[name="${availableModels[index].modelID}hotkeylist1"]:checked`);
      if (!selectedHotkey) {
        if (!defaultModels.includes(availableModels[index].modelName)) {
          showToast(`No hotkey selected for "${availableModels[index].modelName}"`, "warning", 5000);
        }
        continue;
      }
      VTS.rewards[rewardID].triggers.push({
        modelid: availableModels[index].modelID,
        modelname: availableModels[index].modelName,
        name: selectedHotkey.dataset.name,
        description: selectedHotkey.dataset.description,
        file: selectedHotkey.dataset.file,
        hotkeyid: selectedHotkey.value,
      });
    }
    if (!VTS.rewards[rewardID].triggers.length) {
      delete VTS.rewards[rewardID];
      showToast("No reward action selected", "warning", 5000);
      return;
    }
    loadLists();
    saveSettings();
    addExistingRewardModal.hide();
  }; //addRewardSubmit
} //addReward

async function addSubAlert() {
  if (!checkLogin()) {
    return;
  }
  await loadHotkeys();
  addSubAlertModal.show();
  elements.subAlertMonths.value = 1;
  elements.addSubAlertSubmit.onclick = async function () {
    let monthsSubbed = parseInt(elements.subAlertMonths.value, 10);
    if (monthsSubbed < 1) {
      showToast(`Invalid number of months`, "warning", 5000);
      return;
    }

    let allSubs = [];
    for (const subs in VTS.subs) {
      if (VTS.subs.hasOwnProperty(subs)) {
        allSubs.push(parseInt(subs, 10));
      }
    }

    if (allSubs.includes(monthsSubbed)) {
      showToast(`There is already an alert that triggers when someone subs for ${monthsSubbed} months or more`, "warning", 5000);
      return;
    }

    VTS.subs[monthsSubbed] = {
      number: monthsSubbed,
      triggers: [],
    };
    for (let index = 0, j = availableModels.length; index < j; index++) {
      let selectedHotkey = document.querySelector(`input[name="${availableModels[index].modelID}hotkeylist5"]:checked`);
      if (!selectedHotkey) {
        if (!defaultModels.includes(availableModels[index].modelName)) {
          showToast(`No hotkey selected for "${availableModels[index].modelName}"`, "warning", 5000);
        }
        continue;
      }
      VTS.subs[monthsSubbed].triggers.push({
        modelid: availableModels[index].modelID,
        modelname: availableModels[index].modelName,
        name: selectedHotkey.dataset.name,
        description: selectedHotkey.dataset.description,
        file: selectedHotkey.dataset.file,
        hotkeyid: selectedHotkey.value,
      });
    }
    if (!VTS.subs[monthsSubbed].triggers.length) {
      delete VTS.subs[monthsSubbed];
      showToast("No hotkeys selected", "warning", 5000);
      return;
    }

    loadLists();
    saveSettings();
    addSubAlertModal.hide();
  }; //addSubAlertSubmit
} //addSubAlert

async function addGiftedSubAlert() {
  if (!checkLogin()) {
    return;
  }
  await loadHotkeys();
  addGiftedSubAlertModal.show();
  elements.giftedSubsNumber.value = 1;
  elements.addGiftedSubAlertSubmit.onclick = async function () {
    let giftedsubs = parseInt(elements.giftedSubsNumber.value, 10);
    if (giftedsubs < 1 || giftedsubs > 100) {
      showToast(`Invalid number of gifted subs"`, "warning", 5000);
      return;
    }

    let allGifts = [];
    for (const gifts in VTS.gifts) {
      if (VTS.gifts.hasOwnProperty(gifts)) {
        allGifts.push(parseInt(gifts, 10));
      }
    }

    if (allGifts.includes(giftedsubs)) {
      showToast(`There is already an alert that triggers when someone gifts ${giftedsubs} or more subs`, "warning", 5000);
      return;
    }

    VTS.gifts[giftedsubs] = {
      number: giftedsubs,
      triggers: [],
    };
    for (let index = 0, j = availableModels.length; index < j; index++) {
      let selectedHotkey = document.querySelector(`input[name="${availableModels[index].modelID}hotkeylist7"]:checked`);
      if (!selectedHotkey) {
        if (!defaultModels.includes(availableModels[index].modelName)) {
          showToast(`No hotkey selected for "${availableModels[index].modelName}"`, "warning", 5000);
        }
        continue;
      }
      VTS.gifts[giftedsubs].triggers.push({
        modelid: availableModels[index].modelID,
        modelname: availableModels[index].modelName,
        name: selectedHotkey.dataset.name,
        description: selectedHotkey.dataset.description,
        file: selectedHotkey.dataset.file,
        hotkeyid: selectedHotkey.value,
      });
    }
    if (!VTS.gifts[giftedsubs].triggers.length) {
      delete VTS.gifts[giftedsubs];
      showToast("No hotkeys selected", "warning", 5000);
      return;
    }

    loadLists();
    saveSettings();
    addGiftedSubAlertModal.hide();
  }; //addGiftedSubAlertSubmit
} //addGiftedSubAlert

async function addBitsAlert() {
  if (!checkLogin()) {
    return;
  }
  await loadHotkeys();
  addBitsAlertModal.show();
  elements.bitsNumber.value = 1;
  elements.addBitsAlertSubmit.onclick = async function () {
    let bitsNumber = parseInt(elements.bitsNumber.value, 10);
    if (bitsNumber < 1 || bitsNumber > 100000) {
      showToast(`Invalid number of bits"`, "warning", 5000);
      return;
    }

    let allBits = [];
    for (const bits in VTS.bits) {
      if (VTS.bits.hasOwnProperty(bits)) {
        allBits.push(parseInt(bits, 10));
      }
    }

    if (allBits.includes(bitsNumber)) {
      showToast(`There is already an alert that triggers when someone cheers ${bitsNumber} or more bits`, "warning", 5000);
      return;
    }

    VTS.bits[bitsNumber] = {
      bits: bitsNumber,
      triggers: [],
    };
    for (let index = 0, j = availableModels.length; index < j; index++) {
      let selectedHotkey = document.querySelector(`input[name="${availableModels[index].modelID}hotkeylist9"]:checked`);
      if (!selectedHotkey) {
        if (!defaultModels.includes(availableModels[index].modelName)) {
          showToast(`No hotkey selected for "${availableModels[index].modelName}"`, "warning", 5000);
        }
        continue;
      }
      VTS.bits[bitsNumber].triggers.push({
        modelid: availableModels[index].modelID,
        modelname: availableModels[index].modelName,
        name: selectedHotkey.dataset.name,
        description: selectedHotkey.dataset.description,
        file: selectedHotkey.dataset.file,
        hotkeyid: selectedHotkey.value,
      });
    }
    if (!VTS.bits[bitsNumber].triggers.length) {
      delete VTS.bits[bitsNumber];
      showToast("No hotkeys selected", "warning", 5000);
      return;
    }

    loadLists();
    saveSettings();
    addBitsAlertModal.hide();
  }; //addBitsAlertSubmit
} //addBitsAlert

async function editCommand(command) {
  await loadHotkeys();
  editCommandModal.show();
  let waitForHotkeys = setInterval(() => {
    if (hotkeysLoaded) {
      clearInterval(waitForHotkeys);
      let commandData = VTS.commands[command];
      for (let index = 0, j = commandData.triggers.length; index < j; index++) {
        if (document.getElementById(`${commandData.triggers[index].hotkeyid}hotkeylist3`)) {
          document.getElementById(`${commandData.triggers[index].hotkeyid}hotkeylist3`).checked = true;
        } else {
          showToast(`The "${commandData.triggers[index].name}" hotkey for the "${commandData.triggers[index].modelname}" model was not found`, "danger", 6000);
        }
      }
      elements.commandNameEdit.value = command;
      elements.commandCooldownEdit.value = VTS.commands[command].cooldown || 0;
      elements.modal7footer.innerHTML = `
      <button type="button" class="btn btn-danger" onclick=deleteCommand("${command}")><i class="material-icons notranslate">delete</i>Delete command</button>
      <button type="button" class="btn btn-primary" onclick=editCommandSubmit("${command}")><i class="material-icons notranslate">edit</i>Edit</button>`;
    }
  }, 100);
} //editCommand

async function editReward(reward) {
  await loadHotkeys();
  editRewardModal.show();
  let waitForHotkeys = setInterval(() => {
    if (hotkeysLoaded) {
      clearInterval(waitForHotkeys);
      let rewardData = VTS.rewards[reward];
      for (let index = 0, j = rewardData.triggers.length; index < j; index++) {
        if (document.getElementById(`${rewardData.triggers[index].hotkeyid}hotkeylist4`)) {
          document.getElementById(`${rewardData.triggers[index].hotkeyid}hotkeylist4`).checked = true;
        } else {
          showToast(`The "${rewardData.triggers[index].name}" hotkey for the "${rewardData.triggers[index].modelname}" model was not found`, "danger", 6000);
        }
      }
      elements.modal8footer.innerHTML = `
      <button type="button" class="btn btn-danger" onclick=deleteReward("${reward}")><i class="material-icons notranslate">delete</i>Delete reward</button>
      <button type="button" class="btn btn-primary" onclick=editRewardSubmit("${reward}")><i class="material-icons notranslate">edit</i>Edit</button>`;
    }
  }, 100);
} //editReward

async function editSubAlert(sub) {
  await loadHotkeys();
  editSubAlertModal.show();
  let waitForHotkeys = setInterval(() => {
    if (hotkeysLoaded) {
      clearInterval(waitForHotkeys);
      let subsData = VTS.subs[sub];
      for (let index = 0, j = subsData.triggers.length; index < j; index++) {
        if (document.getElementById(`${subsData.triggers[index].hotkeyid}hotkeylist6`)) {
          document.getElementById(`${subsData.triggers[index].hotkeyid}hotkeylist6`).checked = true;
        } else {
          showToast(`The "${subsData.triggers[index].name}" hotkey for the "${subsData.triggers[index].modelname}" model was not found`, "danger", 6000);
        }
      }
      elements.subAlertMonthsEdit.value = sub;
      elements.modal12footer.innerHTML = `
      <button type="button" class="btn btn-danger" onclick=deleteSubAlert("${sub}")><i class="material-icons notranslate">delete</i>Delete sub alert</button>
      <button type="button" class="btn btn-primary" onclick=editSubAlertSubmit("${sub}")><i class="material-icons notranslate">edit</i>Edit</button>`;
    }
  }, 100);
} //editSubAlert

async function editGiftedSubAlert(gift) {
  await loadHotkeys();
  editGiftedSubAlertModal.show();
  let waitForHotkeys = setInterval(() => {
    if (hotkeysLoaded) {
      clearInterval(waitForHotkeys);
      let giftsData = VTS.gifts[gift];
      for (let index = 0, j = giftsData.triggers.length; index < j; index++) {
        if (document.getElementById(`${giftsData.triggers[index].hotkeyid}hotkeylist8`)) {
          document.getElementById(`${giftsData.triggers[index].hotkeyid}hotkeylist8`).checked = true;
        } else {
          showToast(`The "${giftsData.triggers[index].name}" hotkey for the "${giftsData.triggers[index].modelname}" model was not found`, "danger", 6000);
        }
      }
      elements.giftedSubsNumberEdit.value = gift;
      elements.modal14footer.innerHTML = `
      <button type="button" class="btn btn-danger" onclick=deleteGiftedSubAlert("${gift}")><i class="material-icons notranslate">delete</i>Delete gifted sub alert</button>
      <button type="button" class="btn btn-primary" onclick=editGiftedSubAlertSubmit("${gift}")><i class="material-icons notranslate">edit</i>Edit</button>`;
    }
  }, 100);
} //editSubAlert

async function editBitsAlert(bit) {
  await loadHotkeys();
  editBitsAlertModal.show();
  let waitForHotkeys = setInterval(() => {
    if (hotkeysLoaded) {
      clearInterval(waitForHotkeys);
      let bitsData = VTS.bits[bit];
      for (let index = 0, j = bitsData.triggers.length; index < j; index++) {
        if (document.getElementById(`${bitsData.triggers[index].hotkeyid}hotkeylist10`)) {
          document.getElementById(`${bitsData.triggers[index].hotkeyid}hotkeylist10`).checked = true;
        } else {
          showToast(`The "${bitsData.triggers[index].name}" hotkey for the "${bitsData.triggers[index].modelname}" model was not found`, "danger", 6000);
        }
      }
      elements.bitsNumberEdit.value = bit;
      elements.modal16footer.innerHTML = `
      <button type="button" class="btn btn-danger" onclick=deleteBitsAlert("${bit}")><i class="material-icons notranslate">delete</i>Delete bits alert</button>
      <button type="button" class="btn btn-primary" onclick=editBitsAlertSubmit("${bit}")><i class="material-icons notranslate">edit</i>Edit</button>`;
    }
  }, 100);
} //editBitsAlert

async function editCommandSubmit(commandNameOld) {
  let commandName = elements.commandNameEdit.value.replace(/\s+/g, "");
  let cooldown = parseInt(elements.commandCooldownEdit.value, 10) || 0;

  if (!commandName) {
    showToast("Invalid command name", "warning", 5000);
    return;
  }
  if (VTS.commands[commandName] && commandNameOld != commandName) {
    showToast("Command name already in use", "warning", 5000);
    return;
  }

  if (cooldown > 3600 || cooldown < 0) {
    cooldown = 0;
  }
  VTS.commands[commandName].cooldown = cooldown;

  if (commandNameOld != commandName) {
    delete Object.assign(VTS.commands, {
      [commandName]: VTS.commands[commandNameOld],
    })[commandNameOld];
    VTS.commands[commandName].command = commandName;
  }
  VTS.commands[commandName].triggers = [];
  for (let index = 0, j = availableModels.length; index < j; index++) {
    let selectedHotkey = document.querySelector(`input[name="${availableModels[index].modelID}hotkeylist3"]:checked`);
    if (!selectedHotkey) {
      if (!defaultModels.includes(availableModels[index].modelName)) {
        showToast(`No hotkey selected for "${availableModels[index].modelName}"`, "warning", 5000);
      }
      continue;
    }
    VTS.commands[commandName].triggers.push({
      modelid: availableModels[index].modelID,
      modelname: availableModels[index].modelName,
      name: selectedHotkey.dataset.name,
      description: selectedHotkey.dataset.description,
      file: selectedHotkey.dataset.file,
      hotkeyid: selectedHotkey.value,
    });
  }
  if (!VTS.commands[commandName].triggers.length) {
    delete VTS.commands[commandName];
    showToast("No hotkeys selected", "warning", 5000);
    return;
  }
  loadLists();
  saveSettings();
  editCommandModal.hide();
} //editCommandSubmit

async function editRewardSubmit(reward) {
  VTS.rewards[reward].triggers = [];
  for (let index = 0, j = availableModels.length; index < j; index++) {
    let selectedHotkey = document.querySelector(`input[name="${availableModels[index].modelID}hotkeylist4"]:checked`);
    if (!selectedHotkey) {
      if (!defaultModels.includes(availableModels[index].modelName)) {
        showToast(`No hotkey selected for "${availableModels[index].modelName}"`, "warning", 5000);
      }
      continue;
    }
    VTS.rewards[reward].triggers.push({
      modelid: availableModels[index].modelID,
      modelname: availableModels[index].modelName,
      name: selectedHotkey.dataset.name,
      description: selectedHotkey.dataset.description,
      file: selectedHotkey.dataset.file,
      hotkeyid: selectedHotkey.value,
    });
  }
  if (!VTS.rewards[reward].triggers.length) {
    delete VTS.rewards[reward];
    showToast("No hotkeys selected", "warning", 5000);
    return;
  }
  updateRewards();
  saveSettings();
  editRewardModal.hide();
} //editRewardSubmit

async function editSubAlertSubmit(subOld) {
  let monthsSubbed = parseInt(elements.subAlertMonthsEdit.value, 10);
  if (monthsSubbed < 1) {
    showToast(`Invalid number of gifted subs"`, "warning", 5000);
    return;
  }
  let allSubs = [];
  for (const subs in VTS.subs) {
    if (VTS.subs.hasOwnProperty(subs)) {
      allSubs.push(parseInt(subs, 10));
    }
  }

  if (allSubs.includes(monthsSubbed) && subOld != monthsSubbed) {
    showToast(`There is already an alert that triggers when someone subs for ${monthsSubbed} months or more`, "warning", 5000);
    return;
  }

  if (subOld != monthsSubbed) {
    delete Object.assign(VTS.subs, {
      [monthsSubbed]: VTS.subs[subOld],
    })[subOld];
    VTS.subs[monthsSubbed].number = monthsSubbed;
  }
  VTS.subs[monthsSubbed].triggers = [];
  for (let index = 0, j = availableModels.length; index < j; index++) {
    let selectedHotkey = document.querySelector(`input[name="${availableModels[index].modelID}hotkeylist6"]:checked`);
    if (!selectedHotkey) {
      if (!defaultModels.includes(availableModels[index].modelName)) {
        showToast(`No hotkey selected for "${availableModels[index].modelName}"`, "warning", 5000);
      }
      continue;
    }
    VTS.subs[monthsSubbed].triggers.push({
      modelid: availableModels[index].modelID,
      modelname: availableModels[index].modelName,
      name: selectedHotkey.dataset.name,
      description: selectedHotkey.dataset.description,
      file: selectedHotkey.dataset.file,
      hotkeyid: selectedHotkey.value,
    });
  }
  if (!VTS.subs[monthsSubbed].triggers.length) {
    delete VTS.subs[monthsSubbed];
    showToast("No hotkeys selected", "warning", 5000);
    return;
  }
  loadLists();
  saveSettings();
  editSubAlertModal.hide();
} //editSubAlertSubmit

async function editGiftedSubAlertSubmit(giftOld) {
  let giftedsubs = parseInt(elements.giftedSubsNumberEdit.value, 10);
  if (giftedsubs < 1 || giftedsubs > 100) {
    showToast(`Invalid number of gifted subs"`, "warning", 5000);
    return;
  }
  let allGifts = [];
  for (const gifts in VTS.gifts) {
    if (VTS.gifts.hasOwnProperty(gifts)) {
      allGifts.push(parseInt(gifts, 10));
    }
  }

  if (allGifts.includes(giftedsubs) && giftOld != giftedsubs) {
    showToast(`There is already an alert that triggers when someone gifts ${giftedsubs} or more subs`, "warning", 5000);
    return;
  }

  if (giftOld != giftedsubs) {
    delete Object.assign(VTS.gifts, {
      [giftedsubs]: VTS.gifts[giftOld],
    })[giftOld];
    VTS.gifts[giftedsubs].number = giftedsubs;
  }
  VTS.gifts[giftedsubs].triggers = [];
  for (let index = 0, j = availableModels.length; index < j; index++) {
    let selectedHotkey = document.querySelector(`input[name="${availableModels[index].modelID}hotkeylist8"]:checked`);
    if (!selectedHotkey) {
      if (!defaultModels.includes(availableModels[index].modelName)) {
        showToast(`No hotkey selected for "${availableModels[index].modelName}"`, "warning", 5000);
      }
      continue;
    }
    VTS.gifts[giftedsubs].triggers.push({
      modelid: availableModels[index].modelID,
      modelname: availableModels[index].modelName,
      name: selectedHotkey.dataset.name,
      description: selectedHotkey.dataset.description,
      file: selectedHotkey.dataset.file,
      hotkeyid: selectedHotkey.value,
    });
  }
  if (!VTS.gifts[giftedsubs].triggers.length) {
    delete VTS.gifts[giftedsubs];
    showToast("No hotkeys selected", "warning", 5000);
    return;
  }
  loadLists();
  saveSettings();
  editGiftedSubAlertModal.hide();
} //editGiftedSubAlertSubmit

async function editBitsAlertSubmit(bitOld) {
  let bitsNumber = parseInt(elements.bitsNumberEdit.value, 10);
  if (bitsNumber < 1 || bitsNumber > 100000) {
    showToast(`Invalid number of bits"`, "warning", 5000);
    return;
  }
  let allBits = [];
  for (const bits in VTS.bits) {
    if (VTS.bits.hasOwnProperty(bits)) {
      allBits.push(parseInt(bits, 10));
    }
  }

  if (allBits.includes(bitsNumber) && bitOld != bitsNumber) {
    showToast(`There is already an alert that triggers when someone cheers ${bitsNumber} or more bits`, "warning", 5000);
    return;
  }

  if (bitOld != bitsNumber) {
    delete Object.assign(VTS.bits, {
      [bitsNumber]: VTS.bits[bitOld],
    })[bitOld];
    VTS.bits[bitsNumber].bits = bitsNumber;
  }
  VTS.bits[bitsNumber].triggers = [];
  for (let index = 0, j = availableModels.length; index < j; index++) {
    let selectedHotkey = document.querySelector(`input[name="${availableModels[index].modelID}hotkeylist10"]:checked`);
    if (!selectedHotkey) {
      if (!defaultModels.includes(availableModels[index].modelName)) {
        showToast(`No hotkey selected for "${availableModels[index].modelName}"`, "warning", 5000);
      }
      continue;
    }
    VTS.bits[bitsNumber].triggers.push({
      modelid: availableModels[index].modelID,
      modelname: availableModels[index].modelName,
      name: selectedHotkey.dataset.name,
      description: selectedHotkey.dataset.description,
      file: selectedHotkey.dataset.file,
      hotkeyid: selectedHotkey.value,
    });
  }
  if (!VTS.bits[bitsNumber].triggers.length) {
    delete VTS.bits[bitsNumber];
    showToast("No hotkeys selected", "warning", 5000);
    return;
  }
  loadLists();
  saveSettings();
  editBitsAlertModal.hide();
} //editBitsAlertSubmit

function deleteCommand(command) {
  editCommandModal.hide();
  elements.modal9footer.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick=deleteCommandSubmit("${command}")>Delete the "${command}" command</button>`;
  elements.modal9body.innerHTML = `Are you sure you want to delete the "${command}" command?`;
  confirmDeletionModal.show();
} //deleteCommand

function deleteReward(reward) {
  editRewardModal.hide();
  elements.modal9footer.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick=deleteRewardSubmit("${reward}")>Delete the "${VTS.rewards[reward].rewardtitle}" reward</button>`;
  elements.modal9body.innerHTML = `Are you sure you want to delete the "${VTS.rewards[reward].rewardtitle}" reward?
    <br><br> Make sure to delete the reward on Twitch also <button class="btn btn-twitch" onclick="openRewardsPage()"><span class="twitch-icon"></span> Delete reward on Twitch</button>`;
  confirmDeletionModal.show();
} //deleteReward

function deleteSubAlert(sub) {
  editSubAlertModal.hide();
  elements.modal9footer.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick=deleteSubAlertSubmit("${sub}")>Delete the alert for ${sub} months or more</button>`;
  elements.modal9body.innerHTML = `Are you sure you want to delete the alert for ${sub} or more subbed months?`;
  confirmDeletionModal.show();
} //deleteSubAlert

function deleteGiftedSubAlert(gift) {
  editGiftedSubAlertModal.hide();
  elements.modal9footer.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick=deleteGiftedSubAlertSubmit("${gift}")>Delete the ${gift} or more gifted subs alert</button>`;
  elements.modal9body.innerHTML = `Are you sure you want to delete the alert for ${gift} or more gifted subs?`;
  confirmDeletionModal.show();
} //deleteGiftedSubAlert

function deleteBitsAlert(bit) {
  editBitsAlertModal.hide();
  elements.modal9footer.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick=deleteBitsAlertSubmit("${bit}")>Delete the ${bit} or more bits alert</button>`;
  elements.modal9body.innerHTML = `Are you sure you want to delete the alert for ${bit} or more bits?`;
  confirmDeletionModal.show();
} //deleteBitsAlert

function deleteCommandSubmit(command) {
  try {
    delete VTS.commands[command];
    showToast(`Deleted the "${command}" command`, "info", 3000);
    loadLists();
    saveSettings();
  } catch (error) {
    console.log(error);
  }
} //deleteCommandSubmit

function deleteRewardSubmit(reward) {
  let name = VTS.rewards[reward].rewardtitle;
  try {
    delete VTS.rewards[reward];
    showToast(`Deleted the "${name}" reward`, "info", 3000);
    loadLists();
    saveSettings();
  } catch (error) {
    console.log(error);
  }
} //deleteRewardSubmit

function deleteSubAlertSubmit(sub) {
  try {
    delete VTS.subs[sub];
    showToast(`Deleted the ${sub} or more months subbed alert`, "info", 3000);
    loadLists();
    saveSettings();
  } catch (error) {
    console.log(error);
  }
} //deleteSubAlertSubmit

function deleteGiftedSubAlertSubmit(gift) {
  try {
    delete VTS.gifts[gift];
    showToast(`Deleted the ${gift} or more gifted sub alert`, "info", 3000);
    loadLists();
    saveSettings();
  } catch (error) {
    console.log(error);
  }
} //deleteGiftedSubAlertSubmit

function deleteBitsAlertSubmit(bit) {
  try {
    delete VTS.bits[bit];
    showToast(`Deleted the ${bit} or more bits alert`, "info", 3000);
    loadLists();
    saveSettings();
  } catch (error) {
    console.log(error);
  }
} //deleteBitsAlertSubmit

async function triggerHotkey(hotkey) {
  try {
    let currentModel = await apiClient.currentModel();
    let trigger = hotkey.triggers.find((e) => e.modelid == currentModel.modelID);
    if (trigger) {
      let res = await apiClient.hotkeyTrigger({ hotkeyID: trigger.hotkeyid });
      console.log(res);
    }
  } catch (error) {
    showToast(error?.message || "Could not trigger hotkey", "warning", 3000);
    console.log("triggerHotkey error", error);
  }
} //triggerHotkey

async function testHotkey(hotkeyID, modelID) {
  try {
    let res = await apiClient.hotkeyTrigger({ hotkeyID: hotkeyID });
  } catch (error) {
    showToast(error?.message || "Could not test hotkey", "warning", 3000);
    console.log("testHotkey error", error);
  }
} //testHotkey

async function loadModel(modelID) {
  try {
    let res = await apiClient.modelLoad({ modelID: modelID });
  } catch (error) {
    showToast(error?.message || "Could not load model", "warning", 3000);
    console.error("loadModel error", error);
  }
  await loadHotkeys();
} //loadModel

async function loadHotkeys() {
  hotkeysLoaded = false;

  let hotkeys = [];
  let modalBodies = document.querySelectorAll(".hotkeyList");
  let res = await apiClient.availableModels();
  availableModels = res.availableModels;
  for (let index = 0; index < availableModels.length; index++) {
    let modelhotkeys = await apiClient.hotkeysInCurrentModel({ modelID: availableModels[index].modelID });
    hotkeys.push(modelhotkeys);
  }
  for (let modalIndex = 0; modalIndex < modalBodies.length; modalIndex++) {
    let accordion = `<div class="accordion" id="hotkeyAccordion${modalIndex}">`;

    for (let modelIndex = 0; modelIndex < hotkeys.length; modelIndex++) {
      let model = hotkeys[modelIndex];

      if (defaultModels.includes(model.modelName) && VTS.hideDefault) {
        continue;
      }
      let modelHotkeyList = `
        <p>Hotkey to trigger when the "${model.modelName}" model is loaded</p>
        <div class="list-group">`;

      if (!model.availableHotkeys) {
        continue;
      }

      for (let index2 = 0; index2 < model.availableHotkeys.length; index2++) {
        let hotkey = model.availableHotkeys[index2];
        modelHotkeyList += `
          <label class="list-group-item">
          <input class="form-check-input" type="radio" id="${hotkey.hotkeyID}hotkeylist${modalIndex}" name="${model.modelID}hotkeylist${modalIndex}"
          value="${hotkey.hotkeyID}" data-name="${!hotkey.name ? "unnamed hotkey" : hotkey.name}" data-description="${hotkey.description}" data-file="${hotkey.file}">
          ${!hotkey.name ? "unnamed hotkey" : hotkey.name} - ${hotkey.description} ${!hotkey.file ? "" : "- " + hotkey.file}
          <button type="button" onclick="testHotkey('${hotkey.hotkeyID}','${model.modelID}')" class="btn btn-secondary float-end float-top">Test</button>
          </label>`;
      }

      modelHotkeyList += `</div>`;
      accordion += `
      <div class="accordion-item">
      <div class="container">
      <div class="row">
      <div class="col p-0">
      <h2 class="accordion-header" id="hotkeyAccordion${modalIndex}Heading${modelIndex}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#hotkeyAccordion${modalIndex}Collapse${modelIndex}" 
      aria-expanded="true" aria-controls="hotkeyAccordion${modalIndex}Collapse${modelIndex}">
      ${model.modelName} - ${model.availableHotkeys.length} hotkeys ${model.modelLoaded ? "(current model)" : ""}
      </button>
      </h2>
      </div>
      <div class="col-1 dankcol">
      <button class="btn btn-secondary float-start load-model-btn" onclick="loadModel('${model.modelID}')" type="button">Load</button>
      </div>
      </div>
      </div>
      <div id="hotkeyAccordion${modalIndex}Collapse${modelIndex}" class="accordion-collapse collapse" aria-labelledby="hotkeyAccordion${modalIndex}Heading${modelIndex}" 
      data-bs-parent="#hotkeyAccordion${modalIndex}">
      <div class="accordion-body">
      ${modelHotkeyList}
      </div>
      </div>
      </div>`;
    } //for models

    accordion += `</div>`;
    modalBodies[modalIndex].innerHTML = `
      <h3>Hotkeys</h3>
      <small class="text-body-secondary">Select a hotkey for each model so that the command/reward/alert always does something</small>
      ${accordion}`;
  } //for modals

  hotkeysLoaded = true;
} //loadHotkeys

function loadLists() {
  elements.commandsList.innerHTML = "nothing here :)";
  elements.rewardsList.innerHTML = "nothing here :)";
  elements.subsList.innerHTML = "nothing here :)";
  elements.giftsList.innerHTML = "nothing here :)";
  elements.bitsList.innerHTML = "nothing here :)";

  for (const command in VTS.commands) {
    if (VTS.commands.hasOwnProperty(command)) {
      let commandinfo = `
      <li class="list-group-item">
      <b>Command:</b> ${VTS.commands[command].command}<br>
      <b>Cooldown:</b> ${VTS.commands[command].cooldown || 0}s<br>
      <b>Actions:</b><br>`;
      VTS.commands[command].triggers.forEach((trigger) => {
        commandinfo += `
        <ul class="list-unstyled">
        <ul>
        <li><b>${trigger.modelname}</b>
        <ul>
        <li>Hotkey: ${trigger.name} - ${trigger.description} ${trigger.file ? "- " + trigger.file : ""}</li>
        </ul>
        </li>
        </ul>
        </ul>`;
      });
      commandinfo += `<i class="material-icons notranslate editbtn float-end" title="edit command" onclick="editCommand('${command}')">edit</i></li>`;
      if (elements.commandsList.innerHTML == "nothing here :)") {
        elements.commandsList.innerHTML = "";
      }
      elements.commandsList.innerHTML = commandinfo + elements.commandsList.innerHTML;
    }
  }

  for (const reward in VTS.rewards) {
    if (VTS.rewards.hasOwnProperty(reward)) {
      let rewardinfo = `
      <li class="list-group-item">
      <b>Reward:</b> ${VTS.rewards[reward].rewardtitle}<br>
      <b>Actions:</b><br>`;
      VTS.rewards[reward].triggers.forEach((trigger) => {
        rewardinfo += `
        <ul class="list-unstyled">
        <ul>
        <li><b>${trigger.modelname}</b>
        <ul>
        <li>Hotkey: ${trigger.name} - ${trigger.description} ${trigger.file ? "- " + trigger.file : ""}</li>
        </ul>
        </li>
        </ul>
        </ul>`;
      });
      rewardinfo += `<i class="material-icons notranslate editbtn float-end" title="edit reward" onclick="editReward('${reward}')">edit</i></li>`;
      if (elements.rewardsList.innerHTML == "nothing here :)") {
        elements.rewardsList.innerHTML = "";
      }
      elements.rewardsList.innerHTML = rewardinfo + elements.rewardsList.innerHTML;
    }
  }

  for (const sub in VTS.subs) {
    if (VTS.subs.hasOwnProperty(sub)) {
      let subsinfo = `
      <li class="list-group-item">
      ${sub} or more months:<br>
      <b>Actions:</b><br>`;
      VTS.subs[sub].triggers.forEach((trigger) => {
        subsinfo += `
        <ul class="list-unstyled">
        <ul>
        <li><b>${trigger.modelname}</b>
        <ul>
        <li>Hotkey: ${trigger.name} - ${trigger.description} ${trigger.file ? "- " + trigger.file : ""}</li>
        </ul>
        </li>
        </ul>
        </ul>`;
      });
      subsinfo += `<i class="material-icons notranslate editbtn float-end" title="edit sub alert" onclick="editSubAlert('${sub}')">edit</i></li>`;
      if (elements.subsList.innerHTML == "nothing here :)") {
        elements.subsList.innerHTML = "";
      }
      elements.subsList.innerHTML = subsinfo + elements.subsList.innerHTML;
    }
  }

  for (const gift in VTS.gifts) {
    if (VTS.gifts.hasOwnProperty(gift)) {
      let giftsinfo = `
      <li class="list-group-item">
      ${gift} or more gifted subs:<br>
      <b>Actions:</b><br>`;
      VTS.gifts[gift].triggers.forEach((trigger) => {
        giftsinfo += `
        <ul class="list-unstyled">
        <ul>
        <li><b>${trigger.modelname}</b>
        <ul>
        <li>Hotkey: ${trigger.name} - ${trigger.description} ${trigger.file ? "- " + trigger.file : ""}</li>
        </ul>
        </li>
        </ul>
        </ul>`;
      });
      giftsinfo += `<i class="material-icons notranslate editbtn float-end" title="edit gifted sub alert" onclick="editGiftedSubAlert('${gift}')">edit</i></li>`;
      if (elements.giftsList.innerHTML == "nothing here :)") {
        elements.giftsList.innerHTML = "";
      }
      elements.giftsList.innerHTML = giftsinfo + elements.giftsList.innerHTML;
    }
  }

  for (const bit in VTS.bits) {
    if (VTS.bits.hasOwnProperty(bit)) {
      let bitsinfo = `
      <li class="list-group-item">
      ${bit} or more bits:<br>
      <b>Actions:</b><br>`;
      VTS.bits[bit].triggers.forEach((trigger) => {
        bitsinfo += `
        <ul class="list-unstyled">
        <ul>
        <li><b>${trigger.modelname}</b>
        <ul>
        <li>Hotkey: ${trigger.name} - ${trigger.description} ${trigger.file ? "- " + trigger.file : ""}</li>
        </ul>
        </li>
        </ul>
        </ul>`;
      });
      bitsinfo += `<i class="material-icons notranslate editbtn float-end" title="edit bits alert" onclick="editBitsAlert('${bit}')">edit</i></li>`;
      if (elements.bitsList.innerHTML == "nothing here :)") {
        elements.bitsList.innerHTML = "";
      }
      elements.bitsList.innerHTML = bitsinfo + elements.bitsList.innerHTML;
    }
  }
} //loadLists

function checkLogin() {
  if (!VTS.channel) {
    loginButton.show();
    setTimeout(function () {
      loginButton.hide();
    }, 4000);
    return false;
  }
  return true;
} //checkLogin

async function loadYTPFP() {
  if (!VTS.access_token) {
    elements.topright2.innerHTML = `<a
    role="button"
    id="loginButton"
    onclick="login()"
    class="btn btn-twitch"
    tabindex="0"
    data-bs-container="body"
    data-bs-custom-class="custom-popover"
    data-bs-placement="bottom"
    data-bs-trigger="manual"
    data-bs-toggle="popover"
    data-bs-title="Not signed in"
    data-bs-content="You need sign in first before connecting to VTS or adding commands/rewards/alerts"
    ><span class="twitch-icon"></span>Sign in with Twitch</a
  >`;
    elements.topright3.innerHTML = `<a role="button" id="YTloginButton" onclick="YTlogin()" class="btn btn-youtube" tabindex="0"><span class="youtube-icon"></span>Sign in with YouTube</a>`;
    elements.topright2.style.display = "block";
    elements.topright3.style.display = "block";
    return;
  }

  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${VTS.access_token}`);
  myHeaders.append("Accept", `application/json`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&maxResults=50&mine=true&key=${API_KEY_YT}`, requestOptions);
    let result = await response.json();
    if (response.status != 200 && !retried) {
      retried = true;
      await refreshYTtoken();
      await loadYTPFP();
      return;
    }
    //console.log(result);
    if (!result.items) {
      elements.youtubeModalTitle.innerHTML = "Error";
      if (result.error.code == 401) {
        elements.youtubeModalBody.innerHTML = "Login expired or revoked";
      } else {
        elements.youtubeModalBody.innerHTML = "Could not find any YouTube channels on your Google account";
      }
      youtubeModal.show();
      return;
    }
    if (result.items.length > 1) {
      console.log("found more than 1 channel");
      return;
    }
    VTS.userID = result.items[0].id;
    VTS.channel = result.items[0].snippet.title;
    localStorage.setItem("VTS", JSON.stringify(VTS));

    elements.topright3.innerHTML = `
    <div class="btn-group" role="group" aria-label="log in button group">
    <button type="button" id="btnGroupDropYTlogin2" class="btn btn-${darkTheme ? "dark" : "secondary"}"><img src="${
      result.items[0].snippet.thumbnails.default.url
    }" alt="profile pic" style="height:2em;"></button>
    <div class="btn-group" role="group">
    <button id="btnGroupDropYTlogin" type="button"  class="btn btn-${darkTheme ? "dark" : "secondary"} dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    ${result.items[0].snippet.title}
    </button>
    <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDropYTlogin">
    <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
    </ul>
    </div>
    </div>`;
    elements.topright2.style.display = "none";

    loadYTStreams();
    sendUsername(`chat.vote/vts`, VTS.channel, VTS.platform, YT_STREAM_ID);
  } catch (error) {
    console.log("loadYTPFP error", error);
  }
} //loadYTPFP

async function refreshAfter(delay) {
  if (isNaN(delay)) {
    return;
  }
  console.log(`refreshing YT token in ${delay * 1000}`);
  setTimeout(() => {
    refreshYTtoken();
  }, delay * 1000);
} //refreshAfter

async function refreshYTtoken() {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let raw = JSON.stringify({
    access_token: VTS.access_token,
    refresh_token: VTS.refresh_token,
  });
  let requestOptions = { method: "POST", headers: myHeaders, body: raw, redirect: "follow" };
  try {
    let response = await fetch(`https://helper.donk.workers.dev/youtube/refresh`, requestOptions);
    let result = await response.json();
    if (result.error) {
      elements.youtubeModalTitle.innerHTML = "API error";
      elements.youtubeModalBody.innerHTML = result.error_description || "Could not log in";
      youtubeModal.show();
      return;
    }
    VTS.access_token = result.access_token;
    console.log("YT token refreshed");
    refreshAfter(parseInt(result.expires_in, 10) - 60);
  } catch (error) {
    console.log("refreshYTtoken error", error);
  }
} //refreshYTtoken

async function loadYTStreams(manual = false) {
  clearTimeout(readChatTimeout);

  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${VTS.access_token}`);
  myHeaders.append("Accept", `application/json`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  try {
    let response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/liveBroadcasts?part=snippet%2CcontentDetails%2Cstatus&broadcastType=all&mine=true&key=${API_KEY_YT}&maxResults=50`,
      requestOptions
    );
    let result = await response.json();
    //console.log(result);

    if (response.status != 200) {
      elements.youtubeModalTitle.innerHTML = "API error";
      elements.youtubeModalBody.innerHTML = result.error.message || "Could not find any live streams on your channel";
      youtubeModal.show();
      return;
    }

    if (!result.items) {
      elements.youtubeModalTitle.innerHTML = "Error";
      elements.youtubeModalBody.innerHTML = "Could not find any live streams on your channel";
      youtubeModal.show();
      return;
    }
    let statuses = ["created", "live", "liveStarting", "ready", "testStarting", "testing"];
    let streams = [];
    for (let index = 0; index < result.items.length; index++) {
      if (statuses.includes(result.items[index].status.lifeCycleStatus)) {
        streams.push(result.items[index]);
      }
    }

    if (streams.length < 1) {
      elements.youtubeModalTitle.innerHTML = "Error";
      elements.youtubeModalBody.innerHTML = "Could not find any active/upcoming streams on your channel";
      youtubeModal.show();
      return;
    }
    //console.log(streams);
    if (streams.length == 1 && !manual) {
      selectStream(streams[0].id, streams[0].snippet.liveChatId, streams[0].snippet.title);
    } else {
      let buttons = ``;
      for (let index = 0; index < streams.length; index++) {
        let formatter = new Intl.RelativeTimeFormat("en");
        let diff = -(new Date() - new Date(streams[index].snippet.scheduledStartTime)) / (60 * 1000);
        let unit = "minutes";
        if (Math.abs(diff) > 60 && Math.abs(diff) < 1440) {
          unit = "hours";
          diff = diff / 60;
        } else if (Math.abs(diff) >= 1440) {
          unit = "days";
          diff = diff / 1440;
        }

        let time = formatter.format(diff, unit);
        buttons += `
        <div class="card streamcard">
        <div class="card-body">
        <div class="row">
        <div class="col-xl-4">
        <img src="${streams[index].snippet.thumbnails.default.url}" class="stream-thumbnail" alt="stream thumbnail"
         height="${streams[index].snippet.thumbnails.default.height}" width="${streams[index].snippet.thumbnails.default.width}">
         <button type="button" class="btn btn-success select-stream" data-bs-dismiss="modal" 
         onclick="selectStream('${streams[index].id}','${streams[index].snippet.liveChatId}','${streams[index].snippet.title}')">
         Select
         </button>
         </div>
         <div class="col-xl-8">
         <b>Title:</b> ${streams[index].snippet.title}<br>
         <b>Scheduled start time:</b> ${time}<br>
         <b>Status:</b> ${streams[index].status.lifeCycleStatus}<br>
         <b>Link:</b> <a href="https://youtu.be/${streams[index].id}" target="_blank" rel="noopener noreferrer">youtu.be/${streams[index].id}</a><br>
         </div>
         </div>
         </div>
         </div>`;
      }

      elements.youtubeModalTitle.innerHTML = "Select which stream to connect to";
      elements.youtubeModalBody.innerHTML = buttons;
      youtubeModal.show();
      return;
    }
  } catch (error) {
    console.log("loadYTStreams error", error);
  }
} //loadYTStreams

function selectStream(streamID, chatID, streamTitle) {
  YT_STREAM_ID = streamID;
  YT_CHAT_ID = chatID;
  readYTChat();
  elements.streamStatus.innerHTML = `<h4>
  <span class="badge bg-success">
  Connected to chat: <a class="truncate" style="display: inline-block;" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=${streamID}">${streamTitle}</a>
  <button type="button" onclick="loadYTStreams(true)" class="btn btn-primary change-stream">Change</button>
  </span>
  </h4>`;
  sendUsername(`chat.vote/vts`, VTS.channel, VTS.platform, YT_STREAM_ID);
} //selectStream

async function loadPFP() {
  if (!VTS.channel) {
    elements.topright2.innerHTML = `<a
    role="button"
    id="loginButton"
    onclick="login()"
    class="btn btn-twitch"
    tabindex="0"
    data-bs-container="body"
    data-bs-custom-class="custom-popover"
    data-bs-placement="bottom"
    data-bs-trigger="manual"
    data-bs-toggle="popover"
    data-bs-title="Not signed in"
    data-bs-content="You need sign in first before connecting to VTS or adding commands/rewards/alerts"
    ><span class="twitch-icon"></span>Sign in with Twitch</a
  >`;
    elements.topright3.innerHTML = `<a role="button" id="YTloginButton" onclick="YTlogin()" class="btn btn-youtube" tabindex="0"><span class="youtube-icon"></span>Sign in with YouTube</a>`;
    elements.topright2.style.display = "block";
    elements.topright3.style.display = "block";
    return;
  }
  let profilepicurl = await get7TVPFP(VTS.userID);
  if (profilepicurl == "/pics/donk.png" && VTS.access_token) {
    profilepicurl = await getTwitchPFP(VTS.channel, VTS.access_token);
  }

  elements.topright2.innerHTML = `
  <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
  <button type="button" id="btnGroupDrop2" class="btn btn-${darkTheme ? "dark" : "secondary"}"><img src="${profilepicurl}" alt="profile pic" style="height:2em;"></button>
  <div class="btn-group" role="group">
  <button id="btnGroupDrop1" type="button" class="btn btn-${darkTheme ? "dark" : "secondary"} dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
  ${VTS.channel}
  </button>
  <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDrop1">
  <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
  </ul>
  </div>
  </div>`;
  elements.topright3.style.display = "none";
} //loadPFP

function login() {
  elements.topright2.innerHTML = `<div class="btn-group" role="group" aria-label="log in button group">
    <button type="button" class="btn btn-twitch"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></button>
    <div class="btn-group" role="group">
        <button id="btnGroupDroplogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      </button>
        <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDroplogin">
            <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
        </ul>
    </div>
</div>`;
  window.open("/vts/prompt.html", "loginWindow", "toolbar=0,status=0,scrollbars=0,width=500px,height=800px");
  elements.topright3.style.display = "none";
  return false;
} //login

function YTlogin() {
  elements.topright3.innerHTML = `<div class="btn-group" role="group" aria-label="log in button group">
    <button type="button" class="btn btn-youtube"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></button>
    <div class="btn-group" role="group">
        <button id="btnGroupDropYTlogin" type="button" class="btn btn-youtube dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      </button>
        <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDropYTlogin">
            <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
        </ul>
    </div>
</div>`;
  window.open("/vts/ytlogin.html", "loginWindow", "toolbar=0,status=0,scrollbars=0,width=500px,height=800px");
  elements.topright2.style.display = "none";
  return false;
} //YTlogin

function loginVTS() {
  if (!checkLogin()) {
    return;
  }
  elements.topright1.innerHTML = `
    <a role="button" id="connectvtsbtn" onclick="loginVTS()" class="btn btn-vts" tabindex="0" data-bs-container="body" 
    data-bs-custom-class="custom-popover" data-bs-placement="bottom" data-bs-trigger="manual" data-bs-toggle="popover" data-bs-title="VTS not connected"
    data-bs-content="You need connect VTube Studio before adding commands/rewards">
    <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></a>`;
  connectVTSModal.show();
} //loginVTS

function logout() {
  elements.topright2.innerHTML = `<a
  role="button"
  id="loginButton"
  onclick="login()"
  class="btn btn-twitch"
  tabindex="0"
  data-bs-container="body"
  data-bs-custom-class="custom-popover"
  data-bs-placement="bottom"
  data-bs-trigger="manual"
  data-bs-toggle="popover"
  data-bs-title="Not signed in"
  data-bs-content="You need sign in first before connecting to VTS or adding commands/rewards/alerts"
  ><span class="twitch-icon"></span>Sign in with Twitch</a
>`;
  elements.topright3.innerHTML = `<a role="button" id="YTloginButton" onclick="YTlogin()" class="btn btn-youtube" tabindex="0"><span class="youtube-icon"></span>Sign in with YouTube</a>`;
  elements.topright2.style.display = "block";
  elements.topright3.style.display = "block";
  if (VTS.platform == "youtube") {
    revokeYT();
  }
  resetSettings();
} //logout

async function revokeYT() {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  let requestOptions = { method: "POST", headers: myHeaders, redirect: "follow" };
  try {
    let response = await fetch(`https://oauth2.googleapis.com/revoke?token=${VTS.access_token}`, requestOptions);
    console.log("revokeYT response code", response.status);
  } catch (error) {
    console.log("revokeYT error", error);
  }
} //revokeYT

function cancelVTSlogin() {
  elements.topright1.innerHTML = `<a role="button" id="connectvtsbtn" onclick="loginVTS()" class="btn btn-vts"
    tabindex="0" data-bs-container="body" data-bs-custom-class="custom-popover" data-bs-placement="bottom" data-bs-trigger="manual"
    data-bs-toggle="popover" data-bs-title="VTS not connected" data-bs-content="You need connect VTube Studio before adding commands/rewards">
    <span class="vts-icon"></span>Connect VTube Studio</a>`;
} //cancelVTSlogin

function setAuthToken(newToken) {
  console.log("vts token saved");
  VTS.token = newToken;
  saveSettings();
} //setAuthToken

function getAuthToken() {
  return VTS.token;
} //getAuthToken

function connectVTS() {
  if (!checkLogin()) {
    return;
  }
  let port = parseInt(elements.port.value, 10) || 8001;
  elements.VTSstatus.innerHTML = `
  <h4><span class="badge bg-warning">
  VTS connecting... 
  <div class="spinner-border" style="width:18px;height:18px;" role="status"><span class="visually-hidden">Loading...</span></div>
  </span></h4>`;
  try {
    const options = {
      authTokenGetter: getAuthToken,
      authTokenSetter: setAuthToken,
      pluginName: "chat.vote/vts",
      pluginDeveloper: "badoge",
      pluginIcon: icon,
      port: port,
    };

    apiClient = new vtubestudio.ApiClient(options);

    apiClient.on("connect", async () => {
      // The API client just finished authenticating with VTube Studio, or reconnecting if it lost connection.
      elements.VTSstatus.innerHTML = `<h4><span class="badge bg-success">VTS connected :)</span></h4>`;
      connectVTSModal.hide();
      document.getElementById("connectvtsbtn").style.display = "none";

      // Run any commands you need to persist across reconnections here, such as event subscriptions:
      // apiClient.events.modelLoaded.subscribe((data) => {
      // });
    });

    apiClient.on("disconnect", async () => {
      elements.VTSstatus.innerHTML = `<h4><span class="badge bg-danger">VTS disconnected :(</span></h4>`;
    });

    apiClient.on("error", async (error) => {
      showToast(error, "warning", 3000);
    });
  } catch (error) {
    console.log(error);
  }
} //connectVTS

function connectTwitch() {
  refreshData();
  if (!VTS.channel) {
    return;
  }
  loadBadges(VTS.channel);

  elements.streamStatus.innerHTML = `
  <h4><span class="badge bg-warning">
  Chat connecting... <div class="spinner-border" style="width:18px;height:18px;" role="status"><span class="visually-hidden">Loading...</span></div>
  </span></h4>`;
  elements.topright2.innerHTML = `<div class="btn-group" role="group" aria-label="log in button group">
    <button type="button" class="btn btn-twitch"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></button>
    <div class="btn-group" role="group">
        <button id="btnGroupDroplogin" type="button" class="btn btn-twitch dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      </button>
        <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="btnGroupDrop1">
            <li><a class="dropdown-item" onclick="logout()" href="#"><i class="material-icons notranslate">logout</i>Log out</a></li>
        </ul>
    </div>
</div>`;

  client = new tmi.Client({
    connection: {
      reconnect: true,
      secure: true,
    },
    channels: [VTS.channel],
  });

  client.connect().catch(console.error);
  changeSiteLinkTarget("_blank");

  client.on("connected", (address, port) => {
    console.log(`Connected to ${address}:${port}`);
    elements.streamStatus.innerHTML = `<h4><span class="badge bg-success">Chat connected :)</span></h4>`;
    saveSettings();
    sendUsername(`chat.vote/vts`, VTS.channel, VTS.platform, YT_STREAM_ID);
    sendData("chat.vote/vts", VTS.channel, VTS.platform, { commands: VTS.commands, rewards: VTS.rewards, subs: VTS.subs, gifts: VTS.gifts, bits: VTS.bits }, YT_STREAM_ID);
    loadPFP();
  }); //connected

  client.on("disconnected", (reason) => {
    elements.streamStatus.innerHTML = `<h4><span class="badge bg-danger">Chat disconnected: ${reason}</span></h4>`;
  }); //disconnected

  client.on("notice", (channel, msgid, message) => {
    elements.streamStatus.innerHTML = `<h4><span class="badge bg-danger">Chat disconnected: ${message}</span></h4>`;
  }); //notice

  client.on("message", (target, context, message, self) => {
    let input = message.split(" ").filter(Boolean);
    let command = input[0].toLowerCase();
    if (VTS.commands[command]) {
      if ((Date.now() - cooldowns.global) / 1000 < VTS.commandCooldownGlobal) {
        return;
      }
      if (cooldowns[command] && (Date.now() - cooldowns[command]) / 1000 < VTS.commands[command].cooldown) {
        return;
      }
      cooldowns[VTS.commands[command].command] = Date.now();
      cooldowns.global = Date.now();
      triggerHotkey(VTS.commands[command]);
      log({
        action: `Used command: "${command}"`,
        id: context["user-id"],
        username: context.username,
        displayname: context["display-name"],
        firstmsg: context["first-msg"],
        color: context.color,
        badges: context.badges,
      });
    }
  }); //message

  client.on("subscription", (channel, username, method, message, userstate) => {
    let subs = Object.keys(VTS.subs);
    for (let index = 0; index < subs.length; index++) {
      subs[index] = parseInt(subs[index]);
    }
    let months = parseInt(userstate["msg-param-cumulative-months"], 10) || 1; //lidl tmijs converts 1 to true
    subs = subs.sort((a, b) => a - b);
    if (subs.length > 0) {
      let subbed = parseInt(months, 10) || 1;
      let max = 0;
      for (let index = 0; index < subs.length; index++) {
        if (subbed >= subs[index]) {
          max = subs[index];
        }
      }
      triggerHotkey(VTS.subs[max]);
      log({
        action: userstate["system-msg"],
        id: userstate["user-id"],
        username: userstate.login,
        displayname: userstate["display-name"],
        firstmsg: false,
        color: userstate.color,
        badges: userstate.badges,
      });
    }
  }); //subscription

  client.on("resub", (channel, username, months, message, userstate, methods) => {
    let subs = Object.keys(VTS.subs);
    for (let index = 0; index < subs.length; index++) {
      subs[index] = parseInt(subs[index]);
    }
    subs = subs.sort((a, b) => a - b);
    if (subs.length > 0) {
      let subbed = parseInt(userstate["msg-param-cumulative-months"], 10) || 1;
      let max = 0;
      for (let index = 0; index < subs.length; index++) {
        if (subbed >= subs[index]) {
          max = subs[index];
        }
      }
      triggerHotkey(VTS.subs[max]);
      log({
        action: userstate["system-msg"],
        id: userstate["user-id"],
        username: userstate.login,
        displayname: userstate["display-name"],
        firstmsg: false,
        color: userstate.color,
        badges: userstate.badges,
      });
    }
  }); //resub

  client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
    let gifts = Object.keys(VTS.gifts);
    for (let index = 0; index < gifts.length; index++) {
      gifts[index] = parseInt(gifts[index]);
    }
    gifts = gifts.sort((a, b) => a - b);
    if (gifts.length > 0) {
      let gifted = parseInt(numbOfSubs, 10);
      let max = 0;
      for (let index = 0; index < gifts.length; index++) {
        if (gifted >= gifts[index]) {
          max = gifts[index];
        }
      }
      triggerHotkey(VTS.gifts[max]);
      log({
        action: userstate["system-msg"],
        id: userstate["user-id"],
        username: userstate.login,
        displayname: userstate["display-name"],
        firstmsg: false,
        color: userstate.color,
        badges: userstate.badges,
      });
    }
  }); //submysterygift

  client.on("anonsubmysterygift", (channel, numbOfSubs, methods, userstate) => {
    let gifts = Object.keys(VTS.gifts);
    for (let index = 0; index < gifts.length; index++) {
      gifts[index] = parseInt(gifts[index]);
    }
    gifts = gifts.sort((a, b) => a - b);
    if (gifts.length > 0) {
      let gifted = parseInt(numbOfSubs, 10);
      let max = 0;
      for (let index = 0; index < gifts.length; index++) {
        if (gifted >= gifts[index]) {
          max = gifts[index];
        }
      }
      triggerHotkey(VTS.gifts[max]);
      log({
        action: userstate["system-msg"],
        id: userstate["user-id"],
        username: userstate.login,
        displayname: userstate["display-name"],
        firstmsg: false,
        color: userstate.color,
        badges: userstate.badges,
      });
    }
  }); //anonsubmysterygift

  // client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
  //   console.log(methods);
  //   console.log(userstate);
  //   console.log(userstate["msg-param-sender-count"]);
  // });

  // client.on("anonsubgift", (channel, streakMonths, recipient, methods, userstate) => {
  //   console.log(methods);
  //   console.log(userstate);
  //   console.log(userstate["msg-param-sender-count"]);
  // });

  client.on("cheer", (channel, userstate, message) => {
    let bits = Object.keys(VTS.bits);
    for (let index = 0; index < bits.length; index++) {
      bits[index] = parseInt(bits[index]);
    }
    bits = bits.sort((a, b) => a - b);

    if (bits.length > 0) {
      let cheered = parseInt(userstate.bits, 10);
      let max = 0;
      for (let index = 0; index < bits.length; index++) {
        if (cheered >= bits[index]) {
          max = bits[index];
        }
      }
      triggerHotkey(VTS.bits[max]);
      log({
        action: `Cheered ${userstate.bits} ${userstate.bits == 1 ? "bit" : "bits"}`,
        id: userstate["user-id"],
        username: userstate.username,
        displayname: userstate["display-name"],
        firstmsg: userstate["first-msg"],
        color: userstate.color,
        badges: userstate.badges,
      });
    }
  }); //cheer
} //connectTwitch

async function readYTChat(page = null) {
  if (!YT_STREAM_ID || !YT_CHAT_ID) {
    console.log("no stream selected");
    return;
  }
  if (!VTS.access_token) {
    console.log("not authorized");
    return;
  }

  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${VTS.access_token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  try {
    let response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/liveChat/messages?key=${API_KEY_YT}&liveChatId=${YT_CHAT_ID}&part=id,snippet,authorDetails&maxResults=2000${
        page ? "&pageToken=" + page : ""
      }`,
      requestOptions
    );
    let result = await response.json();
    if (result.error) {
      loadYTStreams(true);
      showToast("failed to fetch new chat messages", "danger", 5000);
      return;
    }
    if (result.offlineAt) {
      elements.youtubeModalTitle.innerHTML = "Stream ended";
      elements.youtubeModalBody.innerHTML = "Refresh if you did not go offline";
      youtubeModal.show();
      return;
    }
    if (result.items?.length > 0 && page) {
      for (let index = 0, j = result.items.length; index < j; index++) {
        //console.log(result.items[index].snippet.type);
        if (result.items[index].snippet.type == "chatEndedEvent") {
          elements.youtubeModalTitle.innerHTML = "Stream ended";
          elements.youtubeModalBody.innerHTML = "Refresh if you did not go offline";
          youtubeModal.show();
          return;
        }
        // if (result.items[index].snippet.type == "newSponsorEvent") {
        // }
        // if (result.items[index].snippet.type == "memberMilestoneChatEvent") {
        // }
        // if (result.items[index].snippet.type == "superChatEvent") {
        // }
        // if (result.items[index].snippet.type == "superStickerEvent") {
        // }
        // if (result.items[index].snippet.type == "membershipGiftingEvent ") {
        // }

        if (result.items[index].snippet.type == "textMessageEvent") {
          let input = result.items[index].snippet.textMessageDetails.messageText.split(" ").filter(Boolean);
          let command = input[0].toLowerCase();
          if (VTS.commands[command]) {
            if ((Date.now() - cooldowns.global) / 1000 < VTS.commandCooldownGlobal) {
              continue;
            }
            if (cooldowns[command] && (Date.now() - cooldowns[command]) / 1000 < VTS.commands[command].cooldown) {
              continue;
            }
            cooldowns[VTS.commands[command].command] = Date.now();
            cooldowns.global = Date.now();
            triggerHotkey(VTS.commands[command]);
            logYT({
              action: `Used command: "${command}"`,
              username: result.items[index].authorDetails.displayName,
              channelUrl: result.items[index].authorDetails.channelUrl,
              isChatModerator: result.items[index].authorDetails.isChatModerator,
              isChatOwner: result.items[index].authorDetails.isChatOwner,
              isChatSponsor: result.items[index].authorDetails.isChatSponsor,
              isVerified: result.items[index].authorDetails.isVerified,
              profileImageUrl: result.items[index].authorDetails.profileImageUrl,
            });
          }
        }
      }
    }

    readChatTimeout = setTimeout(() => {
      readYTChat(result.nextPageToken);
    }, result.pollingIntervalMillis);
  } catch (error) {
    console.log("readYTChat error", error);
  }
} //readYTChat

function log(user) {
  let name = user.username == user.displayname.toLowerCase() ? `${user.displayname}` : `${user.displayname} (${user.username})`;
  let color = !user.color ? "#FFFFFF" : user.color;
  let badges = "";
  if (user.badges && Object.keys(user.badges).length > 0) {
    badges = addBadges(user.badges, user.id, user.firstmsg);
  }
  if (elements.logs.innerHTML.trim() == "nothing here :)") {
    elements.logs.innerHTML = "";
  }
  elements.logs.innerHTML =
    `<li class="list-group-item">${new Date().toLocaleTimeString()} ${badges}<span style="color:${color};"> ${name}</span>: ${user.action}</li>` + elements.logs.innerHTML;
} //log

function logYT(user) {
  if (elements.logs.innerHTML.trim() == "nothing here :)") {
    elements.logs.innerHTML = "";
  }
  let pfp = `<img src="${user.profileImageUrl}" class="ytpfp" alt="profile picture" height="24" width="24">`;
  elements.logs.innerHTML =
    `<li class="list-group-item">${new Date().toLocaleTimeString()} ${pfp} <a target="_blank" rel="noopener noreferrer" href="${user.channelUrl}">${user.username}</a>: ${user.action}</li>` +
    elements.logs.innerHTML;
} //log

function load_localStorage() {
  if (localStorage.getItem("VTS")) {
    VTS = JSON.parse(localStorage.getItem("VTS"));
    elements.commandCooldownGlobal.value = VTS.commandCooldownGlobal ?? 0;
    elements.hideDefault.checked = VTS.hideDefault ?? true;
    elements.port.value = VTS.port || 8001;
    if (VTS.platform == "youtube") {
      hideTwitchSettings();
    }
    //console.log(VTS);
  } else {
    console.log("VTS localStorage not found");
  }
} //load_localStorage

function hideTwitchSettings() {
  elements.createChannelPointsButton.style.display = "none";
  elements.addSubAlert.style.display = "none";
  elements.addGiftedSubAlert.style.display = "none";
  elements.addBitsAlert.style.display = "none";

  elements.rewardsList.style.display = "none";
  elements.subsList.style.display = "none";
  elements.giftsList.style.display = "none";
  elements.bitsList.style.display = "none";
  elements.rewardsListHeader.style.display = "none";
  elements.subsListHeader.style.display = "none";
  elements.giftsListHeader.style.display = "none";
  elements.bitsListHeader.style.display = "none";
} //hideTwitchSettings

function refreshData() {
  darkTheme = elements.darkTheme.checked ?? true;

  VTS.commandCooldownGlobal = parseInt(elements.commandCooldownGlobal.value, 10) || 0;
  if (VTS.commandCooldownGlobal > 3600 || VTS.commandCooldownGlobal < 0) {
    VTS.commandCooldownGlobal = 0;
  }
  VTS.hideDefault = elements.hideDefault.checked;
  VTS.port = parseInt(elements.port.value, 10) || 8001;
} //refreshData

function saveSettings() {
  refreshData();
  //console.log(VTS);
  localStorage.setItem("VTS", JSON.stringify(VTS));
  localStorage.setItem("darkTheme", darkTheme);
} //saveSettings

async function loadAndConnect() {
  load_localStorage();
  if (VTS.access_token && VTS.channel && VTS.platform == "twitch" && !(await checkToken(VTS.access_token))) {
    VTS.channel = "";
    loginExpiredModal.show();
    return;
  }
  loadLists();
  if (VTS.channel || VTS.access_token) {
    if (VTS.platform == "twitch") {
      connectTwitch();
      PubSubconnect();
      setTimeout(() => {
        PubSublisten();
      }, 2000);
    }
    if (VTS.platform == "youtube") {
      loadYTPFP();
    }
  }
  if (VTS.token) {
    setTimeout(() => {
      connectVTS();
    }, 1000);
  }
} //loadAndConnect

function resetSettings() {
  localStorage.setItem(
    "VTS",
    JSON.stringify({
      userID: "",
      channel: "",
      access_token: "",
      refresh_token: "",
      token: "",
      port: 8001,
      platform: "",
      commandCooldownGlobal: 0,
      hideDefault: true,
      commands: {},
      rewards: {},
      subs: {},
      gifts: {},
      bits: {},
    })
  );
  if (apiClient?.isConnected) {
    apiClient.disconnect();
  }
  location.reload();
} //resetSettings

function exportBackup() {
  if (!checkLogin()) {
    return;
  }
  let temp = structuredClone(VTS);
  delete temp.access_token;
  delete temp.channel;
  delete temp.commandCooldownGlobal;
  delete temp.hideDefault;
  delete temp.platform;
  delete temp.refresh_token;
  delete temp.token;
  delete temp.userID;
  const filename = "chatvote vts backup.json";
  const jsonStr = JSON.stringify(temp);
  let element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
} //exportBackup

function importBackup() {
  let file = elements.backupInput.files[0];

  if (!file) {
    showToast("No file provided", "warning", 3000);
    return;
  }

  if (file.type !== "application/json") {
    showToast("Invalid file provided", "warning", 3000);
    return;
  }

  let reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(file);

  function onReaderLoad(event) {
    let obj = JSON.parse(event.target.result);
    if (!obj.hasOwnProperty("commands") || !obj.hasOwnProperty("rewards") || !obj.hasOwnProperty("subs") || !obj.hasOwnProperty("gifts") || !obj.hasOwnProperty("bits")) {
      showToast("Invalid file provided", "warning", 3000);
      return;
    }

    VTS.commands = structuredClone(obj.commands);
    VTS.rewards = structuredClone(obj.rewards);
    VTS.subs = structuredClone(obj.subs);
    VTS.gifts = structuredClone(obj.gifts);
    VTS.bits = structuredClone(obj.bits);
    saveSettings();
    showToast("Successfully restored settings from backup, reloading page...", "success", 3000);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }
} //importBackup

function PubSubheartbeat() {
  let message = {
    type: "PING",
  };
  PubSub.send(JSON.stringify(message));
} //PubSubheartbeat

function PubSublisten() {
  let message = {
    type: "LISTEN",
    data: {
      topics: [`channel-points-channel-v1.${VTS.userID}`],
      auth_token: VTS.access_token,
    },
  };
  //console.log(`PubSublisten: ${JSON.stringify(message)}`);
  PubSub.send(JSON.stringify(message));
} //PubSublisten

function PubSubconnect() {
  let heartbeatInterval = 1000 * 60; //ms between PINGs
  let reconnectInterval = 1000 * 3; //ms to wait before reconnect
  let heartbeatHandle;

  PubSub = new WebSocket("wss://pubsub-edge.twitch.tv");

  PubSub.onopen = function (event) {
    console.log("PubSub Socket Opened");
    PubSubheartbeat();
    heartbeatHandle = setInterval(PubSubheartbeat, heartbeatInterval);
  };

  PubSub.onerror = function (error) {
    console.log(`PubSub.onerror: ${JSON.stringify(error)}`);
  };

  PubSub.onmessage = function (event) {
    let message = JSON.parse(event.data);
    //console.log(`PubSub.onmessage: ${JSON.stringify(message)}`);
    if (message.type == "RECONNECT") {
      console.log("PubSub Reconnecting...");
      setTimeout(PubSubconnect, reconnectInterval);
    }
    if (message.data) {
      let data = JSON.parse(message.data.message);
      let rewardID = data.data.redemption.reward.id;
      let rewardtitle = data.data.redemption.reward.title;
      // let rewardColor = data.data.redemption.reward.background_color;
      let rewardImage = `<img src="${data.data.redemption.reward.default_image.url_1x}" alt="reward image" style="height:1.2em;">`;
      if (data.data.redemption.reward.image) {
        rewardImage = `<img src="${data.data.redemption.reward.image.url_1x}" alt="reward image" style="height:1.2em;">`;
      }
      let redeemerId = data.data.redemption.user.id;
      let redeemerLogin = data.data.redemption.user.login;
      let redeemerDisplayName = data.data.redemption.user.display_name;
      let userInput = "";
      if (data.data.redemption.user_input) {
        userInput = data.data.redemption.user_input;
      }
      if (!VTS.rewards) {
        return;
      }
      if (VTS.rewards[rewardID]) {
        triggerHotkey(VTS.rewards[rewardID]);
        log({
          action: `Redeemed ${rewardtitle} ${rewardImage} ${userInput ? "| Message: " + userInput + '"' : ""} | ${data.data.redemption.reward.cost.toLocaleString()} ${
            data.data.redemption.reward.cost == 1 ? "point" : "points"
          }`,
          id: redeemerId,
          username: redeemerLogin,
          displayname: redeemerDisplayName,
          firstmsg: null,
          color: null,
          badges: null,
        });
      }
    }
  }; //onmessage

  PubSub.onclose = function () {
    console.log("PubSub Socket Closed");
    clearInterval(heartbeatHandle);
    console.log("PubSub Reconnecting...");
    setTimeout(PubSubconnect, reconnectInterval);
  };
} //PubSubconnect

function switchTheme(checkbox) {
  document.documentElement.setAttribute("data-bs-theme", checkbox ? "dark" : "light");
  document.getElementById("twitchLogo").style.filter = `invert(${checkbox ? 0.25 : 0.65})`;
  if (document.getElementById("btnGroupDrop1") && document.getElementById("btnGroupDrop2")) {
    document.getElementById("btnGroupDrop1").classList.remove(`${checkbox ? "btn-secondary" : "btn-dark"}`);
    document.getElementById("btnGroupDrop1").classList.add(`${checkbox ? "btn-dark" : "btn-secondary"}`);
    document.getElementById("btnGroupDrop2").classList.remove(`${checkbox ? "btn-secondary" : "btn-dark"}`);
    document.getElementById("btnGroupDrop2").classList.add(`${checkbox ? "btn-dark" : "btn-secondary"}`);
  }

  if (document.getElementById("btnGroupDropYTlogin") && document.getElementById("btnGroupDropYTlogin2")) {
    document.getElementById("btnGroupDropYTlogin").classList.remove(`${checkbox ? "btn-secondary" : "btn-dark"}`);
    document.getElementById("btnGroupDropYTlogin").classList.add(`${checkbox ? "btn-dark" : "btn-secondary"}`);
    document.getElementById("btnGroupDropYTlogin2").classList.remove(`${checkbox ? "btn-secondary" : "btn-dark"}`);
    document.getElementById("btnGroupDropYTlogin2").classList.add(`${checkbox ? "btn-dark" : "btn-secondary"}`);
  }
} //switchTheme

window.onload = function () {
  darkTheme = (localStorage.getItem("darkTheme") || "true") === "true";
  elements.darkTheme.checked = darkTheme ?? true;
  switchTheme(elements.darkTheme.checked);

  loadAndConnect();

  connectVTSModal = new bootstrap.Modal(elements.connectVTSModal);
  resetModal = new bootstrap.Modal(elements.resetModal);
  addCommandModal = new bootstrap.Modal(elements.addCommandModal);
  addExistingRewardModal = new bootstrap.Modal(elements.addExistingRewardModal);
  createNewRewardModal = new bootstrap.Modal(elements.createNewRewardModal);
  editCommandModal = new bootstrap.Modal(elements.editCommandModal);
  editRewardModal = new bootstrap.Modal(elements.editRewardModal);
  confirmDeletionModal = new bootstrap.Modal(elements.confirmDeletionModal);
  loginExpiredModal = new bootstrap.Modal(elements.loginExpiredModal);
  addSubAlertModal = new bootstrap.Modal(elements.addSubAlertModal);
  editSubAlertModal = new bootstrap.Modal(elements.editSubAlertModal);
  addGiftedSubAlertModal = new bootstrap.Modal(elements.addGiftedSubAlertModal);
  editGiftedSubAlertModal = new bootstrap.Modal(elements.editGiftedSubAlertModal);
  addBitsAlertModal = new bootstrap.Modal(elements.addBitsAlertModal);
  editBitsAlertModal = new bootstrap.Modal(elements.editBitsAlertModal);
  addRewardModal = new bootstrap.Modal(elements.addRewardModal);
  youtubeModal = new bootstrap.Modal(elements.youtubeModal);

  if (!VTS.channel) {
    loginButton = new bootstrap.Popover(document.getElementById("loginButton"));
  }

  enableTooltips();
  enablePopovers();

  elements.darkTheme.onchange = function () {
    switchTheme(this.checked);
    saveSettings();
  };
}; //onload
