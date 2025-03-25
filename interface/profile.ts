export interface IPermissions {
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export interface IProfileData {
  username: string;
  permissions: IPermissions,
  iat: number;
  exp: number;
}
