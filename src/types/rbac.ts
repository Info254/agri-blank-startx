export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
}

export interface UserProfile extends User {
  roles: Role[];
  permissions: string[];
}
