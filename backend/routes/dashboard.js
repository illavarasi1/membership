const express=require('express')
const mongoose = require('mongoose'); 
const router=express.Router()
const Renew=require('./../db/renew')
const Members=require('./../db/members')
const Membertype=require('./../db/membership_type')
const Setting=require('./../db/settings')

// Get total members count
router.get('/total-members', async (req, res) => {
    const totalMembers = await Members.countDocuments();
    res.json({ totalMembers });
});

// Get total membership types count
router.get('/total-membership-types', async (req, res) => {
    const totalMembershipTypes = await Membertype.countDocuments();
    res.json({ totalMembershipTypes });
});

// Get expiring soon count
router.get('/expiring-soon', async (req, res) => {
    const expiringSoonCount = await Members.countDocuments({
        expiry_date: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });
    res.json({ expiringSoonCount });
});

// Get total revenue
router.get('/total-revenue', async (req, res) => {
    const totalRevenue = await Renew.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$total_amount' } } }
    ]);
    const settings = await Setting.findOne();
    res.json({ totalRevenue: totalRevenue[0]?.totalRevenue || 0, currency: settings?.currency || '$' });
});

// Get new members in the last 24 hours
router.get('/new-members', async (req, res) => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newMembersCount = await Members.countDocuments({ created_at: { $gte: twentyFourHoursAgo } });
    res.json({ newMembersCount });
});

// Get expired members count
router.get('/expired-members', async (req, res) => {
    const expiredMembersCount = await Members.countDocuments({ expiry_date: { $lt: new Date() } });
    res.json({ expiredMembersCount });
});

// Get recently joined members
router.get('/recent-members', async (req, res) => {
    try {
        const recentMembers = await Members.find().sort({ created_at: -1 }).limit(4) .populate('membership_type');;
        const membersWithPhotos = recentMembers.map(member => {
            return {
                ...member._doc,
                photo: `${req.protocol}://${req.get('host')}/${member.photo}` // Create full URL for photo
            };
        });
        res.json(membersWithPhotos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent members' });
    }
});

module.exports = router;