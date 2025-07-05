export interface UserState {
  currentUser: {
    profile: any;
    name: string;
    id: string;
    phone: string;
    email: string;
    role: string;
    token: string;
  } | null;
  isFetching: boolean;
  isError: boolean;
}