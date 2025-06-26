import Database from 'better-sqlite3';
import type { User, Event, Announcement } from './data.types';

const db = new Database('organizee.db');

db.pragma('journal_mode = WAL');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      avatar TEXT,
      birthDate TEXT
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      author TEXT NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      author TEXT NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS uang_pangkal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      amount INTEGER NOT NULL,
      payment_date TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS pemasukan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount INTEGER NOT NULL,
      date TEXT NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS pengeluaran (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount INTEGER NOT NULL,
      date TEXT NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS iuran_bulanan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      payment_date TEXT NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      UNIQUE(user_id, month, year),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);


  const users: User[] = [
    { id: '1', name: 'Administrator', email: 'admin@example.com', role: 'admin', avatar: 'https://placehold.co/100x100.png', birthDate: '1990-05-15' },
    { id: '2', name: 'Budi Doremi', email: 'budi@example.com', role: 'bendahara', avatar: 'https://placehold.co/100x100.png', birthDate: '1992-08-22' },
    { id: '3', name: 'Citra Kirana', email: 'citra@example.com', role: 'member', avatar: 'https://placehold.co/100x100.png', birthDate: new Date(new Date().setMonth(new Date().getMonth(), 5)).toISOString().split('T')[0] },
    { id: '4', name: 'Dewi Lestari', email: 'dewi@example.com', role: 'member', avatar: 'https://placehold.co/100x100.png', birthDate: '1988-11-10' },
    { id: '5', name: 'Eka Kurniawan', email: 'eka@example.com', role: 'member', avatar: 'https://placehold.co/100x100.png', birthDate: '1995-03-30' },
  ];
  
  const events: Event[] = [
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
  
  const announcements: Announcement[] = [
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

  const uangPangkalData = [
    { user_id: '1', amount: 50000, payment_date: '2023-01-15' },
    { user_id: '2', amount: 50000, payment_date: '2023-10-15' },
    { user_id: '4', amount: 50000, payment_date: '2023-11-01' },
  ];

  const pemasukanData = [
    { description: 'Donasi dari anggota kehormatan', amount: 250000, date: '2023-12-01' },
    { description: 'Sisa dana dari acara tahun lalu', amount: 150000, date: '2024-01-05' },
  ];

  const pengeluaranData = [
      { description: 'Pembelian ATK untuk rapat bulanan', amount: 75000, date: '2024-02-10' },
      { description: 'Biaya konsumsi rapat', amount: 125000, date: '2024-02-10' },
      { description: 'Perbaikan proyektor', amount: 200000, date: '2024-03-20' },
  ];

  const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, name, email, role, avatar, birthDate) VALUES (?, ?, ?, ?, ?, ?)');
  const insertEvent = db.prepare('INSERT OR IGNORE INTO events (id, title, date, description, author) VALUES (?, ?, ?, ?, ?)');
  const insertAnnouncement = db.prepare('INSERT OR IGNORE INTO announcements (id, title, content, date, author) VALUES (?, ?, ?, ?, ?)');
  const insertUangPangkal = db.prepare('INSERT OR IGNORE INTO uang_pangkal (user_id, amount, payment_date) VALUES (?, ?, ?)');
  const insertPemasukan = db.prepare('INSERT OR IGNORE INTO pemasukan (description, amount, date) VALUES (?, ?, ?)');
  const insertPengeluaran = db.prepare('INSERT OR IGNORE INTO pengeluaran (description, amount, date) VALUES (?, ?, ?)');
  const insertIuranBulanan = db.prepare('INSERT OR IGNORE INTO iuran_bulanan (user_id, amount, payment_date, month, year) VALUES (?, ?, ?, ?, ?)');

  const insertManyUsers = db.transaction((users) => {
    for (const user of users) insertUser.run(user.id, user.name, user.email, user.role, user.avatar, user.birthDate);
  });
  const insertManyEvents = db.transaction((events) => {
    for (const event of events) insertEvent.run(event.id, event.title, event.date, event.description, event.author);
  });
  const insertManyAnnouncements = db.transaction((announcements) => {
    for (const ann of announcements) insertAnnouncement.run(ann.id, ann.title, ann.content, ann.date, ann.author);
  });
   const insertManyUangPangkal = db.transaction((data) => {
    for (const item of data) insertUangPangkal.run(item.user_id, item.amount, item.payment_date);
  });
  const insertManyPemasukan = db.transaction((data) => {
    for (const item of data) insertPemasukan.run(item.description, item.amount, item.date);
  });
  const insertManyPengeluaran = db.transaction((data) => {
      for (const item of data) insertPengeluaran.run(item.description, item.amount, item.date);
  });
  const insertManyIuranBulanan = db.transaction((data) => {
    for (const item of data) insertIuranBulanan.run(item.user_id, item.amount, item.payment_date, item.month, item.year);
  });
  
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
      insertManyUsers(users);
  }

  const eventCount = db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number };
  if (eventCount.count === 0) {
      insertManyEvents(events);
  }

  const announcementCount = db.prepare('SELECT COUNT(*) as count FROM announcements').get() as { count: number };
  if (announcementCount.count === 0) {
      insertManyAnnouncements(announcements);
  }

  const uangPangkalCount = db.prepare('SELECT COUNT(*) as count FROM uang_pangkal').get() as { count: number };
  if (uangPangkalCount.count === 0) {
      insertManyUangPangkal(uangPangkalData);
  }

  const pemasukanCount = db.prepare('SELECT COUNT(*) as count FROM pemasukan').get() as { count: number };
    if (pemasukanCount.count === 0) {
        insertManyPemasukan(pemasukanData);
    }

    const pengeluaranCount = db.prepare('SELECT COUNT(*) as count FROM pengeluaran').get() as { count: number };
    if (pengeluaranCount.count === 0) {
        insertManyPengeluaran(pengeluaranData);
    }

    const iuranBulananCount = db.prepare('SELECT COUNT(*) as count FROM iuran_bulanan').get() as { count: number };
    if (iuranBulananCount.count === 0) {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const demoIuranData = [
          { user_id: '1', amount: 20000, payment_date: new Date(currentYear, currentMonth - 1, 10).toISOString().split('T')[0], month: currentMonth, year: currentYear },
          { user_id: '2', amount: 20000, payment_date: new Date(currentYear, currentMonth - 1, 12).toISOString().split('T')[0], month: currentMonth, year: currentYear },
      ];
      insertManyIuranBulanan(demoIuranData);
  }
}

initDb();

export { db };
