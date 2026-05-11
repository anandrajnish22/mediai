const Emergency = require('../models/Emergency');
const Notification = require('../models/Notification');

const createEmergency = async (req, res) => {
  try {
    const { coordinates, address, emergencyType, description } = req.body;
    const emergency = await Emergency.create({
      user: req.user._id,
      location: { type: 'Point', coordinates: coordinates || [0, 0] },
      address: address || '', emergencyType: emergencyType || 'medical',
      description: description || ''
    });
    // Notify emergency contacts
    if (req.user.emergencyContacts && req.user.emergencyContacts.length > 0) {
      emergency.contactsNotified = req.user.emergencyContacts.map(c => ({
        name: c.name, phone: c.phone, notifiedAt: new Date()
      }));
      await emergency.save();
    }
    res.status(201).json({ success: true, message: 'Emergency SOS sent!', data: emergency });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getEmergencies = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const emergencies = await Emergency.find(query).populate('user', 'name phone').sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: emergencies });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const updateEmergency = async (req, res) => {
  try {
    const emergency = await Emergency.findByIdAndUpdate(req.params.id, {
      status: req.body.status, resolvedAt: req.body.status === 'resolved' ? new Date() : undefined
    }, { new: true });
    if (!emergency) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: emergency });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { createEmergency, getEmergencies, updateEmergency };
