const mongoose = require('mongoose');

// Pagination middleware
const paginationMiddleware = (model) => {
    return async (req, res, next) => {
        const { page = 1, limit = 10, search = '' } = req.query;

        // Pagination parameters
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Optional search filter
        const searchFilter = search
            ? { $or: [{ type: { $regex: search, $options: 'i' } },
                 { name: { $regex: search, $options: 'i' } },
                 { fullname: { $regex: search, $options: 'i' } } 
                ] }
            : {};

        try {
            // Get total documents and filtered data
            const [data, total] = await Promise.all([
                model.find(searchFilter).skip(skip).limit(limitNumber),
                model.countDocuments(searchFilter),
            ]);

            // Add pagination data to the request object
            res.pagination = {
                data,
                totalRecords: total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            };

            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
};

module.exports = paginationMiddleware;
