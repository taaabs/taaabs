export interface LocalDataStore {
  auth_data?: {
    access_token: string;
    refresh_token: string;
    encryption_key: Uint8Array;
  };
  theme?: 'light' | 'dark';
  use_custom_new_tab?: boolean;
  open_chatbot_in_new_tab?: boolean;
}