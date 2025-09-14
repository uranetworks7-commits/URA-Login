'use server';

import { initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, ref, get, set, update } from 'firebase/database';
import { securitySystemCheck, type SecuritySystemInput } from '@/ai/flows/security-system-for-account-bans';

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
    status?: 'approved' | 'pending' | 'banned' | 'deleted' | 'error' | 'not_found' | 'invalid_credentials' | 'crashed' | 'deactivated';
    data?: UserData | BannedDetails;
}

export async function createAccountRequest(data: UserData): Promise<{ success: boolean; message: string }> {
    const { username, email } = data;
    const userRef = ref(db, `users/${username.toLowerCase().trim()}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        return { success: false, message: 'Username already exists. Please choose another one.' };
    }

    try {
        await set(userRef, {
            email: email.trim(),
            status: 1, // Pending Approval
            createdAt: new Date().toISOString(),
        });
        return { success: true, message: 'Account request submitted! You will be notified once an admin approves it.' };
    } catch (error) {
        return { success: false, message: 'Server error. Please try again later.' };
    }
}

export interface UraSignupData {
    moderatorId: string;
    moderatorUsername: string;
    serverId: string;
    githubLink: string;
    uraApiKey: string;
}

export async function createUraAccountRequest(data: UraSignupData): Promise<{ success: boolean; message: string }> {
    console.log("Received URA Account Request:", data);
    // Here you would typically save this data to a different path in Firebase,
    // for example, `ura-requests/${data.moderatorId}`.
    // For now, we'll just simulate a success response.
    try {
        const requestRef = ref(db, `ura_requests/${data.moderatorId}`);
        const snapshot = await get(requestRef);
        if(snapshot.exists()) {
            return { success: false, message: 'A request with this Moderator ID already exists.'};
        }
        await set(requestRef, {
            ...data,
            requestedAt: new Date().toISOString(),
            status: 'pending_review'
        });
        return { success: true, message: 'URA account request submitted successfully. It is now pending review.' };
    } catch (error) {
        console.error("URA account request error:", error);
        return { success: false, message: 'Server error. Please try again later.' };
    }
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;


export async function loginUser(credentials: UserData): Promise<LoginResult> {
    const username = credentials.username.trim();
    const email = credentials.email.trim();
    
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

    // Check for expired temporary bans first
    if ((userData.status === 4 || userData.status === 5) && userData.bannedAt) {
        const banDuration = userData.status === 4 ? (24 * 60 * 60 * 1000) : (7 * 24 * 60 * 60 * 1000);
        unbanTimestamp = new Date(userData.bannedAt).getTime() + banDuration;
        if (Date.now() > unbanTimestamp) {
            await update(userRef, { status: 2, banReason: null, banDuration: null, bannedAt: null, unbanAt: null });
            const newSnapshot = await get(userRef);
            Object.assign(userData, newSnapshot.val());
        }
    }
    
    // Check for reactivation eligibility
    if (userData.status === 9 && userData.reactivationEligibleAt && Date.now() > userData.reactivationEligibleAt) {
        await update(userRef, { 
            status: 2, 
            reactivationRequest: null,
            reactivationReason: null,
            reactivationEligibleAt: null
        });
        const newSnapshot = await get(userRef);
        Object.assign(userData, newSnapshot.val());
    }

    // Check for inactivity deactivation
    if (userData.status === 2 && userData.lastLoginAt) {
        const lastLogin = new Date(userData.lastLoginAt).getTime();
        if ((Date.now() - lastLogin) > SEVEN_DAYS_MS) {
            await update(userRef, { status: 9 });
            userData.status = 9; // update status for current function execution
        }
    }

    switch (userData.status) {
        case 1:
            return { success: false, message: 'This account is pending for approval.', status: 'pending' };
        case 2:
            await update(userRef, { lastLoginAt: new Date().toISOString() });
            return { success: true, message: 'Credentials verified.', status: 'approved', data: { username, email } };
        case 3:
            return { success: false, message: 'Your account is permanently banned.', status: 'banned', data: { username, banReason: userData.banReason || 'Violation of terms', banDuration: 'Permanent' } };
        
        case 4: // 24-hour ban
            unbanTimestamp = new Date(userData.bannedAt).getTime() + (24 * 60 * 60 * 1000);
            return { success: false, message: 'Your account is banned for 24 hours.', status: 'banned', data: { username, banReason: userData.banReason || 'Temporary suspension', banDuration: '24 Hours', unbanAt: unbanTimestamp } };

        case 5: // 7-day ban
            unbanTimestamp = new Date(userData.bannedAt).getTime() + (7 * 24 * 60 * 60 * 1000);
            return { success: false, message: 'Your account is banned for 7 days.', status: 'banned', data: { username, banReason: userData.banReason || 'Extended suspension', banDuration: '7 Days', unbanAt: unbanTimestamp } };
        
        case 6:
            return { success: false, message: 'This account has been deleted.', status: 'deleted' };
        
        case 7:
            return { success: false, message: 'A server error occurred with your account. Please contact support.', status: 'error' };
        
        case 8:
            return { success: false, message: 'Your account has encountered a critical issue.', status: 'crashed' };
        
        case 9:
             return { success: false, message: 'Your account has been deactivated due to inactivity.', status: 'deactivated' };

        default:
            return { success: false, message: 'Unknown account status. Please contact support.', status: 'error' };
    }
}

export async function requestUnban(username: string): Promise<{ success: boolean; message: string; autoUnbanned?: boolean }> {
    if (!username) {
        return { success: false, message: 'Username is required.' };
    }
    const userRef = ref(db, `users/${username.toLowerCase()}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
        return { success: false, message: 'User not found.' };
    }

    const userData = snapshot.val();
    const isTempBanned = (userData.status === 4 || userData.status === 5) && userData.bannedAt;
    
    if (isTempBanned) {
        const banDuration = userData.status === 4 ? (24 * 60 * 60 * 1000) : (7 * 24 * 60 * 60 * 1000);
        const unbanTimestamp = new Date(userData.bannedAt).getTime() + banDuration;

        if (Date.now() > unbanTimestamp) {
            try {
                await update(userRef, { status: 2, banReason: null, banDuration: null, bannedAt: null, unbanRequest: null, unbanRequestAt: null });
                return { success: true, message: 'Your account has been automatically unbanned. You can now log in.', autoUnbanned: true };
            } catch (error) {
                console.error('Auto unban error:', error);
                return { success: false, message: 'Server error. Could not automatically unban your account.' };
            }
        }
    }

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

export interface ReactivationData {
    username: string;
    email: string;
    reason: string;
}

export async function requestReactivation(data: ReactivationData): Promise<{ success: boolean; message: string }> {
    const { username, email, reason } = data;
    const userRef = ref(db, `users/${username.toLowerCase().trim()}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
        return { success: false, message: 'User not found.' };
    }

    const userData = snapshot.val();
    if (userData.email.toLowerCase() !== email.toLowerCase()) {
        return { success: false, message: 'Invalid email for this username.' };
    }
    
    if (userData.status !== 9) {
        return { success: false, message: 'This account is not deactivated.' };
    }
    
    if (userData.reactivationRequest) {
        return { success: false, message: 'A reactivation request has already been submitted.' };
    }

    try {
        await update(userRef, {
            reactivationRequest: true,
            reactivationReason: reason,
            reactivationRequestedAt: new Date().toISOString(),
            reactivationEligibleAt: Date.now() + TWELVE_HOURS_MS
        });
        return { success: true, message: 'Your reactivation request has been submitted. Your account will be eligible for reactivation in 12 hours.' };
    } catch (error) {
        console.error("Reactivation request error:", error);
        return { success: false, message: 'Server error. Could not submit reactivation request.' };
    }
}
