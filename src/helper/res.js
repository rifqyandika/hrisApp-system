const response = {
    success: (res, data, message) => {
        const result = {
            code: 200,
            status: true,
            message: message,
            data: data
        }
        res.json(result)
    },
    failed: (res, data, message) => {
        const result = {
            code: 500,
            status: false,
            message: message,
            data : data
        }
        res.json(result)
    },
    meta: (res, data, meta, message) => {
        const result = {
            status: 200,
            message: message,
            meta: meta,
            data: data
        }
        res.json(result)
    }
}

module.exports = response