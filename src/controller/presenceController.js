const response = require('../helper/res')
const presenceModels = require('../models/presenceModels')
const employeeModels = require('../models/employeeModels')
const dayjs = require('dayjs')

const presence = {
    getPresence: async (req, res) => {
        try {
            const payload = await presenceModels.find()
            return response.success(res, payload, 'Presence Data')
        } catch (err) {
            response.failed(res, err.message);
        }
    },
    signPresence: async (req, res) => {
        try {
            const { employee_id } = req.body;
            if (!employee_id) return response.failed(res, 'employee_id required');
            const today = dayjs().format('YYYY-MM-DD');
            const now = dayjs().format('HH:mm');
            const existing = await presenceModels.findOne({ employee_id, tanggal: today });
            if (existing && existing.jam_masuk) {
                return response.failed(res, 'You already presence');
            }
            let presence;
            if (existing) {
                existing.jam_masuk = now;
                existing.status = 'Hadir';
                presence = await existing.save();
            } else {
                const data = await employeeModels.findById(employee_id)
                presence = await presenceModels.create({
                    employee_id,
                    nama_lengkap: data.nama_lengkap,
                    tanggal: today,
                    jam_masuk: now,
                    status: 'Hadir'
                });
            }
            response.success(res, presence, 'Presence success');
        } catch (err) {
            response.failed(res, err.message);
        }
    },
    signoutPresence: async (req, res) => {
        try {
            const { employee_id } = req.body
            if (!employee_id) return response.failed(res, 'employee_id required');
            const today = dayjs().format('YYYY-MM-DD');
            const now = dayjs().format('HH:mm');
            const presence = await presenceModels.findOne({ employee_id, tanggal: today });
            if (!presence || !presence.jam_masuk) {
                return response.failed(res, 'You have not presence yet');
            }
            if (presence.jam_keluar) {
                return response.failed(res, 'You already sign out');
            }
            presence.jam_keluar = now;
            const updated = await presence.save();
            response.success(res, updated, 'Sign out success');
        } catch (err) {
            response.failed(res, err.message);
        }
    },
    getPresenceByEmployee: async (req, res) => {
        try {
            const { employee_id } = req.params
            const presenceData = await presenceModels.find({ employee_id }).sort({ tanggal: -1 });
            if(!presenceData || presenceData.length === 0) {
                return response.failed(res, 'No presence data found for this employee');
            }
            response.success(res, presenceData, 'Get employee presence');
        } catch (err) {
            response.failed(res, err.message);
        }
    }
}

module.exports = presence