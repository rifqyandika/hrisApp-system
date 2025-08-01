const response = require('../helper/res')
const presenceModels = require('../models/presenceModels')
const dayjs = require('dayjs')

const presence = {
    getPresence: async (req, res) => {
        try {
            // const id_params = req.params.id
            const payload = await presenceModels.find()
            return response.success(res, payload, 'Presence Data')
        } catch (err) {
            response.failed(res, err.message);
        }
    },
    addPresence: async (req, res) => {
        try {
            const { employee_id } = req.body;
            if (!employee_id) return response.failed(res, 'employee_id required');
            const today = dayjs().format('YYYY-MM-DD');
            const now = dayjs().format('HH:mm');
            // Cek apakah karyawan sudah absen hari ini
            const existing = await presenceModels.findOne({ employee_id, tanggal: today });
            if (existing && existing.jam_masuk) {
                return response.failed(res, 'Sudah absen masuk hari ini');
            }
            let presence;
            if (existing) {
                existing.jam_masuk = now;
                existing.status = 'Hadir';
                presence = await existing.save();
            } else {
                presence = await presenceModels.create({
                    employee_id,
                    tanggal: today,
                    jam_masuk: now,
                    status: 'Hadir'
                });
            }
            response.success(res, presence, 'Absensi masuk berhasil');
        } catch (err) {
            response.failed(res, err.message);
        }
    }
}

module.exports = presence