export type User = {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    avatar: string;
    birthDate: string; // YYYY-MM-DD
  };
  
  export type Event = {
    id: string;
    title: string;
    date: string;
    description: string;
    author: string;
  };
  
  export type Announcement = {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
  };
