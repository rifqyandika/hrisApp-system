const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    nama_lengkap: {
        type: String
    },
    tanggal: {
        type: String, // Format: "YYYY-MM-DD"
        required: true
    },
    jam_masuk: {
        type: String // Format: "HH:mm" misal "08:12"
    },
    jam_keluar: {
        type: String
    },
    status: {
        type: String,
        enum: ['Hadir', 'Sakit', 'Cuti', 'Alpha', 'Izin', 'Lembur'],
        default: 'Alpha'
    },
    keterangan: {
        type: String
    },
    lokasi: {
        type: String
    },
    device: {
        type: String // Web, Mobile, atau nama device
    }
}, { timestamps: true });

presenceSchema.index({ employee_id: 1, tanggal: 1 }, { unique: true }); // 1 data per hari per karyawan

module.exports = mongoose.model('Presence', presenceSchema);
