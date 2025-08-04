const response = require('../helper/res')
const presenceModels = require('../models/presenceModels')
const employeeModels = require('../models/employeeModels')
const dayjs = require('dayjs')
const { get } = require('mongoose')
const ExcelJS = require('exceljs');

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
            if (!presenceData || presenceData.length === 0) {
                return response.failed(res, 'No presence data found for this employee');
            }
            response.success(res, presenceData, 'Get employee presence');
        } catch (err) {
            response.failed(res, err.message);
        }
    },
    submissionPresence: async (req, res) => {
        try {
            const { employee_id, tanggal, status, keterangan } = req.body;
            if (!employee_id || !tanggal || !keterangan) {
                return response.failed(res, 'employee_id, tanggal, and keterangan are required');
            }
            const dateFormat = dayjs(tanggal).format('YYYY-MM-DD')
            const exist = await presenceModels.findOne({ employee_id, tanggal: dateFormat });
            if (exist) {
                return response.failed(res, 'Presence already submitted for this date');
            } else {
                const getData = await employeeModels.findById(employee_id)
                const data = await presenceModels.create({
                    employee_id,
                    nama_lengkap: getData.nama_lengkap,
                    tanggal: dateFormat,
                    status,
                    keterangan: keterangan || null
                });

                response.success(res, data, 'Presence submission success');
            }
        } catch (err) {
            response.failed(res, err.message);
        }
    },
    getWeeklyPresence: async (req, res) => {
        try {
            const { employee_id } = req.params;
            const employee = await employeeModels.findById(employee_id);
            if (!employee) return response.failed(res, 'Employee not found');
            const today = dayjs();
            const startDate = today.subtract(6, 'day').format('YYYY-MM-DD');
            const endDate = today.format('YYYY-MM-DD');
            const data = await presenceModels.find({
                employee_id,
                tanggal: {
                    $gte: startDate,
                    $lte: endDate
                }
            })
            const summary = {
                nama_lengkap: employee.nama_lengkap,
                hadir: 0,
                izin: 0,
                sakit: 0,
                cuti: 0,
                alpha: 0,
                lembur: 0
            };
            for (const record of data) {
                const status = record.status?.toLowerCase();
                if (summary[status] !== undefined) {
                    summary[status]++;
                }
            }
            // Tambahkan jumlah alpha jika ada hari tanpa kehadiran
            const recordedDates = data.map(item => item.tanggal);
            for (let i = 0; i < 7; i++) {
                const checkDate = today.subtract(i, 'day').format('YYYY-MM-DD');
                if (!recordedDates.includes(checkDate)) {
                    summary.alpha++;
                }
            }
            return response.success(res, summary, 'Rekap kehadiran mingguan');
        } catch (err) {
            response.failed(res, err.message);
        }
    },
    getMonthlyPresence: async (req, res) => {
        try {
            const { employee_id } = req.params;
            const today = dayjs();
            const startOfMonth = today.startOf('month').format('YYYY-MM-DD');
            const endOfMonth = today.endOf('month').format('YYYY-MM-DD');

            const employee = await employeeModels.findById(employee_id);
            if (!employee) return response.failed(res, 'Karyawan tidak ditemukan');

            const data = await presenceModels.find({
                employee_id,
                tanggal: { $gte: startOfMonth, $lte: endOfMonth }
            });

            const summary = {
                nama_lengkap: employee.nama_lengkap,
                bulan: today.format('MMMM YYYY'),
                hadir: 0,
                izin: 0,
                sakit: 0,
                cuti: 0,
                alpha: 0,
                lembur: 0
            };

            const recordedDates = data.map(d => d.tanggal);

            for (const item of data) {
                const status = item.status?.toLowerCase();
                if (summary[status] !== undefined) {
                    summary[status]++;
                }
            }

            // Hitung alpha jika ada tanggal kerja tanpa data
            const totalDays = today.daysInMonth();
            for (let i = 1; i <= totalDays; i++) {
                const d = dayjs().date(i).format('YYYY-MM-DD');
                if (!recordedDates.includes(d)) {
                    summary.alpha++;
                }
            }

            response.success(res, summary, 'Rekap kehadiran bulanan');
        } catch (err) {
            response.failed(res, err.message);
        }
    },
    recapPresence: async (req, res) => {
        try {
            const { month } = req.query;
            const targetMonth = month ? dayjs(`${month}-01`) : dayjs(); // Format: YYYY-MM
            const startOfMonth = targetMonth.startOf('month').format('YYYY-MM-DD');
            const endOfMonth = targetMonth.endOf('month').format('YYYY-MM-DD');
            const totalDays = targetMonth.daysInMonth();

            const employees = await employeeModels.find();
            const hasil = [];

            for (const emp of employees) {
                const data = await presenceModels.find({
                    employee_id: emp._id,
                    tanggal: { $gte: startOfMonth, $lte: endOfMonth }
                });

                const summary = {
                    nama_lengkap: emp.nama_lengkap,
                    bulan: targetMonth.format('MMMM YYYY'),
                    hadir: 0,
                    izin: 0,
                    sakit: 0,
                    cuti: 0,
                    alpha: 0,
                    lembur: 0
                };

                const recordedDates = data.map(d => d.tanggal);

                for (const item of data) {
                    const status = item.status?.toLowerCase();
                    if (summary[status] !== undefined) {
                        summary[status]++;
                    }
                }

                // Hitung alpha
                for (let i = 1; i <= totalDays; i++) {
                    const d = targetMonth.date(i).format('YYYY-MM-DD');
                    if (!recordedDates.includes(d)) {
                        summary.alpha++;
                    }
                }

                hasil.push(summary);
            }

            response.success(res, hasil, `Rekap bulanan semua karyawan untuk bulan ${targetMonth.format('MMMM YYYY')}`);
        } catch (err) {
            response.failed(res, err.message);
        }
    },
    recapExport: async (req, res) => {
        try {
            const { month } = req.query;
            const targetMonth = month ? dayjs(`${month}-01`) : dayjs();
            const startOfMonth = targetMonth.startOf('month').format('YYYY-MM-DD');
            const endOfMonth = targetMonth.endOf('month').format('YYYY-MM-DD');
            const totalDays = targetMonth.daysInMonth();

            const employees = await employeeModels.find();
            const hasil = [];

            for (const emp of employees) {
                const data = await presenceModels.find({
                    employee_id: emp._id,
                    tanggal: { $gte: startOfMonth, $lte: endOfMonth }
                });

                const summary = {
                    nama_lengkap: emp.nama_lengkap,
                    hadir: 0,
                    izin: 0,
                    sakit: 0,
                    cuti: 0,
                    alpha: 0,
                    lembur: 0
                };

                const recordedDates = data.map(d => d.tanggal);

                for (const item of data) {
                    const status = item.status?.toLowerCase();
                    if (summary[status] !== undefined) {
                        summary[status]++;
                    }
                }

                for (let i = 1; i <= totalDays; i++) {
                    const d = targetMonth.date(i).format('YYYY-MM-DD');
                    if (!recordedDates.includes(d)) {
                        summary.alpha++;
                    }
                }

                hasil.push(summary);
            }

            // Buat workbook Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Rekap Kehadiran');

            // Header
            worksheet.columns = [
                { header: 'Nama Lengkap', key: 'nama_lengkap', width: 25 },
                { header: 'Hadir', key: 'hadir', width: 10 },
                { header: 'Izin', key: 'izin', width: 10 },
                { header: 'Sakit', key: 'sakit', width: 10 },
                { header: 'Cuti', key: 'cuti', width: 10 },
                { header: 'Alpha', key: 'alpha', width: 10 },
                { header: 'Lembur', key: 'lembur', width: 10 }
            ];

            // Data
            hasil.forEach(row => worksheet.addRow(row));

            // Export file
            const fileName = `rekap-kehadiran-${targetMonth.format('MMMM-YYYY')}.xlsx`;
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

            await workbook.xlsx.write(res);
            res.end();

        } catch (err) {
            response.failed(res, err.message);
        }
    }
}

module.exports = presence