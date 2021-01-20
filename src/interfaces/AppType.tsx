export default interface AppType {
  _key: string;
  appKey: string;
  type: string;
  name: string;
  uri: string | null;
  multipliable: boolean;
  iconUri: string;
  docFileIcon?: string | null;
  width: number;
  height: number;
  appHigh?: number;
  // 应用自动登录地址
  autoLoginPath?: string;
  // 是否已安装
  hasAdd?: number;
  // 是否是内置应用
  systematic?: number;
  // 是否固定在dock栏
  isDocked?: number;
  // 不在apps中显示的功能性应用，如分享功能
  hidden?: boolean;
  // 是否默认最大化
  defaultMaximized?: boolean;
  tagNames?: string;
  autostart?: boolean;
  redirectRouter?: string;
  editorPath?: string;
};