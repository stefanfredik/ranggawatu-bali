import { db } from './db';
import type { User, Event, Announcement, UserWithUangPangkal, FinancialSummary, Pemasukan, Pengeluaran, Transaction, UserWithIuranStatus } from './data.types';
import { subMonths } from 'date-fns';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export * from './data.types';

export const UANG_PANGKAL_AMOUNT = 50000;
export const IURAN_BULANAN_AMOUNT = 20000;

export async function getUsers(): Promise<User[]> {
    return db.prepare('SELECT id, name, email, role, avatar, birthDate FROM users ORDER BY name ASC').all() as User[];
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

export async function getUserByEmailForAuth(email: string): Promise<User | null> {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
    return user || null;
}

export async function getEvents(): Promise<Event[]> {
    return db.prepare('SELECT * FROM events ORDER BY date DESC').all() as Event[];
}

export async function getAnnouncements(): Promise<Announcement[]> {
    return db.prepare('SELECT * FROM announcements ORDER BY date DESC').all() as Announcement[];
}

export async function getLoggedInUser(): Promise<User> {
    const sessionId = cookies().get('session')?.value;
    if (!sessionId) {
        redirect('/');
    }

    const user = db.prepare('SELECT id, name, email, role, avatar, birthDate FROM users WHERE id = ?').get(sessionId) as User | undefined;
    
    if (!user) {
        // Cookie might be invalid or user deleted
        cookies().delete('session');
        redirect('/');
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

export async function getUsersWithIuranStatus(month: number, year: number): Promise<UserWithIuranStatus[]> {
    const query = `
        SELECT
            u.id, u.name, u.email, u.role, u.avatar, u.birthDate,
            i.amount as iuranAmount,
            i.payment_date as iuranDate
        FROM users u
        LEFT JOIN iuran_bulanan i ON u.id = i.user_id AND i.month = ? AND i.year = ?
        ORDER BY u.name ASC
    `;
    
    const results = db.prepare(query).all(month, year) as (User & { iuranAmount: number | null; iuranDate: string | null })[];
    
    return results.map(user => {
        const isPaid = user.iuranAmount !== null;
        return {
            ...user,
            iuranStatus: isPaid ? 'Lunas' : 'Belum Lunas',
        };
    });
}

export async function getPemasukan(): Promise<Pemasukan[]> {
    const uangPangkal = db.prepare('SELECT user_id as description, amount, payment_date as date FROM uang_pangkal').all() as any[];
    const pemasukanLain = db.prepare('SELECT * FROM pemasukan').all() as Pemasukan[];

    const allPemasukan = [
        ...uangPangkal.map(up => ({ ...up, description: `Uang Pangkal - Anggota ID ${up.description}`})),
        ...pemasukanLain
    ];

    allPemasukan.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return allPemasukan as Pemasukan[];
}

export async function getPemasukanById(id: number): Promise<Pemasukan | null> {
    const pemasukan = db.prepare('SELECT * FROM pemasukan WHERE id = ?').get(id) as Pemasukan | undefined;
    return pemasukan || null;
}

export async function getPengeluaran(): Promise<Pengeluaran[]> {
    return db.prepare('SELECT * FROM pengeluaran ORDER BY date DESC').all() as Pengeluaran[];
}

export async function getPengeluaranById(id: number): Promise<Pengeluaran | null> {
    const pengeluaran = db.prepare('SELECT * FROM pengeluaran WHERE id = ?').get(id) as Pengeluaran | undefined;
    return pengeluaran || null;
}

export async function getFinancialSummary(): Promise<FinancialSummary> {
    const totalUangPangkalResult = db.prepare('SELECT SUM(amount) as total FROM uang_pangkal').get() as { total: number | null };
    const iuranBulananResult = db.prepare('SELECT SUM(amount) as total FROM iuran_bulanan').get() as { total: number | null };
    const totalPemasukanLainResult = db.prepare('SELECT SUM(amount) as total FROM pemasukan').get() as { total: number | null };
    const totalPengeluaranResult = db.prepare('SELECT SUM(amount) as total FROM pengeluaran').get() as { total: number | null };

    const totalUangPangkal = totalUangPangkalResult.total || 0;
    const totalIuranBulanan = iuranBulananResult.total || 0;
    const totalPemasukanLain = totalPemasukanLainResult.total || 0;
    
    const totalPemasukan = totalUangPangkal + totalIuranBulanan + totalPemasukanLain;
    const totalPengeluaran = totalPengeluaranResult.total || 0;

    const saldoAkhir = totalPemasukan - totalPengeluaran;

    return {
        totalPemasukan,
        totalPengeluaran,
        saldoAkhir,
        totalUangPangkal,
        totalIuranBulanan,
        totalPemasukanLain,
    };
}

export async function getRecentTransactions(): Promise<Transaction[]> {
    const oneMonthAgo = subMonths(new Date(), 1);
    const oneMonthAgoDateString = oneMonthAgo.toISOString().split('T')[0];
    
    const MONTHS = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const pemasukanList = db.prepare('SELECT id, description, amount, date FROM pemasukan WHERE date >= ?').all(oneMonthAgoDateString) as Pemasukan[];
    const pengeluaranList = db.prepare('SELECT id, description, amount, date FROM pengeluaran WHERE date >= ?').all(oneMonthAgoDateString) as Pengeluaran[];
    
    const uangPangkalQuery = `
      SELECT up.id, up.amount, up.payment_date as date, u.name as userName
      FROM uang_pangkal up
      JOIN users u ON up.user_id = u.id
      WHERE up.payment_date >= ?
    `;
    const uangPangkalList = db.prepare(uangPangkalQuery).all(oneMonthAgoDateString) as { id: number, amount: number, date: string, userName: string }[];
    
    const iuranQuery = `
      SELECT i.id, i.amount, i.payment_date as date, i.month, i.year, u.name as userName
      FROM iuran_bulanan i
      JOIN users u ON i.user_id = u.id
      WHERE i.payment_date >= ?
    `;
    const iuranList = db.prepare(iuranQuery).all(oneMonthAgoDateString) as { id: number, amount: number, date: string, month: number, year: number, userName: string }[];

    const transactions: Transaction[] = [
        ...pemasukanList.map(p => ({ ...p, id: `pemasukan-${p.id}`, type: 'pemasukan' as const })),
        ...pengeluaranList.map(p => ({ ...p, id: `pengeluaran-${p.id}`, type: 'pengeluaran' as const })),
        ...uangPangkalList.map(p => ({ ...p, id: `up-${p.id}`, type: 'pemasukan' as const, description: `Uang Pangkal - ${p.userName}` })),
        ...iuranList.map(p => ({ ...p, id: `iuran-${p.id}`, type: 'pemasukan' as const, description: `Iuran ${MONTHS[p.month - 1]} ${p.year} - ${p.userName}` }))
    ];

    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return transactions;
}
