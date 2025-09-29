import { browser } from "$app/environment";

/** @type {*} */
const defaultSettings = {
  USER: {
    channel: "",
    twitchLogin: false,
    access_token: "",
    userID: "",
    platform: "",
  },
  CHATVOTE: {
    chartType: "bar",
    sortChart: false,
    showChat: false,
    multiChoice: false,
    allowChange: false,
    subMode: false,
    questionHidden: false,
    suggestion_prefix: "!suggest",
    votingMode: "numbers",
    confettiLevel: 0,
    suggestionLimitUser: 1,
    suggestionLimit: 0,
    timerValueMinutes: 0,
    refreshWarningEnabled: false,
    linkPreviewThumbnailsEnabled: false,
  },
  RAFFLES: {
    raffleCommand: "!join",
    removeWinner: true,
    allowPlebs: true,
    allowFollowers: true,
    allowSubs: true,
    allowTier1: true,
    allowTier2: true,
    allowTier3: true,
    allowMods: true,
    allowVips: true,
    allowFirstTimeChatters: true,
    plebBonus: 0,
    followerBonus: 0,
    subBonus: 0,
    tier1Bonus: 0,
    tier2Bonus: 0,
    tier3Bonus: 0,
    modBonus: 0,
    vipBonus: 0,
    firstTimeChatterBonus: 0,
    followAge: 0,
    followAgeUnit: "min",
    subAge: 0,
    tier1SubAge: 0,
    tier2SubAge: 0,
    tier3SubAge: 0,
    splitTiers: false,
    animateDrawing: true,
    useTwitchPFP: false,
    autoRerollEnabled: false,
    rerollTimerValueMinutes: 0,
    extraTimerEnabled: false,
    announceWinner: false,
    confirmJoin: false,
    linkPreviewThumbnailsEnabled: false,
    refreshWarningEnabled: false,
  },
  PLAYLIST: {
    autoplay: true,
    allowSpotifySongs: true,
    allowStreamable: true,
    allowTwitchClips: true,
    allowTwitchStreams: true,
    allowTwitchVODs: true,
    allowTiktokVideos: true,
    allowYTStreams: true,
    allowYTShorts: true,
    allowYTVideos: true,
    allowVimeoVideos: true,
    maxDuration: "",
    maxDurationUnit: "m",
    maxLength: "",
    maxSize: "",
    minViewCount: "",
    minUploadAge: "",
    minUploadAgeUnit: "h",
    maxUploadAge: "",
    maxUploadAgeUnit: "h",
    uniqueOnly: false,
    allowPlebs: true,
    allowSubs: true,
    allowMods: true,
    allowVips: true,
    allowFirstTimeChatters: true,
    plebLimit: "",
    subLimit: "",
    modLimit: "",
    vipLimit: "",
    firstTimeChatterLimit: "",
    noCommand: false,
    requestCommand: "!request",
    requestCommandAlias: "!r",
    allowVoteSkip: false,
    voteskipCommand: "!voteskip",
    voteskipCommandAlias: "!vs",
    voteskipCount: 100,
    enableBot: false,
    botCooldown: 1,
    songCommand: "!song",
    songCommandAlias: "!video",
    playlistCommand: "!playlist",
    playlistCommandAlias: "!pl",
    approvalQueue: false,
    openCommand: "!open",
    closeCommand: "!close",
    playCommand: "!play",
    pauseCommand: "!pause",
    autoplayCommand: "!autoplay",
    skipCommand: "!skip",
    rewindCommand: "!rewind",
    deleteCommand: "!delete",
    modCommands: true,
    enableFavorites: false,
  },
};

export class DonkStorage {
  value = $state();
  key = "";

  /**
   * @param {string} key
   * @param {any} value
   */
  constructor(key, value) {
    this.key = key;
    this.value = value;

    if (browser) {
      const item = localStorage.getItem(key);
      if (item) {
        this.value = JSON.parse(item);
      } else {
        this.value = defaultSettings[key];
      }
    }

    $effect(() => {
      localStorage.setItem(this.key, JSON.stringify(this.value));
    });
  }
}

/**
 * @param {string} key
 * @param {any} value
 */
export function donkStorage(key, value) {
  return new DonkStorage(key, value);
}
