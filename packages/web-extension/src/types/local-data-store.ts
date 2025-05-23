export interface LocalDataStore {
  auth_data?: {
    access_token: string;
    refresh_token: string;
    encryption_key: Array<number>;
  };
  open_chatbot_in_new_tab?: boolean;
}