export interface ArticleType {
  _key: string;
  name: string;
  type: string;
  url: string;
  shareStatus: number;
  shareTime?: string;
  toUserName?: string;
  toUserAvatar?: string;
  fromUserName?: string;
  fromUserAvatar?: string;
  role: 'admin' | 'edit' | 'author' | 'read';
  iconUri: string;
  icon: string;
  uri: string;
  height: number;
  width: number;
  suffix: string;
  maximized: boolean;
  multipliable: boolean;
  createTime: number;
  updateTime: number;
  linkNode: ArticleType;
  detail: ArticleDetail;
  creator: string;
  way: any[];
  appKey: string;
  thumbnail?: string;
  readOnly?: boolean;
  linkId?: string;
  linkType?: string;
  viewTime?: number;
  isPublic?: boolean;
  editorPath?: string;
}

export interface ArticleDetail {
  rootKey?: string;
  title: string;
  snippet: string;
  cover: string;
  content: string;
}
