export interface UserState {
  currentUser: {
    profile: any;
    name: string;
    id: string;
    token: string;
    phone: string;
    email: string;
  } | null;
  isFetching: boolean;
  isError: boolean;
}