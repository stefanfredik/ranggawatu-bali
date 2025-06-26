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

export const users: User[] = [
  { id: '1', name: 'Administrator', email: 'admin@example.com', role: 'admin', avatar: 'https://placehold.co/100x100.png', birthDate: '1990-05-15' },
  { id: '2', name: 'Budi Doremi', email: 'budi@example.com', role: 'member', avatar: 'https://placehold.co/100x100.png', birthDate: '1992-08-22' },
  { id: '3', name: 'Citra Kirana', email: 'citra@example.com', role: 'member', avatar: 'https://placehold.co/100x100.png', birthDate: new Date().toISOString().split('T')[0] },
  { id: '4', name: 'Dewi Lestari', email: 'dewi@example.com', role: 'member', avatar: 'https://placehold.co/100x100.png', birthDate: '1988-11-10' },
  { id: '5', name: 'Eka Kurniawan', email: 'eka@example.com', role: 'member', avatar: 'https://placehold.co/100x100.png', birthDate: '1995-03-30' },
];

export const events: Event[] = [
  {
    id: '1',
    title: 'Monthly General Meeting',
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    description: 'Discussion of quarterly progress and planning for the next period. All members are required to attend.',
    author: 'Administrator'
  },
  {
    id: '2',
    title: 'Team Building Workshop',
    date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
    description: 'A fun workshop to improve teamwork and collaboration. Don\'t miss out on the exciting games and activities!',
    author: 'Administrator'
  },
  {
    id: '3',
    title: 'Charity Drive for Local Orphanage',
    date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    description: 'Annual charity drive. We will be collecting donations of clothes, books, and toys.',
    author: 'Administrator'
  },
];

export const announcements: Announcement[] = [
  {
    id: '1',
    title: 'New Policy on Office Hours',
    content: 'Starting next month, the official office hours will be from 9:00 AM to 5:00 PM, Monday to Friday. Please plan your schedules accordingly.',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    author: 'Administrator'
  },
  {
    id: '2',
    title: 'Holiday Schedule Announcement',
    content: 'The office will be closed on the 25th of this month for a national holiday. We will resume operations on the 26th.',
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    author: 'Administrator'
  },
];

export const loggedInUser = users[0]; // Assuming Admin is logged in
