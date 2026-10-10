const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');
const { ROLES } = require('../constants/enums');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register({ email, password, name }) {
    // 1. Email kullanımda mı kontrol et
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Bu email adresi zaten kullanımda.');
      error.statusCode = 409;
      throw error;
    }

    // 2. Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Yeni kullanıcıyı oluştur (Varsayılan rol: user)
    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: ROLES ? ROLES.USER : 'user',
    });

    return this.buildAuthResponse(newUser);
  }

  async login({ email, password }) {
    // 1. Kullanıcıyı email ile bul
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

  // RESPONSE BUILDER
  buildAuthResponse(user) {
    const token = signToken({ id: user.id, role: user.role });
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

module.exports = AuthService;