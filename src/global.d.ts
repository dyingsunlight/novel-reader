declare abstract class PlatformService {
  abstract translate(text: string, toLang: string): Promise<string>
}

declare module '*.vue' {
  import Vue from "vue";
  export default Vue;
}
