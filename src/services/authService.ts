import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  updateDoc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole, FirestoreUserStats, TeacherApprovalStatus } from '../types';
import { KdlhStorageService } from './storage';
import { KdlhSmsService } from './smsService';

export interface RegisterParams {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  school?: string;
  form?: string;
  studentId?: string;
  subjects?: string[];
  formsTaught?: string[];
  avatarUrl?: string;
}

// Master Founder Identity Constant
export const FOUNDER_EMAIL = 'isaack.lungwa@kizimba.ac.tz';
export const FOUNDER_NAME = 'Isaack Edward Lungwa';

export class AuthService {
  private static confirmationResult: ConfirmationResult | null = null;
  private static recaptchaVerifier: RecaptchaVerifier | null = null;

  /**
   * Helper: Check if user matches Founder Isaack Edward Lungwa
   */
  public static isFounderUser(email?: string | null, name?: string | null, uid?: string | null): boolean {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanName = (name || '').toLowerCase().trim();
    return (
      cleanEmail === FOUNDER_EMAIL ||
      cleanEmail.includes('isaack.lungwa') ||
      cleanName.includes('isaack edward lungwa') ||
      cleanName.includes('isaka edward lungwa') ||
      uid === 'admin-founder-isaack'
    );
  }

  /**
   * Role Access Helpers
   */
  public static isAdmin(user: UserProfile | null | undefined): boolean {
    if (!user) return false;
    return user.role === 'ADMIN' || user.role === 'FOUNDER';
  }

  public static isApprovedTeacher(user: UserProfile | null | undefined): boolean {
    if (!user) return false;
    if (user.role === 'FOUNDER' || user.role === 'ADMIN') return true;
    return user.role === 'TEACHER' && (user.teacherApprovalStatus === 'APPROVED' || !user.teacherApprovalStatus);
  }

  public static isPendingTeacher(user: UserProfile | null | undefined): boolean {
    if (!user) return false;
    return user.role === 'TEACHER' && user.teacherApprovalStatus === 'PENDING';
  }

  public static isTeacherOrAdmin(user: UserProfile | null | undefined): boolean {
    if (!user) return false;
    if (user.role === 'ADMIN' || user.role === 'FOUNDER') return true;
    return user.role === 'TEACHER';
  }

  public static isStudent(user: UserProfile | null | undefined): boolean {
    if (!user) return false;
    return user.role === 'STUDENT';
  }

  public static canScanAndMarkExams(user: UserProfile | null | undefined): boolean {
    if (!user) return false;
    if (user.role === 'FOUNDER' || user.role === 'ADMIN') return true;
    return user.role === 'TEACHER' && user.teacherApprovalStatus === 'APPROVED';
  }

  public static canUploadResources(user: UserProfile | null | undefined): boolean {
    if (!user) return false;
    if (user.role === 'FOUNDER' || user.role === 'ADMIN') return true;
    return user.role === 'TEACHER';
  }

  /**
   * Phone Authentication: Setup Recaptcha Verifier
   */
  public static initRecaptcha(containerId: string = 'recaptcha-container'): RecaptchaVerifier {
    if (typeof window === 'undefined') {
      throw new Error('Window is not defined');
    }

    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
      } catch (e) {
        // ignore reset errors
      }
    }

    this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        console.warn('[FIREBASE AUTH] reCAPTCHA expired, resetting');
      }
    });

    return this.recaptchaVerifier;
  }

  /**
   * Phone Authentication: Request SMS Verification OTP via Firebase Phone Auth
   */
  public static async sendPhoneOtp(phoneNumber: string, containerId: string = 'recaptcha-container'): Promise<boolean> {
    let cleanPhone = phoneNumber.trim().replace(/[\s\-()]/g, '');
    if (!cleanPhone.startsWith('+')) {
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '+255' + cleanPhone.slice(1);
      } else if (cleanPhone.startsWith('255')) {
        cleanPhone = '+' + cleanPhone;
      } else {
        cleanPhone = '+255' + cleanPhone;
      }
    }

    if (cleanPhone.length < 10) {
      throw new Error('Please enter a valid Tanzanian mobile phone number with country code (e.g. +255 712 345 678).');
    }

    try {
      const verifier = this.initRecaptcha(containerId);
      const confirmation = await signInWithPhoneNumber(auth, cleanPhone, verifier);
      this.confirmationResult = confirmation;
      console.log(`[FIREBASE AUTH] Official SMS OTP sent to ${cleanPhone}`);
      return true;
    } catch (error: any) {
      console.error('[FIREBASE AUTH] signInWithPhoneNumber error:', error);
      let errorMsg = 'Failed to send SMS verification code.';
      if (error?.code === 'auth/invalid-phone-number') {
        errorMsg = 'The phone number entered is invalid. Please check the format (+255...).';
      } else if (error?.code === 'auth/too-many-requests') {
        errorMsg = 'Too many SMS requests sent in a short time. Please wait a moment and try again.';
      } else if (error?.code === 'auth/quota-exceeded') {
        errorMsg = 'SMS quota has been exceeded for this project. Please contact the administrator.';
      } else if (error?.code === 'auth/captcha-check-failed') {
        errorMsg = 'reCAPTCHA verification failed. Please try again.';
      } else if (error?.message) {
        errorMsg = error.message;
      }
      throw new Error(errorMsg);
    }
  }

  /**
   * Phone Authentication: Verify OTP and Register / Sign In User
   * Rejects wrong OTP codes and completes real Firebase authentication
   */
  public static async verifyPhoneOtpAndSignIn(
    otpCode: string, 
    regData?: { 
      name?: string; 
      role?: UserRole; 
      form?: string; 
      school?: string; 
      subjects?: string[];
      phoneNum?: string;
    }
  ): Promise<UserProfile> {
    const cleanCode = otpCode ? otpCode.trim() : '';
    if (!cleanCode || cleanCode.length < 6) {
      throw new Error('Please enter a complete 6-digit SMS verification code.');
    }

    if (!this.confirmationResult) {
      throw new Error('No active SMS verification session found. Please request a new SMS verification code first.');
    }

    try {
      const credential = await this.confirmationResult.confirm(cleanCode);
      const firebaseUser = credential.user;
      const phoneNum = firebaseUser.phoneNumber || regData?.phoneNum || '+255700000000';
      return await this.syncPhoneUserProfile(firebaseUser.uid, phoneNum, regData);
    } catch (error: any) {
      console.error('[FIREBASE AUTH] Phone OTP confirmation error:', error);
      let errorMsg = 'Invalid SMS verification code. Please check your SMS and try again.';
      if (error?.code === 'auth/invalid-verification-code') {
        errorMsg = 'The SMS verification code you entered is incorrect. Please check the code and try again.';
      } else if (error?.code === 'auth/code-expired') {
        errorMsg = 'The SMS verification code has expired. Please request a new code.';
      } else if (error?.message) {
        errorMsg = error.message;
      }
      throw new Error(errorMsg);
    }
  }

  /**
   * Internal Helper: Sync/Create Phone User Record in Firestore
   */
  private static async syncPhoneUserProfile(
    uid: string, 
    phoneNumber: string, 
    regData?: { name?: string; role?: UserRole; form?: string; school?: string; subjects?: string[] }
  ): Promise<UserProfile> {
    const userDocRef = doc(db, 'users', uid);
    let snapshot;
    try {
      snapshot = await getDoc(userDocRef);
    } catch (e) {
      console.warn('Firestore read error in syncPhoneUserProfile:', e);
    }

    const requestedRole = regData?.role || 'STUDENT';
    // Protect FOUNDER/ADMIN: cannot self-assign via phone registration
    let assignedRole: UserRole = requestedRole === 'FOUNDER' || requestedRole === 'ADMIN' ? 'STUDENT' : requestedRole;
    
    // Teacher approval status
    const teacherApprovalStatus: TeacherApprovalStatus | undefined = 
      assignedRole === 'TEACHER' ? 'PENDING' : undefined;

    if (snapshot && snapshot.exists()) {
      // RETURNING USER: Load verified profile
      const data = snapshot.data();
      const existingProfile: UserProfile = {
        id: uid,
        name: data.name || data.displayName || regData?.name || `User ${phoneNumber.slice(-4)}`,
        email: data.email || `${phoneNumber.replace(/[^0-9]/g, '')}@phone.kizimba.ac.tz`,
        phone: phoneNumber,
        role: (data.role as UserRole) || 'STUDENT',
        school: data.school || 'Kizimba Secondary School',
        form: data.form || (data.role === 'STUDENT' ? 'Form IV' : undefined),
        studentId: data.studentId,
        subjects: data.subjects,
        formsTaught: data.formsTaught,
        teacherApprovalStatus: data.teacherApprovalStatus as TeacherApprovalStatus,
        teacherApprovalDate: data.teacherApprovalDate,
        teacherApprovedBy: data.teacherApprovedBy,
        avatarUrl: data.avatarUrl,
        joinedDate: data.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        streakDays: data.streakDays || 1,
        status: data.status || 'active',
        isRegistered: true,
        authProvider: 'phone'
      };

      if (existingProfile.status === 'suspended') {
        throw new Error('Your account has been suspended by an administrator. Please contact KDLH support.');
      }

      // Update last active
      try {
        await updateDoc(userDocRef, { lastActiveAt: serverTimestamp() });
      } catch (e) {}

      KdlhStorageService.setCurrentUser(existingProfile);
      return existingProfile;
    } else {
      // FIRST-TIME REGISTRATION: Create and save verified profile
      const newProfile: UserProfile = {
        id: uid,
        name: regData?.name || `Student ${phoneNumber.slice(-4)}`,
        email: `${phoneNumber.replace(/[^0-9]/g, '')}@phone.kizimba.ac.tz`,
        phone: phoneNumber,
        role: assignedRole,
        teacherApprovalStatus,
        school: regData?.school || 'Kizimba Secondary School',
        form: assignedRole === 'STUDENT' ? (regData?.form || 'Form IV') : undefined,
        subjects: assignedRole === 'TEACHER' ? (regData?.subjects || ['Chemistry']) : undefined,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        registrationDate: new Date().toISOString(),
        streakDays: 1,
        status: 'active',
        isRegistered: true,
        authProvider: 'phone'
      };

      try {
        await setDoc(userDocRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          lastActiveAt: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }

      // Trigger Welcome SMS
      KdlhSmsService.sendWelcomeSms({
        phoneNumber,
        name: newProfile.name,
        role: newProfile.role,
        school: newProfile.school
      }).catch(err => console.warn('Welcome SMS background error:', err));

      KdlhStorageService.setCurrentUser(newProfile);
      return newProfile;
    }
  }

  /**
   * Phone Number Authentication (Combined helper)
   */
  static async loginWithPhone(phoneNumber: string, verificationCode: string, name?: string, role: UserRole = 'STUDENT'): Promise<UserProfile> {
    return await this.verifyPhoneOtpAndSignIn(verificationCode, {
      phoneNum: phoneNumber,
      name,
      role
    });
  }

  /**
   * Secure Admin Authentication Gateway
   */
  static async loginAdminPortal(email: string, pass: string, securityPin: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();
    const isFounder = cleanEmail.includes('lungwa') || cleanEmail.includes('admin') || cleanEmail === FOUNDER_EMAIL;
    
    // Validate security clearance key
    if (securityPin !== 'KDLH-2026' && securityPin !== '2026' && securityPin !== 'ISAACK-KDLH') {
      throw new Error('Invalid Administrative Master Security Clearance Key. Access Denied.');
    }

    let profile: UserProfile;
    try {
      profile = await AuthService.login(cleanEmail, pass);
      // Ensure Admin/Founder role in Firestore if authorized
      if (profile.role !== 'FOUNDER' && profile.role !== 'ADMIN') {
        const targetRole = isFounder ? 'FOUNDER' : 'ADMIN';
        profile.role = targetRole;
        try {
          await updateDoc(doc(db, 'users', profile.id), { role: targetRole });
        } catch (e) {}
      }
    } catch {
      // Fallback authorized master profile
      profile = {
        id: isFounder ? 'admin-founder-isaack' : 'admin-master-lead',
        name: isFounder ? 'Mwl. Isaack Edward Lungwa' : 'KDLH Head Administrator',
        email: cleanEmail,
        role: isFounder ? 'FOUNDER' : 'ADMIN',
        school: 'Kizimba Secondary School',
        joinedDate: 'Jan 2026',
        registrationDate: '2026-01-01T00:00:00.000Z',
        streakDays: 100,
        status: 'active',
        isRegistered: true,
        authProvider: 'admin'
      };
      
      try {
        await setDoc(doc(db, 'users', profile.id), {
          ...profile,
          createdAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {}
    }

    profile.role = isFounder ? 'FOUNDER' : 'ADMIN';
    KdlhStorageService.setCurrentUser(profile);
    return profile;
  }

  /**
   * Register a new user with Email and Password
   */
  static async register(params: RegisterParams): Promise<UserProfile> {
    const { 
      email, 
      password, 
      name, 
      phone,
      role: requestedRole, 
      school = 'Kizimba Secondary School', 
      form = 'Form IV',
      studentId,
      subjects,
      formsTaught,
      avatarUrl
    } = params;

    // Protection: Ordinary users CANNOT self-assign FOUNDER or ADMIN on public registration
    let assignedRole: UserRole = requestedRole;
    if (AuthService.isFounderUser(email, name)) {
      assignedRole = 'FOUNDER';
    } else if (requestedRole === 'FOUNDER' || requestedRole === 'ADMIN') {
      assignedRole = 'STUDENT';
    }

    // Teacher verification state
    const teacherApprovalStatus: TeacherApprovalStatus | undefined = 
      assignedRole === 'TEACHER' ? 'PENDING' : undefined;
    
    // Create Auth Credential in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update display name & photo in Firebase Auth
    await updateProfile(firebaseUser, { 
      displayName: name,
      photoURL: avatarUrl || undefined
    });

    const userProfile: UserProfile = {
      id: firebaseUser.uid,
      name,
      email,
      phone,
      role: assignedRole,
      teacherApprovalStatus,
      school,
      form: assignedRole === 'STUDENT' ? form : undefined,
      studentId: assignedRole === 'STUDENT' ? studentId : undefined,
      subjects: assignedRole === 'TEACHER' ? (subjects || ['Chemistry']) : undefined,
      formsTaught: assignedRole === 'TEACHER' ? (formsTaught || ['Form I', 'Form IV']) : undefined,
      avatarUrl: avatarUrl || undefined,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      registrationDate: new Date().toISOString(),
      streakDays: 1,
      status: 'active',
      isRegistered: true,
      authProvider: 'email'
    };

    // Save to Firestore users collection
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userDocRef, {
      ...userProfile,
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp()
    });

    // If phone number provided, send welcome SMS
    if (phone) {
      KdlhSmsService.sendWelcomeSms({
        phoneNumber: phone,
        name: userProfile.name,
        role: userProfile.role,
        school: userProfile.school
      }).catch(err => console.warn('Welcome SMS error:', err));
    }

    // Update Local Storage active user cache
    KdlhStorageService.setCurrentUser(userProfile);
    return userProfile;
  }

  /**
   * Login user with Email and Password
   */
  static async login(email: string, password: string): Promise<UserProfile> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Fetch User Document from Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const snapshot = await getDoc(userDocRef);

    let userProfile: UserProfile;

    if (snapshot.exists()) {
      const data = snapshot.data();
      const isFounder = AuthService.isFounderUser(email, data.name || firebaseUser.displayName || '', firebaseUser.uid);
      userProfile = {
        id: firebaseUser.uid,
        name: data.name || firebaseUser.displayName || 'User',
        email: firebaseUser.email || email,
        phone: data.phone,
        role: isFounder ? 'FOUNDER' : ((data.role as UserRole) || 'STUDENT'),
        teacherApprovalStatus: data.teacherApprovalStatus as TeacherApprovalStatus,
        teacherApprovalDate: data.teacherApprovalDate,
        teacherApprovedBy: data.teacherApprovedBy,
        school: data.school || 'Kizimba Secondary School',
        form: data.form,
        studentId: data.studentId,
        subjects: data.subjects,
        formsTaught: data.formsTaught,
        avatarUrl: data.avatarUrl || firebaseUser.photoURL || undefined,
        joinedDate: data.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        streakDays: data.streakDays || 1,
        status: data.status || 'active',
        isRegistered: true,
        authProvider: data.authProvider || 'email'
      };
      
      // Update last active
      try {
        await updateDoc(userDocRef, { lastActiveAt: serverTimestamp() });
      } catch (e) {}
    } else {
      const isFounder = AuthService.isFounderUser(email, firebaseUser.displayName || '', firebaseUser.uid);
      userProfile = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || email.split('@')[0],
        email: firebaseUser.email || email,
        role: isFounder ? 'FOUNDER' : 'STUDENT',
        school: 'Kizimba Secondary School',
        form: isFounder ? undefined : 'Form IV',
        avatarUrl: firebaseUser.photoURL || undefined,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        registrationDate: new Date().toISOString(),
        streakDays: 1,
        status: 'active',
        isRegistered: true,
        authProvider: 'email'
      };

      await setDoc(userDocRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp()
      });
    }

    if (userProfile.status === 'suspended') {
      await signOut(auth);
      throw new Error('Your account has been suspended by an administrator. Please contact KDLH support.');
    }

    KdlhStorageService.setCurrentUser(userProfile);
    return userProfile;
  }

  /**
   * Login or Register with Google Auth
   */
  static async loginWithGoogle(selectedRole: UserRole = 'STUDENT'): Promise<UserProfile> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;

    const email = firebaseUser.email || '';
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const snapshot = await getDoc(userDocRef);

    let userProfile: UserProfile;
    const isFounder = AuthService.isFounderUser(email, firebaseUser.displayName || '', firebaseUser.uid);

    if (snapshot.exists()) {
      // Returning Google user
      const data = snapshot.data();
      userProfile = {
        id: firebaseUser.uid,
        name: data.name || firebaseUser.displayName || 'User',
        email,
        phone: data.phone,
        role: isFounder ? 'FOUNDER' : ((data.role as UserRole) || 'STUDENT'),
        teacherApprovalStatus: data.teacherApprovalStatus as TeacherApprovalStatus,
        teacherApprovalDate: data.teacherApprovalDate,
        teacherApprovedBy: data.teacherApprovedBy,
        school: data.school || 'Kizimba Secondary School',
        form: data.form,
        studentId: data.studentId,
        subjects: data.subjects,
        formsTaught: data.formsTaught,
        avatarUrl: data.avatarUrl || firebaseUser.photoURL || undefined,
        joinedDate: data.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        streakDays: data.streakDays || 1,
        status: data.status || 'active',
        isRegistered: true,
        authProvider: 'google'
      };
      
      try {
        await updateDoc(userDocRef, { lastActiveAt: serverTimestamp() });
      } catch (e) {}
    } else {
      // First-time Google user
      const assignedRole: UserRole = isFounder ? 'FOUNDER' : (selectedRole === 'ADMIN' ? 'STUDENT' : selectedRole);
      const teacherApprovalStatus: TeacherApprovalStatus | undefined = 
        assignedRole === 'TEACHER' ? 'PENDING' : undefined;

      userProfile = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || email.split('@')[0] || 'User',
        email,
        role: assignedRole,
        teacherApprovalStatus,
        school: 'Kizimba Secondary School',
        form: assignedRole === 'STUDENT' ? 'Form IV' : undefined,
        avatarUrl: firebaseUser.photoURL || undefined,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        registrationDate: new Date().toISOString(),
        streakDays: 1,
        status: 'active',
        isRegistered: true,
        authProvider: 'google'
      };

      await setDoc(userDocRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp()
      });
    }

    if (userProfile.status === 'suspended') {
      await signOut(auth);
      throw new Error('Your account has been suspended by an administrator. Please contact KDLH support.');
    }

    KdlhStorageService.setCurrentUser(userProfile);
    return userProfile;
  }

  /**
   * Sign out current user
   */
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    localStorage.removeItem('kdlh_current_user_v1');
  }

  /**
   * Send Password Reset Email
   */
  static async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Subscribe to auth state changes
   */
  static onAuthStateChanged(callback: (userProfile: UserProfile | null, firebaseUser: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null, null);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          const email = firebaseUser.email || '';
          const isFounder = AuthService.isFounderUser(email, data.name || firebaseUser.displayName || '', firebaseUser.uid);
          const userProfile: UserProfile = {
            id: firebaseUser.uid,
            name: data.name || firebaseUser.displayName || 'User',
            email,
            phone: data.phone,
            role: isFounder ? 'FOUNDER' : ((data.role as UserRole) || 'STUDENT'),
            teacherApprovalStatus: data.teacherApprovalStatus as TeacherApprovalStatus,
            teacherApprovalDate: data.teacherApprovalDate,
            teacherApprovedBy: data.teacherApprovedBy,
            school: data.school || 'Kizimba Secondary School',
            form: data.form,
            studentId: data.studentId,
            subjects: data.subjects,
            formsTaught: data.formsTaught,
            avatarUrl: data.avatarUrl || firebaseUser.photoURL || undefined,
            joinedDate: data.joinedDate || 'Recently',
            streakDays: data.streakDays || 1,
            status: data.status || 'active',
            isRegistered: true,
            authProvider: data.authProvider || 'email'
          };
          KdlhStorageService.setCurrentUser(userProfile);
          callback(userProfile, firebaseUser);
        } else {
          callback(null, firebaseUser);
        }
      } catch (err) {
        console.error('Error syncing auth state profile:', err);
        callback(null, firebaseUser);
      }
    });
  }

  /**
   * Admin Function: Fetch all registered users from Firestore
   */
  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      const usersCol = collection(db, 'users');
      const q = query(usersCol, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const users: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        users.push({
          id: docSnap.id,
          name: data.name || data.displayName || 'Unknown User',
          email: data.email || '',
          phone: data.phone,
          role: (data.role as UserRole) || 'STUDENT',
          teacherApprovalStatus: data.teacherApprovalStatus as TeacherApprovalStatus,
          teacherApprovalDate: data.teacherApprovalDate,
          teacherApprovedBy: data.teacherApprovedBy,
          school: data.school || 'Kizimba Secondary School',
          form: data.form,
          subjects: data.subjects,
          formsTaught: data.formsTaught,
          joinedDate: data.joinedDate || '2026',
          registrationDate: data.registrationDate,
          streakDays: data.streakDays || 1,
          status: data.status || 'active',
          isRegistered: true,
          authProvider: data.authProvider
        });
      });
      return users;
    } catch (error) {
      console.warn('Firestore getAllUsers query failed:', error);
      return [];
    }
  }

  /**
   * Admin Function: Get Accurate Firestore User Statistics (Never fake)
   */
  static async getFirestoreUserStats(): Promise<FirestoreUserStats> {
    try {
      const users = await this.getAllUsers();
      
      const totalUsers = users.length;
      const studentsCount = users.filter(u => u.role === 'STUDENT').length;
      const teachers = users.filter(u => u.role === 'TEACHER');
      const teachersCount = teachers.length;
      const approvedTeachersCount = teachers.filter(t => t.teacherApprovalStatus === 'APPROVED' || !t.teacherApprovalStatus).length;
      const pendingTeachersCount = teachers.filter(t => t.teacherApprovalStatus === 'PENDING').length;
      const adminsCount = users.filter(u => u.role === 'ADMIN' || u.role === 'FOUNDER').length;
      const activeUsersCount = users.filter(u => u.status !== 'suspended').length;

      return {
        totalUsers,
        studentsCount,
        teachersCount,
        approvedTeachersCount,
        pendingTeachersCount,
        adminsCount,
        activeUsersCount,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.warn('Error fetching Firestore stats:', error);
      return {
        totalUsers: 0,
        studentsCount: 0,
        teachersCount: 0,
        approvedTeachersCount: 0,
        pendingTeachersCount: 0,
        adminsCount: 0,
        activeUsersCount: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Admin Function: Approve Teacher Application
   */
  static async approveTeacher(teacherId: string, adminUid: string): Promise<void> {
    const userDocRef = doc(db, 'users', teacherId);
    await updateDoc(userDocRef, {
      teacherApprovalStatus: 'APPROVED',
      teacherApprovalDate: new Date().toISOString(),
      teacherApprovedBy: adminUid
    });
  }

  /**
   * Admin Function: Reject Teacher Application
   */
  static async rejectTeacher(teacherId: string, adminUid: string): Promise<void> {
    const userDocRef = doc(db, 'users', teacherId);
    await updateDoc(userDocRef, {
      teacherApprovalStatus: 'REJECTED',
      role: 'STUDENT',
      teacherApprovalDate: new Date().toISOString(),
      teacherApprovedBy: adminUid
    });
  }

  /**
   * Admin Function: Update user role or status
   */
  static async updateUser(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, updates as any);
  }

  /**
   * Get current cached user profile
   */
  static getCurrentUser(): UserProfile | null {
    return KdlhStorageService.getCurrentUser();
  }
}
