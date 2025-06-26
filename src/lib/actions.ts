'use server';

import { z } from 'zod';
import { db } from './db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
