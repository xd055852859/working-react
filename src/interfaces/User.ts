export default interface User {
  _key: string;
  userName: string;
  userAvatar: string;
  mobile: string;
  role: 'admin' | 'edit' | 'author' | 'read';
  canEdit: boolean;
}
