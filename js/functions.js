let GETrequestOptions = {
  method: "GET",
  redirect: "follow",
};

async function get7TVPFP(userID) {
  if (!userID) {
    return "/pics/donk.png";
  }
  return new Promise(async function (resolve, reject) {
    try {
      let response = await fetch(`https://7tv.io/v3/users/twitch/${userID}`, GETrequestOptions);
      let result = await response.json();
      if (!result?.user?.avatar_url) {
        resolve("/pics/donk.png");
      } else {
        resolve(result.user.avatar_url);
      }
    } catch (error) {
      resolve("/pics/donk.png");
      console.log("getprofilepic 7tv error", error);
    }
  });
} //get7TVPFP

async function getTwitchPFP(username, access_token) {
  let myHeaders = new Headers();
  myHeaders.append("client-id", CLIENT_ID);
  myHeaders.append("Authorization", `Bearer ${access_token}`);
  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  return new Promise(async function (resolve, reject) {
    try {
      let response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, requestOptions);
      let result = await response.json();
      resolve(result.data[0].profile_image_url);
    } catch (error) {
      resolve("/pics/donk.png");
      console.log("getprofilepic twitch error", error);
    }
  });
} //getTwitchPFP

async function getGlobalTwitchEmotes(largeEmotes = false) {
  let emotes = [];
  try {
    let response1 = await fetch(`https://api.okayeg.com/emotes/global`, GETrequestOptions);
    let globalTwitch = await response1.json();
    let filter = [
      "R-)",
      ";-p",
      ";p",
      ";-P",
      ":-p",
      ":p",
      ":-P",
      ";-)",
      ":-\\",
      ":\\",
      ":-/",
      ":-o",
      ":o",
      ":-O",
      "8-)",
      "B-)",
      "o.o",
      "o_o",
      "o.O",
      "o_O",
      "O.O",
      "O_O",
      "O.o",
      ":-Z",
      ":Z",
      ":-z",
      ":z",
      ":-|",
      ":-D",
      ":-(",
      ":-)",
    ];
    for (let i = 0, j = globalTwitch.data.length; i < j; i++) {
      if (filter.includes(globalTwitch.data[i].name)) {
        continue;
      }
      emotes.push({ name: globalTwitch.data[i].name, url: globalTwitch.data[i].images[largeEmotes ? "url_4x" : "url_1x"] });
    }
    return emotes;
  } catch (error) {
    console.log("getGlobalTwitchEmotes error", error);
    return [];
  }
} //getGlobalTwitchEmotes

async function getGlobalBTTVEmotes(largeEmotes = false) {
  let emotes = [];
  let zerowidth = ["SoSnowy", "IceCold", "SantaHat", "TopHat", "ReinDeer", "CandyCane", "cvMask", "cvHazmat"];
  try {
    let response1 = await fetch(`https://api.betterttv.net/3/cached/emotes/global`, GETrequestOptions);
    let globalBTTV = await response1.json();
    for (let i = 0, j = globalBTTV.length; i < j; i++) {
      emotes.push({ name: globalBTTV[i].code, url: `https://cdn.betterttv.net/emote/${globalBTTV[i].id}/${largeEmotes ? "3x" : "1x"}`, zerowidth: zerowidth.includes(globalBTTV[i].code) });
    }
    return emotes;
  } catch (error) {
    console.log("getGlobalBTTVEmotes error", error);
    return [];
  }
} //getGlobalBTTVEmotes

async function getGlobalFFZEmotes(largeEmotes = false) {
  let emotes = [];
  try {
    let response2 = await fetch(`https://api.frankerfacez.com/v1/set/global`, GETrequestOptions);
    let globalFFZ = await response2.json();
    for (let index = 0; index < globalFFZ.default_sets.length; index++) {
      let set = globalFFZ.default_sets[index];
      for (let i = 0, j = globalFFZ.sets[set].emoticons.length; i < j; i++) {
        let emote = globalFFZ.sets[set].emoticons[i];
        let url = emote.urls[largeEmotes ? "4" : "1"];
        if (emote.animated) {
          url = emote.animated[largeEmotes ? "4" : "1"];
        }
        emotes.push({ name: emote.name, url: url, zerowidth: false });
      }
    }
    return emotes;
  } catch (error) {
    console.log("getGlobalFFZEmotes error", error);
    return [];
  }
} //getGlobalFFZEmotes

async function getGlobal7TVEmotes(largeEmotes = false) {
  let emotes = [];
  try {
    let response3 = await fetch(`https://7tv.io/v3/emote-sets/global`, GETrequestOptions);
    let global7TV = await response3.json();
    for (let i = 0, j = global7TV.emotes.length; i < j; i++) {
      let files = global7TV.emotes[i].data.host.files.filter((e) => e.format == "AVIF");
      emotes.push({
        name: global7TV.emotes[i].name,
        url: `${global7TV.emotes[i].data.host.url}/${files[largeEmotes ? 3 : 0].name}`,
        zerowidth: global7TV.emotes[i].flags == 1,
      });
    }
    return emotes;
  } catch (error) {
    console.log("getGlobal7TVEmotes error", error);
    return [];
  }
} //getGlobal7TVEmotes

async function getEmoji() {
  let emoji = [];
  try {
    let response5 = await fetch(`/games/emoji.json`, GETrequestOptions);
    let json = await response5.json();
    for (let i = 0, j = json.length; i < j; i++) {
      emoji.push({ name: json[i].emoji, desc: json[i].description, url: "emoji" });
    }
    return emoji;
  } catch (error) {
    console.log("getEmoji error", error);
    return [];
  }
} //getEmoji

async function getChannelTwitchEmotes(channel, largeEmotes = false) {
  let emotes = [];
  try {
    let response1 = await fetch(`https://api.okayeg.com/emotes?channel=${channel}`, GETrequestOptions);
    let channelTwitch = await response1.json();
    if (channelTwitch.data.id) {
      if (channelTwitch.data.emotes.length > 0) {
        for (let i = 0, j = channelTwitch.data.emotes.length; i < j; i++) {
          emotes.push({
            name: channelTwitch.data.emotes[i].name,
            url: `https://static-cdn.jtvnw.net/emoticons/v2/${channelTwitch.data.emotes[i].id}/default/dark/${largeEmotes ? "3.0" : "1.0"}`,
          });
        }
        return emotes;
      } //twitch
    }
  } catch (error) {
    console.log("getChannelTwitchEmotes error", error);
    return [];
  }
} //getChannelTwitchEmotes

async function getChannelBTTVEmotes(userID, largeEmotes = false) {
  if (!userID) {
    return [];
  }
  let emotes = [];
  try {
    let response1 = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${userID}`, GETrequestOptions);
    let channelBTTV = await response1.json();
    if (response1.status == 200 && channelBTTV?.message != "user not found") {
      for (let i = 0, j = channelBTTV.channelEmotes.length; i < j; i++) {
        emotes.push({ name: channelBTTV.channelEmotes[i].code, url: `https://cdn.betterttv.net/emote/${channelBTTV.channelEmotes[i].id}/${largeEmotes ? "3x" : "1x"}`, zerowidth: false });
      }
      for (let i = 0, j = channelBTTV.sharedEmotes.length; i < j; i++) {
        emotes.push({ name: channelBTTV.sharedEmotes[i].code, url: `https://cdn.betterttv.net/emote/${channelBTTV.sharedEmotes[i].id}/${largeEmotes ? "3x" : "1x"}`, zerowidth: false });
      }
      return emotes;
    } else {
      return [];
    }
  } catch (error) {
    console.log("getChannelBTTVEmotes error", error);
    return [];
  }
} //getChannelBTTVEmotes

async function getChannelFFZEmotes(userID, largeEmotes = false) {
  let emotes = [];
  try {
    let response2 = await fetch(`https://api.frankerfacez.com/v1/room/id/${userID}`, GETrequestOptions);
    let channelFFZ = await response2.json();
    if (channelFFZ.status != 404) {
      let setid = channelFFZ.room.set;
      let sets = channelFFZ.sets[setid];
      for (let i = 0, j = sets.emoticons.length; i < j; i++) {
        let url = sets.emoticons[i].urls[largeEmotes ? "4" : "1"];
        if (sets.emoticons[i].animated) {
          url = sets.emoticons[i].animated[largeEmotes ? "4" : "1"];
        }
        emotes.push({ name: sets.emoticons[i].name, url: url, zerowidth: false });
      }
      return emotes;
    }
  } catch (error) {
    console.log("getChannelFFZEmotes error", error);
    return [];
  }
} //getChannelFFZEmotes

async function getChannel7TVEmotes(userID, largeEmotes = false) {
  if (!userID) {
    return [];
  }
  let emotes = [];
  try {
    let response3 = await fetch(`https://7tv.io/v3/users/twitch/${userID}`, GETrequestOptions);
    let channel7TV = await response3.json();
    for (let i = 0, j = channel7TV.emote_set.emotes.length; i < j; i++) {
      let files = channel7TV.emote_set.emotes[i].data.host.files.filter((e) => e.format == "AVIF");
      emotes.push({
        name: channel7TV.emote_set.emotes[i].name,
        url: `${channel7TV.emote_set.emotes[i].data.host.url}/${files[largeEmotes ? 3 : 0].name}`,
        zerowidth: channel7TV.emote_set.emotes[i].flags == 1,
      });
    }
    return emotes;
  } catch (error) {
    console.log("getChannel7TVEmotes error", error);
    return [];
  }
} //getChannel7TVEmotes

function showToast(msg, type, timeout) {
  let id = Date.now();
  let toast = `<div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert" data-bs-autohide="false" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
      <div class="toast-body" style="font-size:1.2em">${msg}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      </div>`;
  elements.toastContainer.innerHTML += toast;
  let toastElList = [].slice.call(document.querySelectorAll(".toast"));
  let toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl, {
      animation: false,
      autohide: false,
    });
  });
  toastList[toastList.length - 1].show();
  //dismiss this way bcz built in dismiss wont work if there are multiple toasts FeelsDankMan
  setTimeout(function () {
    toastList[toastList.length - 1].hide();
    document.getElementById(id).remove();
  }, timeout);
} //showToast

async function checkTags(userID, access_token) {
  if (!access_token || !userID) {
    return false;
  }
  let myHeaders = new Headers();
  myHeaders.append("client-id", CLIENT_ID);
  myHeaders.append("Authorization", `Bearer ${access_token}`);
  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  return new Promise(async function (resolve, reject) {
    try {
      let response = await fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${userID}`, requestOptions);
      let result = await response.json();
      if (!result.data[0].tags || result.data[0].tags.length == 0) {
        return;
      }
      let taglist = ["브이튜버", "pngtuber", "버튜버", "버츄얼", "vstreamer", "ｖtuber", "live2d"];
      for (let i = 0; i < result.data[0].tags.length; i++) {
        let tag = result.data[0].tags[i].toLowerCase();
        if (tag.includes("vtube")) {
          resolve(true);
        }
        if (taglist.includes(tag)) {
          resolve(true);
        }
      }
      resolve(false);
    } catch (error) {
      resolve(false);
      console.log("checkTags error", error);
    }
  });
} //checkTags

async function getUserID(username) {
  try {
    let response = await fetch(`https://helper.pepega.workers.dev/twitch/users?login=${username}`, GETrequestOptions);
    let result = await response.json();
    return result?.data[0]?.id || "";
  } catch (error) {
    return "";
  }
} //getUserID

async function sendUsername(site, channel, platform, stream = null) {
  let body = JSON.stringify({ site: site, channel: channel, platform: platform, stream: stream });
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://helper.pepega.workers.dev/log/username`, requestOptions);
    console.log("sendUsername response", response.status);
  } catch (error) {
    console.log("sendUsername error", error);
  }
} //sendUsername

async function sendData(site, channel, platform, data, stream = null) {
  if (!channel) {
    return;
  }
  let body = JSON.stringify({
    site: site,
    channel: channel,
    platform: platform,
    data: data,
    stream: stream,
  });
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://helper.pepega.workers.dev/log/data`, requestOptions);
    console.log("sendData response", response.status);
  } catch (error) {
    console.log("sendData error", error);
  }
} //sendData

function showConfetti(level) {
  let c, s, d;
  switch (parseInt(level, 10)) {
    case 1:
      c = 100;
      s = 1;
      d = 1000;
      break;
    case 2:
      c = 500;
      s = 2;
      d = 2000;
      break;
    case 3:
      c = 1000;
      s = 3;
      d = 3000;
      break;
    case 4:
      c = 10000;
      s = 5;
      d = 5000;
      break;
    default:
      return;
  }
  confetti.maxCount = c;
  confetti.speed = s;
  confetti.start(d);
}

async function getChannelBadges(channel) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = await fetch(`https://api.okayeg.com/emotes?channel=${channel}`, GETrequestOptions);
      let result = await response.json();
      if (!result.data.badges || result.data.badges.length == 0) {
        resolve({ subscriber: [], bits: [] });
      }
      let badges = { subscriber: [], bits: [] };
      if (result.data.badges.length > 0) {
        let subBadges = [];
        let bitBadges = [];
        if (result.data.badges[0]) {
          if (result.data.badges[0].set_id == "subscriber") {
            subBadges = result.data.badges[0].versions;
          }
          if (result.data.badges[0].set_id == "bits") {
            bitBadges = result.data.badges[0].versions;
          }
        }
        if (result.data.badges[1]) {
          if (result.data.badges[1].set_id == "subscriber") {
            subBadges = result.data.badges[1].versions;
          }
          if (result.data.badges[1].set_id == "bits") {
            bitBadges = result.data.badges[1].versions;
          }
        }
        for (let index = 0, j = subBadges.length; index < j; index++) {
          badges.subscriber.push({ id: subBadges[index].id, url: subBadges[index].image_url_4x });
        }
        for (let index = 0, j = bitBadges.length; index < j; index++) {
          badges.bits.push({ id: bitBadges[index].id, url: bitBadges[index].image_url_4x });
        }
        resolve(badges);
      }
    } catch (error) {
      console.log("getChannelBadges error", error);
      resolve({ subscriber: [], bits: [] });
    }
  });
} //getChannelBadges

async function getGlobalBadges() {
  return new Promise(async function (resolve, reject) {
    try {
      let response = await fetch(`https://api.okayeg.com/badges/global`, GETrequestOptions);
      let result = await response.json();
      if (!result.data || result.data.length == 0) {
        resolve({});
      }
      if (result.data.length > 0) {
        let badges = {};
        for (let index = 0, j = result.data.length; index < j; index++) {
          badges[result.data[index].set_id] = result.data[index].versions;
        }
        resolve(badges);
      }
    } catch (error) {
      console.log("getGlobalBadges error", error);
      resolve({});
    }
  });
} //getGlobalBadges

async function getCustomBadges() {
  return new Promise(async function (resolve, reject) {
    try {
      let response = await fetch(`https://badges.pepega.workers.dev`, GETrequestOptions);
      let result = await response.json();
      if (!result || result.length == 0) {
        resolve([]);
      }
      resolve(result);
    } catch (error) {
      console.log("getCustomBadges error", error);
      resolve([]);
    }
  });
} //getCustomBadges

function replaceEmotes(input, thirdPartyEmotes) {
  input = input.split(" ");
  if (thirdPartyEmotes.length != 0) {
    for (let i = 0, j = input.length; i < j; i++) {
      for (let index = 0, j = thirdPartyEmotes.length; index < j; index++) {
        if (input[i] == thirdPartyEmotes[index].name) {
          if (thirdPartyEmotes[index].zerowidth) {
            input[i] = `<img title="${thirdPartyEmotes[index].name}" alt="${thirdPartyEmotes[index].name}" src="${thirdPartyEmotes[index].url}" 
            style="height:1.5em; margin-left:${i == 0 ? "0px" : "-24px"}">`;
          } else {
            input[i] = `<img title="${thirdPartyEmotes[index].name}" alt="${thirdPartyEmotes[index].name}" src="${thirdPartyEmotes[index].url}" style="height:1.5em;">`;
          }
        }
      }
    }
  }
  return input.join(" ");
} //replaceEmotes

function changeSiteLinkTarget(target) {
  let links = document.getElementsByClassName("site-link");
  for (let index = 0; index < links.length; index++) {
    links[index].setAttribute("target", target);
  }
} //changeSiteLinkTarget

function switchGame(game) {
  switch (game) {
    case "draw":
      location.href = "/games/draw";
      break;
    case "arena":
      location.href = "/games/arena";
      break;
    case "eb":
      location.href = "/games/emotes";
      break;
    case "dh":
      location.href = "/games/donkhunt";
      break;
    case "shapes":
      location.href = "/games/shapes";
      break;
    case "nim":
      location.href = "/games/nim";
      break;
    case "nw":
      location.href = "/games/wordle";
      break;
    case "c4":
      location.href = "/games/connect4";
      break;
    case "ttt":
      location.href = "/games/tictactoe";
      break;
    case "guessr":
      window.open("https://guessr.tv", "_blank").focus();
      break;
    case "about":
      aboutModal.show();
      break;
    default:
      break;
  }
} //switchGame

async function getLinkInfo(element, allowThumbnails) {
  if (element.getAttribute("data-bs-title") == spinner) {
    let url = element.getAttribute("href");
    if (!url) {
      return;
    }
    url = `LINKPREVIEW${encodeURIComponent(url)}`;
    let tooltip = bootstrap.Tooltip.getInstance(element);
    try {
      let response = await fetch(`https://helper.pepega.workers.dev/cors/?${url}`, GETrequestOptions);
      let result = await response.json();
      if (result?.status != 200 && result?.message) {
        element.setAttribute("data-bs-title", result.message);
        tooltip.setContent({ ".tooltip-inner": result.message });
        return;
      }
      let preview = DOMPurify.sanitize(decodeURIComponent(result.tooltip), { ALLOWED_TAGS: ["div", "li", "br", "b", "span", "hr"] });
      if (result.thumbnail && allowThumbnails) {
        preview = `<img class="previewThumbnail" src="${result.thumbnail}" alt="link preview thumbnail">` + preview;
      }
      element.setAttribute("data-bs-title", preview);
      tooltip.setContent({ ".tooltip-inner": preview });
    } catch (error) {
      element.setAttribute("data-bs-title", "Could not get link preview :(");
      tooltip.setContent({ ".tooltip-inner": "Could not get link preview :(" });
    }
  }
} //getLinkInfo

function linkifyElementID(id, allowThumbnails) {
  linkifyElement(
    document.getElementById(id),
    {
      className: "linktooltip",
      attributes: {
        tabindex: "0",
        rel: "noopener noreferrer",
        target: "_blank",
        role: "button",
        "data-bs-toggle": "tooltip",
        "data-bs-placement": "top",
        "data-bs-container": "body",
        "data-bs-title": spinner,
      },
      formatHref: {
        mention: (href) => "https://twitch.tv" + href,
      },
    },
    document
  );

  const tooltipTriggerList = document.querySelectorAll("a.linktooltip");
  const tooltipList = [...tooltipTriggerList].map(function (tooltipTriggerEl) {
    if (tooltipTriggerEl.getAttribute("data-bs-title") == spinner) {
      tooltipTriggerEl.addEventListener("show.bs.tooltip", function () {
        getLinkInfo(tooltipTriggerEl, allowThumbnails);
      });
    }
    const elements = document.getElementsByClassName("tooltip show");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      animation: false,
      html: true,
      delay: { show: 200, hide: 0 },
    });
  });
} //linkifyElementID

function enableTooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
} //enableTooltips

function enablePopovers() {
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
  const popoverList = [...popoverTriggerList].map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));
} //enablePopovers

async function checkToken(access_token) {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `OAuth ${access_token}`);
  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  return new Promise(async function (resolve, reject) {
    try {
      let response = await fetch("https://id.twitch.tv/oauth2/validate", requestOptions);
      if (!response.ok) {
        resolve(false);
      }
      let result = await response.json();
      if (result.expires_in < 600) {
        resolve(false);
      } else {
        resolve(true);
      }
    } catch (error) {
      console.log("checkToken error", error);
      resolve(false);
    }
  });
} //checkToken

function spamTest(message, count) {
  for (let index = 0; index < count; index++) {
    let username = uuidv4();
    let context = {
      "badge-info": {
        subscriber: "30",
      },
      badges: {
        moderator: "1",
        subscriber: "3030",
        "glhf-pledge": "1",
      },
      color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
      "display-name": username,
      emotes: null,
      "first-msg": false,
      flags: null,
      id: uuidv4(),
      mod: true,
      "returning-chatter": false,
      "room-id": "135944158",
      subscriber: true,
      "tmi-sent-ts": Date.now(),
      turbo: false,
      "user-id": Math.floor(Math.random() * 1000000000).toString(),
      "user-type": "mod",
      "emotes-raw": null,
      "badge-info-raw": "subscriber/30",
      "badges-raw": "moderator/1,subscriber/3030,glhf-pledge/1",
      username: username,
      "message-type": "chat",
    };

    //type, target, context, msg, self
    setTimeout(() => {
      client.emit("message", "#mwwmwwwwmwwwwwwwmwwwwmwww", context, message, false);
    }, 100);
  }
} //spamTest

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
} //uuidv4
