const users = [
  {
    id: 1,
    username: 'admin',
    fullName: 'Admin CloudNest',
    email: 'admin@cloudnest.com',
    phone: '081234567890',
    age: 30,
    gender: 'Laki-laki',
    password: 'password123',
    role: 'admin', // Role admin
  },
  {
    id: 2,
    username: 'johndoe',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '089876543210',
    age: 25,
    gender: 'Laki-laki',
    password: 'password123',
    role: 'user', // Role user
  },
];

// Fungsi untuk simulasi login
export const loginUser = ({ identifier, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        (u) =>
          u.username === identifier ||
          u.email === identifier ||
          u.phone === identifier
      );

      if (!user) {
        reject(new Error('Username, Email, atau No. HP tidak ditemukan'));
      }

      if (user.password !== password) {
        reject(new Error('Password salah'));
      }

      resolve({ id: user.id, fullName: user.fullName, role: user.role });
    }, 1000); // delay 1 detik
  });
};

// Fungsi untuk simulasi register
export const registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userExists = users.some(u => u.username === userData.username || u.email === userData.email);
            if (userExists) {
                reject(new Error('Username atau Email sudah terdaftar'));
            } else {
                const newUser = { id: users.length + 1, ...userData, role: 'user' };
                users.push(newUser);
                console.log('Database users terbaru:', users);
                resolve(newUser);
            }
        }, 1000);
    });
};
