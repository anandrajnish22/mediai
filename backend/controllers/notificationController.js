const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ success: true, data: notifications, unreadCount });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
