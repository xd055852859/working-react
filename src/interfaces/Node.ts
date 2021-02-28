export default interface Node {
  creator?: string;
  _key: string;
  name: string;
  father: string;
  sortList: string[];
  // 是否收起子节点
  contract?: boolean;
  // 是否已歸檔
  isPack?: boolean;
  isEBook?: boolean;
  checked?: boolean;
  hasCollect?: boolean;
  hour?: number;
  limitDay?: number;
  avatarUri?: string;
  autoLoginPath?: string;
  editorPath?: string;
  uri?: string;
  url?: string;
  icon?: string;
  updateTime?: number;
  editors?: { userKey: string; userName: string; userAvatar: string }[];
  shareIn?: boolean;
  readOnly?: boolean;
  // 以下为计算属性
  x?: number;
  y?: number;
  last_child_y?: number;
  width?: number;
  // 以下为timeOA特定属性
  type?: string;
  appKey?: string;
}
