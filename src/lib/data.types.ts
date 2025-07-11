export type User = {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member' | 'bendahara' | 'ketua' | 'wakil-ketua' | 'sekretaris';
    avatar: string;
    birthDate: string; // YYYY-MM-DD
    password?: string;
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

  export type UangPangkal = {
    id: number;
    user_id: string;
    amount: number;
    payment_date: string;
  };

  export type UserWithUangPangkal = User & {
      uangPangkalStatus: 'Lunas' | 'Belum Lunas';
      uangPangkalAmount: number | null;
      uangPangkalDate: string | null;
  };

  export type Pemasukan = {
    id: number;
    description: string;
    amount: number;
    date: string;
  };
  
  export type Pengeluaran = {
    id: number;
    description: string;
    amount: number;
    date: string;
  };
  
  export type FinancialSummary = {
    totalPemasukan: number;
    totalPengeluaran: number;
    saldoAkhir: number;
    totalUangPangkal: number;
    totalIuranBulanan: number;
    totalPemasukanLain: number;
  };

  export type DashboardFinancialSummary = {
    dompetSaldo: number;
    totalPemasukanTahunan: number;
    totalPengeluaranTahunan: number;
  };

  export type Transaction = {
    id: string | number;
    description: string;
    amount: number;
    date: string;
    type: 'pemasukan' | 'pengeluaran';
  };

  export type IuranBulanan = {
    id: number;
    user_id: string;
    amount: number;
    payment_date: string;
    month: number;
    year: number;
  };
  
  export type UserWithIuranStatus = User & {
      iuranStatus: 'Lunas' | 'Belum Lunas';
      iuranAmount: number | null;
      iuranDate: string | null;
  };

