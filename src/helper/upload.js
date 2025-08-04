const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Fungsi bantu untuk slugify nama
const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // ganti spasi dengan -
    .replace(/[^\w\-]+/g, '')       // hapus karakter aneh
    .replace(/\-\-+/g, '-')         // ganti -- jadi -
    .replace(/^-+/, '')             // trim -
    .replace(/-+$/, '');
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const namaLengkap = req.body.nama_lengkap || 'user';
    return {
      folder: 'hris_employees',
      format: 'jpg',
      public_id: slugify(namaLengkap) + Date.now(), // 💡 Nama file dari nama_lengkap
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    };
  }
});

const upload = multer({ storage });

module.exports = upload;
