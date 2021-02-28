export default interface Notification {
  _key: string;
  type: string;
  time: number;
  nodeKey: string;
  fromUser: string;
  fromUserName: string;
  fromUserAvatar: string;
  log: string;
  status:number;
}
