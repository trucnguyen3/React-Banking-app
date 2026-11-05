const BASE_URL = 'https://api-uat1.akadigital.net/api';

export const apiService = {
  // 1. Đăng ký tài khoản mới (Lưu vào bảng demo_app_users)
  registerUser: async (data: {
    fullName: string;
    phoneNumber: string;
    email: string;
    idCardNumber?: string;
  }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json(); 
    // Server trả về: { success: true, userId: 'USR12345', sessionToken: 'xxx' }
  },

  // 2. Đăng nhập / Xác thực số điện thoại
  loginUser: async (phoneNumber: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    });
    return await res.json();
    // Server trả về: { success: true, userId: 'USR12345', sessionToken: 'xxx', fullName: '...' }
  },

  // 3. Lấy thông tin Profile
  getUserProfile: async (userId: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}`);
    return await res.json();
  },

  // 4. Tạo giao dịch (Transfer, Bill, QR)
  createTransaction: async (data: {
    userId: string;
    transactionType: 'transfer' | 'payment' | 'qrcode';
    amount: number;
    recipientAccount: string;
    note?: string;
  }) => {
    const res = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  depositFunds: async (data: { userId: string; amount: number }) => {
    const response = await fetch('https://api-uat1.akadigital.net/api/wallet/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  updateUserProfile: async (data: {
    userId: string;
    fullName: string;
    phoneNumber: string;
    email: string;
  }) => {
    const res = await fetch(`${BASE_URL}/users/update`, { // Khớp với app.put('/api/users/update')
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  applyForCard: async (data: {
    userId: string;
    cardType: string;
    cardCategory: string;
  }) => {
    const res = await fetch(`${BASE_URL}/cards/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // Lấy danh sách thẻ của user
  getUserCards: async (userId: string) => {
    const res = await fetch(`${BASE_URL}/cards/user/${userId}`);
    return await res.json();
  },
};