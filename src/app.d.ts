// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import "unplugin-icons/types/svelte";

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare global {
  namespace Twitch {
    export class Embed {
      [x: string]: any;
      constructor(divId: string, options: TwitchEmbedOptions);
    }
  }
}

export {};
