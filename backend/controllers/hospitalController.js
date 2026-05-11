const Hospital = require('../models/Hospital');

// @desc    Get all hospitals
// @route   GET /api/hospitals
const getHospitals = async (req, res) => {
  try {
    const { search, city, department, emergency, page = 1, limit = 10, lat, lng, radius = 10 } = req.query;
    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (department) query.departments = { $in: [new RegExp(department, 'i')] };
    if (emergency === 'true') query.isEmergencyAvailable = true;

    let hospitals;

    // Geolocation search
    if (lat && lng) {
      hospitals = await Hospital.find({
        ...query,
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: parseInt(radius) * 1000
          }
        }
      })
        .populate('doctors', 'name specialization avatar rating')
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    } else {
      hospitals = await Hospital.find(query)
        .populate('doctors', 'name specialization avatar rating')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ rating: -1 });
    }

    const total = await Hospital.countDocuments(query);

    res.json({
      success: true,
      data: hospitals,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single hospital
// @route   GET /api/hospitals/:id
const getHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
      .populate('doctors', 'name specialization avatar rating experience consultationFee qualifications');

    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create hospital (admin)
// @route   POST /api/hospitals
const createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({ success: true, message: 'Hospital created', data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update hospital (admin)
// @route   PUT /api/hospitals/:id
const updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }
    res.json({ success: true, message: 'Hospital updated', data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete hospital (admin)
// @route   DELETE /api/hospitals/:id
const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }
    res.json({ success: true, message: 'Hospital deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get nearby hospitals
// @route   GET /api/hospitals/nearby
const getNearbyHospitals = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const hospitals = await Hospital.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius) * 1000
        }
      }
    }).limit(20);

    // Calculate approximate distance
    const hospitalsWithDistance = hospitals.map(h => {
      const R = 6371; // Earth's radius in km
      const dLat = ((h.location.coordinates[1] - lat) * Math.PI) / 180;
      const dLng = ((h.location.coordinates[0] - lng) * Math.PI) / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) * Math.cos((h.location.coordinates[1] * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = (R * c).toFixed(1);

      return { ...h.toObject(), distance: parseFloat(distance) };
    });

    res.json({ success: true, data: hospitalsWithDistance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getHospitals, getHospital, createHospital, updateHospital, deleteHospital, getNearbyHospitals };
