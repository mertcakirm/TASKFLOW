require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const context = require('./src/context/context');

const PORT = process.env.PORT || 3000; 

const httpServer = http.createServer(app);

const startServer = async () => {
    try {
        await context.sequelize.authenticate();
        console.log('Veritabanı bağlantısı başarıyla sağlandı.');

        
        await context.sequelize.sync({ alter: true });
        console.log('Tüm modeller veritabanı ile senkronize edildi.');

        httpServer.listen(PORT, () => {
            console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Veritabanı başlatılırken hata oluştu:', error);
    }
};

startServer();