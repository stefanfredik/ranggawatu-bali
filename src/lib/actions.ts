'use server';

import { z } from 'zod';
import { db } from './db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UANG_PANGKAL_AMOUNT } from './data';

const UserSchema = z.object({
  name: z.string().min(1, 'Full Name is required.'),
  email: z.string().email('Invalid email address.'),
  role: z.enum(['admin', 'member']),
  birthDate: z.string().optional(),
});

export async function createUser(formData: FormData) {
  const validatedFields = UserSchema.safeParse({
    name: formData.get('full-name'),
    email: formData.get('email'),
    role: formData.get('role'),
    birthDate: formData.get('birthdate'),
  });

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create User.',
    };
  }
  const { name, email, role, birthDate } = validatedFields.data;
  
  const id = crypto.randomUUID();
  const avatar = 'https://placehold.co/100x100.png';

  try {
    db.prepare(
      'INSERT INTO users (id, name, email, role, avatar, birthDate) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, name, email, role, avatar, birthDate || null);
  } catch (error) {
    console.error('Database Error:', error);
    return {
        message: 'Database Error: Failed to Create User.',
    };
  }

  revalidatePath('/dashboard/members');
  redirect('/dashboard/members');
}

export async function updateUser(id: string, formData: FormData) {
    const validatedFields = UserSchema.safeParse({
        name: formData.get('full-name'),
        email: formData.get('email'),
        role: formData.get('role'),
        birthDate: formData.get('birthdate'),
      });
    
      if (!validatedFields.success) {
        console.error(validatedFields.error);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update User.',
        };
      }

      const { name, email, role, birthDate } = validatedFields.data;

      try {
        db.prepare(
          'UPDATE users SET name = ?, email = ?, role = ?, birthDate = ? WHERE id = ?'
        ).run(name, email, role, birthDate || null, id);
      } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to Update User.',
        };
      }

    revalidatePath(`/dashboard/members/${id}`);
    revalidatePath('/dashboard/members');
    redirect(`/dashboard/members/${id}`);
}

export async function deleteUser(id: string) {
    if (id === '1') {
        console.error("Attempted to delete the default admin user.");
        return { message: 'Cannot delete the administrator account.' };
    }
    try {
        db.prepare('DELETE FROM users WHERE id = ?').run(id);
        revalidatePath('/dashboard/members');
        return { success: true };
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Database Error: Failed to delete user.' };
    }
}

const ProfileSchema = z.object({
    name: z.string().min(1, 'Full Name is required.'),
    email: z.string().email('Invalid email address.'),
    birthDate: z.string().optional(),
  });
  
export async function updateProfile(id: string, formData: FormData) {
    const validatedFields = ProfileSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        birthDate: formData.get('birthdate'),
    });
  
    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: 'Invalid data provided.' };
    }

    const { name, email, birthDate } = validatedFields.data;

    try {
        db.prepare(
        'UPDATE users SET name = ?, email = ?, birthDate = ? WHERE id = ?'
        ).run(name, email, birthDate || null, id);
    } catch (error) {
        console.error('Database Error:', error);
        return { error: 'Failed to update profile.' };
    }

    revalidatePath(`/dashboard/profile`);
    revalidatePath(`/dashboard/members`);
    revalidatePath(`/`);
    return { success: true };
}

export async function markUangPangkalAsPaid(userId: string, paymentDate: string) {
  const UangPangkalSchema = z.object({
    userId: z.string(),
    paymentDate: z.string({ required_error: 'Payment date is required.' }).refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  });

  const validatedFields = UangPangkalSchema.safeParse({ userId, paymentDate });

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data provided.',
    };
  }

  try {
    db.prepare(
      `INSERT INTO uang_pangkal (user_id, amount, payment_date) 
       VALUES (?, ?, ?)
       ON CONFLICT(user_id) 
       DO UPDATE SET amount = excluded.amount, payment_date = excluded.payment_date`
    ).run(userId, UANG_PANGKAL_AMOUNT, paymentDate);
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to mark as paid.',
    };
  }

  revalidatePath('/dashboard/keuangan/uang-pangkal');
  return { success: true };
}

const PemasukanSchema = z.object({
    description: z.string().min(1, 'Description is required.'),
    amount: z.coerce.number().positive('Amount must be a positive number.'),
    date: z.string().min(1, 'Date is required.'),
  });
  
export async function createPemasukan(formData: FormData) {
    const validatedFields = PemasukanSchema.safeParse({
      description: formData.get('description'),
      amount: formData.get('amount'),
      date: formData.get('date'),
    });
  
    if (!validatedFields.success) {
      console.error(validatedFields.error);
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Pemasukan.',
      };
    }
    
    const { description, amount, date } = validatedFields.data;
  
    try {
      db.prepare(
        'INSERT INTO pemasukan (description, amount, date) VALUES (?, ?, ?)'
      ).run(description, amount, date);
    } catch (error) {
      console.error('Database Error:', error);
      return {
          message: 'Database Error: Failed to Create Pemasukan.',
      };
    }
  
    revalidatePath('/dashboard/keuangan/pemasukan');
    revalidatePath('/dashboard/keuangan/dompet-saldo');
    redirect('/dashboard/keuangan/pemasukan');
}

export async function updatePemasukan(id: number, formData: FormData) {
    const validatedFields = PemasukanSchema.safeParse({
      description: formData.get('description'),
      amount: formData.get('amount'),
      date: formData.get('date'),
    });
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Pemasukan.',
      };
    }
    
    const { description, amount, date } = validatedFields.data;
  
    try {
      db.prepare(
        'UPDATE pemasukan SET description = ?, amount = ?, date = ? WHERE id = ?'
      ).run(description, amount, date, id);
    } catch (error) {
      console.error('Database Error:', error);
      return {
          message: 'Database Error: Failed to Update Pemasukan.',
      };
    }
  
    revalidatePath('/dashboard/keuangan/pemasukan');
    revalidatePath(`/dashboard/keuangan/pemasukan/${id}`);
    revalidatePath('/dashboard/keuangan/dompet-saldo');
    redirect(`/dashboard/keuangan/pemasukan/${id}`);
  }
  
  
  export async function deletePemasukan(id: number) {
      try {
          db.prepare('DELETE FROM pemasukan WHERE id = ?').run(id);
          revalidatePath('/dashboard/keuangan/pemasukan');
          revalidatePath('/dashboard/keuangan/dompet-saldo');
          return { success: true };
      } catch (error) {
          console.error('Database Error:', error);
          return { message: 'Database Error: Failed to delete pemasukan.' };
      }
  }

const PengeluaranSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  date: z.string().min(1, 'Date is required.'),
});

export async function createPengeluaran(formData: FormData) {
    const validatedFields = PengeluaranSchema.safeParse({
        description: formData.get('description'),
        amount: formData.get('amount'),
        date: formData.get('date'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Pengeluaran.',
        };
    }

    const { description, amount, date } = validatedFields.data;

    try {
        db.prepare(
            'INSERT INTO pengeluaran (description, amount, date) VALUES (?, ?, ?)'
        ).run(description, amount, date);
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Database Error: Failed to Create Pengeluaran.' };
    }

    revalidatePath('/dashboard/keuangan/pengeluaran');
    revalidatePath('/dashboard/keuangan/dompet-saldo');
    redirect('/dashboard/keuangan/pengeluaran');
}

export async function updatePengeluaran(id: number, formData: FormData) {
    const validatedFields = PengeluaranSchema.safeParse({
        description: formData.get('description'),
        amount: formData.get('amount'),
        date: formData.get('date'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Pengeluaran.',
        };
    }

    const { description, amount, date } = validatedFields.data;

    try {
        db.prepare(
            'UPDATE pengeluaran SET description = ?, amount = ?, date = ? WHERE id = ?'
        ).run(description, amount, date, id);
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Database Error: Failed to Update Pengeluaran.' };
    }

    revalidatePath('/dashboard/keuangan/pengeluaran');
    revalidatePath(`/dashboard/keuangan/pengeluaran/${id}`);
    revalidatePath('/dashboard/keuangan/dompet-saldo');
    redirect(`/dashboard/keuangan/pengeluaran/${id}`);
}

export async function deletePengeluaran(id: number) {
    try {
        db.prepare('DELETE FROM pengeluaran WHERE id = ?').run(id);
        revalidatePath('/dashboard/keuangan/pengeluaran');
        revalidatePath('/dashboard/keuangan/dompet-saldo');
        return { success: true };
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Database Error: Failed to delete pengeluaran.' };
    }
}
