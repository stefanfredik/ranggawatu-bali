import { db } from './db';
import type { User, Event, Announcement, UserWithUangPangkal, FinancialSummary } from './data.types';

export * from './data.types';

export const UANG_PANGKAL_AMOUNT = 50000;

export async function getUsers(): Promise<User[]> {
    return db.prepare('SELECT * FROM users ORDER BY name ASC').all() as User[];
}

export async function getUserById(id: string): Promise<UserWithUangPangkal | null> {
    const query = `
        SELECT
            u.id, u.name, u.email, u.role, u.avatar, u.birthDate,
            up.amount as uangPangkalAmount,
            up.payment_date as uangPangkalDate
        FROM users u
        LEFT JOIN uang_pangkal up ON u.id = up.user_id
        WHERE u.id = ?
    `;
    const result = db.prepare(query).get(id) as (User & { uangPangkalAmount: number | null; uangPangkalDate: string | null; }) | undefined;
    
    if (!result) {
        return null;
    }

    const isPaid = result.uangPangkalAmount !== null && result.uangPangkalAmount >= UANG_PANGKAL_AMOUNT;
    
    return {
        ...result,
        uangPangkalStatus: isPaid ? 'Lunas' : 'Belum Lunas',
    };
}

export async function getEvents(): Promise<Event[]> {
    return db.prepare('SELECT * FROM events ORDER BY date DESC').all() as Event[];
}

export async function getAnnouncements(): Promise<Announcement[]> {
    return db.prepare('SELECT * FROM announcements ORDER BY date DESC').all() as Announcement[];
}

export async function getLoggedInUser(): Promise<User> {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get('1') as User | undefined;
    if (!user) {
        return { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin', avatar: 'https://placehold.co/100x100.png', birthDate: '1990-05-15' };
    }
    return user;
}

export async function getUsersWithUangPangkalStatus(): Promise<UserWithUangPangkal[]> {
    const query = `
        SELECT
            u.id, u.name, u.email, u.role, u.avatar, u.birthDate,
            up.amount as uangPangkalAmount,
            up.payment_date as uangPangkalDate
        FROM users u
        LEFT JOIN uang_pangkal up ON u.id = up.user_id
        ORDER BY u.name ASC
    `;
    
    const results = db.prepare(query).all() as (User & { uangPangkalAmount: number | null; uangPangkalDate: string | null })[];
    
    return results.map(user => {
        const isPaid = user.uangPangkalAmount !== null && user.uangPangkalAmount >= UANG_PANGKAL_AMOUNT;
        return {
            ...user,
            uangPangkalStatus: isPaid ? 'Lunas' : 'Belum Lunas',
        };
    });
}

export async function getFinancialSummary(): Promise<FinancialSummary> {
    const totalUangPangkalResult = db.prepare('SELECT SUM(amount) as total FROM uang_pangkal').get() as { total: number | null };
    const totalPemasukanLainResult = db.prepare('SELECT SUM(amount) as total FROM pemasukan').get() as { total: number | null };
    const totalPengeluaranResult = db.prepare('SELECT SUM(amount) as total FROM pengeluaran').get() as { total: number | null };

    const totalUangPangkal = totalUangPangkalResult.total || 0;
    const totalPemasukanLain = totalPemasukanLainResult.total || 0;
    
    const totalPemasukan = totalUangPangkal + totalPemasukanLain;
    const totalPengeluaran = totalPengeluaranResult.total || 0;

    const saldoAkhir = totalPemasukan - totalPengeluaran;

    return {
        totalPemasukan,
        totalPengeluaran,
        saldoAkhir,
    };
}
