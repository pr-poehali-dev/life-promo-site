export interface User {
  id: string;
  username: string;
  phone?: string;
  email?: string;
  telegram?: string;
  avatar: string;
  registeredAt: string;
  lastLogin: string;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface AuthData {
  users: User[];
  currentUser: User | null;
  messages: Message[];
}

export const AVATARS = {
  male: [
    '👨‍💼', '👨‍🔧', '👨‍🎨', '👨‍💻', '👨‍🚀', '👨‍⚕️', '👨‍🏫', '👨‍🎤',
    '🧑‍💼', '🧑‍🔧', '🧑‍🎨', '🧑‍💻', '🧑‍🚀', '🧑‍⚕️', '🧑‍🏫', '🧑‍🎤'
  ],
  female: [
    '👩‍💼', '👩‍🔧', '👩‍🎨', '👩‍💻', '👩‍🚀', '👩‍⚕️', '👩‍🏫', '👩‍🎤',
    '👱‍♀️', '👩‍🦰', '👩‍🦱', '👩‍🦳', '👩', '🧕', '👸', '👰‍♀️'
  ]
};
