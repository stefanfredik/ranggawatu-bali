'use server';

import { z } from 'zod';
import { db } from './db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UANG_PANGKAL_AMOUNT, getUserByEmailForAuth, getLoggedInUser } from './data';
import { cookies } from 'next/headers';

const UserSchema = z.object({
  name: z.string().min(1, 'Full Name is required.'),
  email: z.string().email('Invalid email address.'),
  role: z.enum(['admin', 'member', 'bendahara', 'ketua', 'wakil-ketua', 'sekretaris']),
  birthDate: z.string().optional(),
});

export async function createUser(formData: FormData) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser || loggedInUser.role !== 'admin') {
    throw new Error('Unauthorized');
  }

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
  const password = '12345'; // Default password

  try {
    db.prepare(
      'INSERT INTO users (id, name, email, role, avatar, birthDate, password) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(id, name, email, role, avatar, birthDate || null, password);
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
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

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
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

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
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
})
.refine(data => {
  if (data.password && data.password.length < 5) return false;
  return true;
}, {
  message: "Password must be at least 5 characters.",
  path: ["password"],
})
.refine(data => {
  if (data.password !== data.confirmPassword) return false;
  return true;
}, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export async function updateProfile(id: string, prevState: any, formData: FormData) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser || loggedInUser.id !== id) {
    throw new Error('Unauthorized');
  }

  const rawFormData = Object.fromEntries(formData.entries());

  if (!rawFormData.password && !rawFormData.confirmPassword) {
      delete rawFormData.password;
      delete rawFormData.confirmPassword;
  }

  const validatedFields = ProfileSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
      return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Invalid data. Please check the form.',
      };
  }

  const { name, email, birthDate, password } = validatedFields.data;

  try {
      db.transaction(() => {
          db.prepare(
              'UPDATE users SET name = ?, email = ?, birthDate = ? WHERE id = ?'
          ).run(name, email, birthDate || null, id);
  
          if (password) {
              db.prepare(
                  'UPDATE users SET password = ? WHERE id = ?'
              ).run(password, id);
          }
      })();
  } catch (error) {
      console.error('Database Error:', error);
      return { message: 'Database Error: Failed to update profile.' };
  }

  revalidatePath(`/dashboard/profile`);
  revalidatePath(`/dashboard/members`);
  return { success: true, message: 'Profile updated successfully!' };
}

export async function markUangPangkalAsPaid(userId: string, paymentDate: string) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser || (loggedInUser.role !== 'admin' && loggedInUser.role !== 'bendahara')) {
    throw new Error('Unauthorized');
  }

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
  revalidatePath('/dashboard/keuangan/dompet-saldo');
  return { success: true };
}

const PemasukanSchema = z.object({
    description: z.string().min(1, 'Description is required.'),
    amount: z.coerce.number().positive('Amount must be a positive number.'),
    date: z.string().min(1, 'Date is required.'),
  });
  
export async function createPemasukan(formData: FormData) {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || (loggedInUser.role !== 'admin' && loggedInUser.role !== 'bendahara')) {
      throw new Error('Unauthorized');
    }
  
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
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || (loggedInUser.role !== 'admin' && loggedInUser.role !== 'bendahara')) {
      throw new Error('Unauthorized');
    }

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
      const loggedInUser = await getLoggedInUser();
      if (!loggedInUser || (loggedInUser.role !== 'admin' && loggedInUser.role !== 'bendahara')) {
        throw new Error('Unauthorized');
      }

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
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || (loggedInUser.role !== 'admin' && loggedInUser.role !== 'bendahara')) {
      throw new Error('Unauthorized');
    }

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
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || (loggedInUser.role !== 'admin' && loggedInUser.role !== 'bendahara')) {
      throw new Error('Unauthorized');
    }

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
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || (loggedInUser.role !== 'admin' && loggedInUser.role !== 'bendahara')) {
      throw new Error('Unauthorized');
    }
  
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

export async function markIuranAsPaid(formData: FormData) {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || (loggedInUser.role !== 'admin' && loggedInUser.role !== 'bendahara')) {
      throw new Error('Unauthorized');
    }

    const IuranSchema = z.object({
      userId: z.string(),
      paymentDate: z.string().min(1, 'Payment date is required.'),
      month: z.coerce.number(),
      year: z.coerce.number(),
      amount: z.coerce.number().positive('Amount must be a positive number.'),
    });
  
    const validatedFields = IuranSchema.safeParse({
      userId: formData.get('userId'),
      paymentDate: formData.get('paymentDate'),
      month: formData.get('month'),
      year: formData.get('year'),
      amount: formData.get('amount'),
    });
  
    if (!validatedFields.success) {
      console.error(validatedFields.error);
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Invalid data provided.',
      };
    }
  
    const { userId, paymentDate, month, year, amount } = validatedFields.data;
  
    try {
      db.prepare(
        `INSERT INTO iuran_bulanan (user_id, amount, payment_date, month, year) 
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(user_id, month, year) 
         DO UPDATE SET amount = excluded.amount, payment_date = excluded.payment_date`
      ).run(userId, amount, paymentDate, month, year);
    } catch (error) {
      console.error('Database Error:', error);
      return {
        message: 'Database Error: Failed to mark as paid.',
      };
    }
  
    revalidatePath(`/dashboard/keuangan/iuran-bulanan?month=${month}&year=${year}`);
    revalidatePath('/dashboard/keuangan/dompet-saldo');
    return { success: true };
  }

const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const validatedFields = LoginSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return 'Invalid fields.';
    }

    const { email, password } = validatedFields.data;
    const user = await getUserByEmailForAuth(email);

    if (!user || user.password !== password) {
      return 'Invalid credentials.';
    }
    
    cookies().set('session', user.id, { httpOnly: true, path: '/' });

  } catch (error) {
    console.error('Authentication Error:', error);
    return 'Something went wrong.';
  }

  redirect('/dashboard');
}

export async function logout() {
  cookies().delete('session');
  redirect('/');
}

const AnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content is required.'),
});

export async function createAnnouncement(formData: FormData) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser || loggedInUser.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const validatedFields = AnnouncementSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return { 
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create announcement.' 
    };
  }

  const { title, content } = validatedFields.data;
  const id = crypto.randomUUID();
  const date = new Date().toISOString();
  const author = loggedInUser.name;

  try {
    db.prepare(
      'INSERT INTO announcements (id, title, content, date, author) VALUES (?, ?, ?, ?, ?)'
    ).run(id, title, content, date, author);
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to create announcement.' };
  }

  revalidatePath('/dashboard/announcements');
  revalidatePath('/dashboard');
  redirect('/dashboard/announcements');
}

const EventSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    description: z.string().min(1, 'Description is required.'),
    date: z.string().min(1, 'Date is required.'),
});

export async function createEvent(formData: FormData) {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    const validatedFields = EventSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
    });

    if (!validatedFields.success) {
        return { message: 'Failed to create event.' };
    }

    const { title, description, date } = validatedFields.data;
    const id = crypto.randomUUID();
    const author = loggedInUser.name;

    try {
        db.prepare(
            'INSERT INTO events (id, title, description, date, author) VALUES (?, ?, ?, ?, ?)'
        ).run(id, title, description, date, author);
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Database error: Failed to create event.' };
    }

    revalidatePath('/dashboard/events');
    revalidatePath('/dashboard');
    redirect('/dashboard/events');
}

const RegisterSchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(5, 'Password must be at least 5 characters.'),
});

export async function registerUser(prevState: any, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to register.',
    };
  }

  const { name, email, password } = validatedFields.data;

  // Check if user already exists
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return {
      message: 'An account with this email already exists.',
    };
  }

  const id = crypto.randomUUID();
  const avatar = 'https://placehold.co/100x100.png';
  const role = 'member';

  try {
    db.prepare(
      'INSERT INTO users (id, name, email, role, avatar, birthDate, password) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(id, name, email, role, avatar, null, password);
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to register user.',
    };
  }
  
  cookies().set('session', id, { httpOnly: true, path: '/' });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
