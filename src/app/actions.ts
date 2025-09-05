'use server';

import { initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, ref, get, set, update } from 'firebase/database';

const firebaseConfig = {
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
    username?: string;
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
    
    let unbanTimestamp;

    switch (userData.status) {
        case 1:
            return { success: false, message: 'This account is pending for approval.', status: 'pending' };
        case 2:
            return { success: true, message: 'Credentials verified.', status: 'approved', data: { username, email } };
        case 3:
            return { success: false, message: 'Your account is permanently banned.', status: 'banned', data: { username, banReason: userData.banReason || 'Violation of terms', banDuration: 'Permanent' } };
        
        case 4: // 24-hour ban
            unbanTimestamp = new Date(userData.bannedAt).getTime() + (24 * 60 * 60 * 1000);
            if (Date.now() > unbanTimestamp) {
                await update(userRef, { status: 2, banReason: null, banDuration: null, bannedAt: null, unbanAt: null });
                return { success: true, message: 'Credentials verified.', status: 'approved', data: { username, email } };
            }
            return { success: false, message: 'Your account is banned for 24 hours.', status: 'banned', data: { username, banReason: userData.banReason || 'Temporary suspension', banDuration: '24 Hours', unbanAt: unbanTimestamp } };

        case 5: // 7-day ban
            unbanTimestamp = new Date(userData.bannedAt).getTime() + (7 * 24 * 60 * 60 * 1000);
            if (Date.now() > unbanTimestamp) {
                await update(userRef, { status: 2, banReason: null, banDuration: null, bannedAt: null, unbanAt: null });
                return { success: true, message: 'Credentials verified.', status: 'approved', data: { username, email } };
            }
            return { success: false, message: 'Your account is banned for 7 days.', status: 'banned', data: { username, banReason: userData.banReason || 'Extended suspension', banDuration: '7 Days', unbanAt: unbanTimestamp } };
        
        case 6:
            return { success: false, message: 'This account has been deleted.', status: 'deleted' };
        
        case 7:
            return { success: false, message: 'A server error occurred with your account. Please contact support.', status: 'error' };
        
        default:
            // This handles the old ban status `3` with a potentially dynamic unbanAt for backward compatibility.
            if (userData.unbanAt && userData.unbanAt !== 'Permanent' && userData.bannedAt) {
                const banDurationMap: { [key: string]: number } = {
                    '24 Hours': 24 * 60 * 60 * 1000,
                    '7 Days': 7 * 24 * 60 * 60 * 1000,
                };
                const durationMs = banDurationMap[userData.banDuration];
                if (durationMs) {
                    unbanTimestamp = new Date(userData.bannedAt).getTime() + durationMs;
                    if (Date.now() > unbanTimestamp) {
                        await update(userRef, { status: 2, banReason: null, banDuration: null, bannedAt: null, unbanAt: null });
                        return { success: true, message: 'Credentials verified.', status: 'approved', data: { username, email } };
                    }
                    return { success: false, message: `Your account is temporarily banned.`, status: 'banned', data: { username, banReason: userData.banReason, banDuration: userData.banDuration, unbanAt: unbanTimestamp } };
                }
            }
            return { success: false, message: 'Unknown account status. Please contact support.', status: 'error' };
    }
}

export async function requestUnban(username: string): Promise<{ success: boolean; message: string }> {
    if (!username) {
        return { success: false, message: 'Username is required.' };
    }
    const userRef = ref(db, `users/${username.toLowerCase()}`);
    try {
        await update(userRef, {
            unbanRequest: true,
            unbanRequestAt: new Date().toISOString(),
        });
        return { success: true, message: 'Your unban request has been submitted to the administrators.' };
    } catch (error) {
        console.error('Unban request error:', error);
        return { success: false, message: 'Server error. Could not submit unban request.' };
    }
}
