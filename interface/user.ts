export interface IUser {
  username: string;
  permissions: {
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}
