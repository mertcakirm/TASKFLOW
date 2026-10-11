const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');
const { ROLES } = require('../constants/enums');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

async register({ email, password, name }) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Bu email adresi zaten kullanımda.');
      error.statusCode = 409;
      throw error;
    }

    // 2. Sistemdeki toplam kullanıcı sayısının kontrol  (İlk kullanıcı mı?)
    const userCount = await this.userRepository.model.count();

    // 3. Rol belirleme: Eğer hiç kullanıcı yoksa ilk kullanıcı Manager olur
    let assignedRole = ROLES ? ROLES.USER : 'user';
    if (userCount === 0) {
      assignedRole = ROLES && ROLES.MANAGER ? ROLES.MANAGER : 'manager';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: assignedRole,
    });

    return this.buildAuthResponse(newUser);
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Geçersiz email veya şifre.');
      error.statusCode = 401;
      throw error;
    }

    // 2. Şifre doğrulama
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Geçersiz email veya şifre.');
      error.statusCode = 401;
      throw error;
    }

    return this.buildAuthResponse(user);
  }

  async changePassword(id, data) {
    const { oldPassword, newPassword } = data;

    if (!oldPassword || !newPassword) {
      const error = new Error('Eski şifre ve yeni şifre zorunludur.');
      error.statusCode = 400;
      throw error;
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      const error = new Error('Kullanıcı bulunamadı.');
      error.statusCode = 404;
      throw error;
    }
    
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      const error = new Error('Eski şifre yanlış.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.changePassword(id, hashedPassword);

    return { message: 'Şifre başarıyla güncellendi.' };
  }

  buildAuthResponse(user) {
    const token = signToken({ id: user.id, role: user.role });
    return {
      token,
      role: user.role,
    };
  }
}

module.exports = AuthService;