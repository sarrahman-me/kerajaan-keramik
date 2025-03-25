export interface IUser {
  username?: string;
  password?: string;
  permissions?: {
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  updatedAt?: Date
}
