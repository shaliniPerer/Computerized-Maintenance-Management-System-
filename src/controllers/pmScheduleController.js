const PMSchedule = require('../models/PMSchedule');
const Notification = require('../models/Notification');

/**
 * @desc    GET all PM schedules (role-based)
 * @route   GET /api/pm-schedules
 * @access  Private
 */
exports.getAllPMSchedules = async (req, res) => {
  try {
    const { frequency, status, search, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };

    
    if (req.user.role === 'Technician') {
     
      filter.assignedTo = req.user._id;
    }

    if (req.user.role === 'Staff') {
      
      return res.status(200).json({
        success: true,
        total: 0,
        page: 1,
        pages: 0,
        data: [],
      });
    }

    if (frequency && frequency !== 'All') filter.frequency = frequency;
    if (status && status !== 'All') filter.status = status;

    if (search) {
      filter.$or = [
        { pmId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { asset: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const pmSchedules = await PMSchedule.find(filter)
      .populate('assignedTo', '_id name email role')
      .populate('createdBy', '_id name email')
      .sort({ nextDueDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PMSchedule.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: pmSchedules,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    GET single PM schedule
 * @route   GET /api/pm-schedules/:id
 * @access  Private
 */
exports.getPMSchedule = async (req, res) => {
  try {
    const pmSchedule = await PMSchedule.findById(req.params.id)
      .populate('assignedTo', '_id name email role')
      .populate('createdBy', '_id name email')
      .populate('checklist.completedBy', '_id name');

    if (!pmSchedule)
      return res.status(404).json({ success: false, message: 'PM schedule not found' });

    
    if (
      req.user.role === 'Technician' &&
      pmSchedule.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

 
    if (req.user.role === 'Staff') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: pmSchedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    CREATE PM schedule
 * @route   POST /api/pm-schedules
 * @access  Private
 */
exports.createPMSchedule = async (req, res) => {
  try {
    const { assignedTo, ...rest } = req.body;
    const pmId = `PM-${Date.now()}`;

    const pmSchedule = new PMSchedule({
      ...rest,
      pmId,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
    });

    await pmSchedule.save();


    if (assignedTo) {
      await Notification.create({
        user: assignedTo,
        type: 'pm',
        title: 'New PM Task Assigned',
        message: `You have been assigned PM task: ${pmId}`,
        relatedId: pmSchedule._id,
        relatedModel: 'PMSchedule',
      });
    }

    await pmSchedule.populate('assignedTo', '_id name email role');
    await pmSchedule.populate('createdBy', '_id name email');

    res.status(201).json({ success: true, data: pmSchedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    UPDATE PM schedule
 * @route   PUT /api/pm-schedules/:id
 * @access  Private
 */
exports.updatePMSchedule = async (req, res) => {
  try {
    const pmSchedule = await PMSchedule.findById(req.params.id);
    if (!pmSchedule)
      return res.status(404).json({ success: false, message: 'PM schedule not found' });

    Object.assign(pmSchedule, req.body);
    await pmSchedule.save();

    await pmSchedule.populate('assignedTo', '_id name email role');
    await pmSchedule.populate('createdBy', '_id name email');

    res.status(200).json({ success: true, data: pmSchedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    COMPLETE PM task
 * @route   POST /api/pm-schedules/:id/complete
 * @access  Private
 */
exports.completePMTask = async (req, res) => {
  try {
    const pmSchedule = await PMSchedule.findById(req.params.id);
    if (!pmSchedule)
      return res.status(404).json({ success: false, message: 'PM schedule not found' });

    pmSchedule.status = 'Completed';
    pmSchedule.lastCompletedDate = Date.now();

    await pmSchedule.save();
    res.status(200).json({ success: true, data: pmSchedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    DELETE PM schedule (Soft delete)
 * @route   DELETE /api/pm-schedules/:id
 * @access  Admin
 */
exports.deletePMSchedule = async (req, res) => {
  try {
    const pmSchedule = await PMSchedule.findById(req.params.id);
    if (!pmSchedule)
      return res.status(404).json({ success: false, message: 'PM schedule not found' });

    pmSchedule.isActive = false;
    await pmSchedule.save();

    res.status(200).json({ success: true, message: 'PM schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

