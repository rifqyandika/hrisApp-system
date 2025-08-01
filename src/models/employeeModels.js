const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    nama_lengkap: { type: String, required: true },
    nik: { type: String, required: true, unique: true },
    email: String,
    no_hp: String,
    jabatan: { type: String, required: true },
    tanggal_masuk: { type: Date, required: true },
    tempat_lahir: String,
    tanggal_lahir: Date,
    alamat: String,
    status_karyawan: String
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);

