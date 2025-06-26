import { db } from './db';
import type { User, Event, Announcement } from './data.types';

export * from './data.types';

export async function getUsers(): Promise<User[]> {
    return db.prepare('SELECT * FROM users ORDER BY name ASC').all() as User[];
}

export async function getUserById(id: string): Promise<User | null> {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
    return user || null;
}

export async function getEvents(): Promise<Event[]> {
    return db.prepare('SELECT * FROM events ORDER BY date DESC').all() as Event[];
}

export async function getAnnouncements(): Promise<Announcement[]> {
    return db.prepare('SELECT * FROM announcements ORDER BY date DESC').all() as Announcement[];
}

export function getLoggedInUserSync(): User {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get('1') as User | undefined;
    if (!user) {
        return { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin', avatar: 'https://placehold.co/100x100.png', birthDate: '1990-05-15' };
    }
    return user;
}

export async function getLoggedInUser(): Promise<User> {
    return getLoggedInUserSync();
}
