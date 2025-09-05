'use server';

import { initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, ref, get, set, update } from 'firebase/database';
import { securitySystemCheck } from '@/ai/flows/security-system-for-account-bans';

const firebaseConfig = {
  apiKey: "AIzaSyA9BC2mHNGY5cMaUvVrNp6e0mvXmmEuXfA",
  authDomain: "ura-backup-new1.firebaseapp.com",
  databaseURL: "https://ura-backup-new1-default-rtdb.firebaseio.com",
  projectId: "ura-backup-new1",
  storageBucket: "ura-backup-new1.appspot.com",
  messagingSenderId: "699722460315",
  appId: "1:699722460315:web:f5da0f3ca3a36134d2ea3e"
};

let app: FirebaseApp;
try {
  app = getApp('server');
} catch (e) {
  app = initializeApp(firebaseConfig, 'server');
}

const db = getDatabase(app);

export interface UserData {
    username: string;
    email: string;
}

export interface BannedDetails {
    banReason: string;
    banDuration: string;
    unbanAt?: number;
}

export interface LoginResult {
    success: boolean;
    message: string;
    status?: 'approved' | 'pending' | 'banned' | 'deleted' | 'error' | 'not_found' | 'invalid_credentials';
    data?: UserData | BannedDetails;
}

export async function createAccountRequest(data: UserData): Promise<{ success: boolean; message: string }> {
    const { username, email } = data;
    const userRef = ref(db, `users/${username.toLowerCase()}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        return { success: false, message: 'Username already exists. Please choose another one.' };
    }

    try {
        await set(userRef, {
            email,
            status: 1, // Pending Approval
            createdAt: new Date().toISOString(),
        });
        return { success: true, message: 'Account request submitted! You will be notified once an admin approves it.' };
    } catch (error) {
        return { success: false, message: 'Server error. Please try again later.' };
    }
}

export async function runSecurityCheckAndLogin(user: UserData, activity: string): Promise<LoginResult> {
    try {
        const result = await securitySystemCheck({
            username: user.username,
            email: user.email,
            activityLog: activity,
        });

        if (result.isBanned) {
            let unbanAt;
            if (result.banDuration && result.banDuration.includes('hour')) {
                const hours = parseInt(result.banDuration, 10);
                unbanAt = Date.now() + hours * 60 * 60 * 1000;
            } else if (result.banDuration && result.banDuration.includes('day')) {
                const days = parseInt(result.banDuration, 10);
                unbanAt = Date.now() + days * 24 * 60 * 60 * 1000;
            }

            const banInfo = {
                status: 3, // Banned
                banReason: result.banReason || 'No reason specified.',
                banDuration: result.banDuration || 'Permanent',
                bannedAt: new Date().toISOString(),
                unbanAt: unbanAt ? new Date(unbanAt).toISOString() : 'Permanent',
            };
            await update(ref(db, `users/${user.username.toLowerCase()}`), banInfo);
            
            return {
                success: false,
                message: result.banReason || 'Your account has been banned due to suspicious activity.',
                status: 'banned',
                data: { ...result, unbanAt },
            };
        }
        return { success: true, message: 'Login successful!', status: 'approved', data: user };
    } catch (error) {
        console.error("Security check failed:", error);
        return { success: false, message: 'Could not complete security check.', status: 'error' };
    }
}


export async function loginUser(credentials: UserData): Promise<LoginResult> {
    const { username, email } = credentials;
    const userRef = ref(db, `users/${username.toLowerCase()}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
        return { success: false, message: 'Invalid username or email.', status: 'not_found' };
    }

    const userData = snapshot.val();
    if (userData.email.toLowerCase() !== email.toLowerCase()) {
        return { success: false, message: 'Invalid username or email.', status: 'invalid_credentials' };
    }
    
    switch (userData.status) {
        case 1:
            return { success: false, message: 'This account is pending for approval.', status: 'pending' };
        case 2:
            return { success: true, message: 'Credentials verified.', status: 'approved', data: { username, email } };
        case 3:
            let unbanTimestamp;
            if (userData.unbanAt && userData.unbanAt !== 'Permanent') {
                unbanTimestamp = new Date(userData.unbanAt).getTime();
                if (Date.now() > unbanTimestamp) {
                    await update(userRef, { status: 2, banReason: null, banDuration: null, bannedAt: null, unbanAt: null });
                     return { success: true, message: 'Credentials verified.', status: 'approved', data: { username, email } };
                }
            }
            return { success: false, message: 'Your account is banned.', status: 'banned', data: { banReason: userData.banReason, banDuration: userData.banDuration, unbanAt: unbanTimestamp } };
        case 4:
            return { success: false, message: 'This account has been deleted.', status: 'deleted' };
        case 5:
            return { success: false, message: 'A server error occurred with your account. Please contact support.', status: 'error' };
        default:
            return { success: false, message: 'Unknown account status. Please contact support.', status: 'error' };
    }
}
