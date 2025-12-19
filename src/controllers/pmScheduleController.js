const PMSchedule = require('../models/PMSchedule');
const Notification = require('../models/Notification');

// @desc    Get all PM schedules
// @route   GET /api/pm-schedules
// @access  Private
exports.getAllPMSchedules = async (req, res) => {
  try {
    const { frequency, status, search, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { isActive: true };
    if (frequency) filter.frequency = frequency;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { pmId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { asset: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const pmSchedules = await PMSchedule.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ nextDueDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PMSchedule.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: pmSchedules.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: pmSchedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single PM schedule
// @route   GET /api/pm-schedules/:id
// @access  Private
exports.getPMSchedule = async (req, res) => {
  try {
    const pmSchedule = await PMSchedule.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .populate('checklist.completedBy', 'name');

    if (!pmSchedule) {
      return res.status(404).json({
        success: false,
        message: 'PM schedule not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pmSchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create PM schedule
// @route   POST /api/pm-schedules
// @access  Private
exports.createPMSchedule = async (req, res) => {
  try {
    const { title, description, asset, frequency, nextDueDate, assignedTo, checklist } = req.body;

    const pmSchedule = await PMSchedule.create({
      title,
      description,
      asset,
      frequency,
      nextDueDate,
      assignedTo,
      checklist: checklist || [],
      createdBy: req.user.id
    });

    await pmSchedule.populate('assignedTo', 'name email');
    await pmSchedule.populate('createdBy', 'name email');

    // Create notification for assigned user
    if (assignedTo) {
      await Notification.create({
        user: assignedTo,
        type: 'pm',
        title: 'New PM Task Assigned',
        message: `You have been assigned PM task: ${pmSchedule.pmId}`,
        relatedId: pmSchedule._id,
        relatedModel: 'PMSchedule'
      });
    }

    res.status(201).json({
      success: true,
      data: pmSchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update PM schedule
// @route   PUT /api/pm-schedules/:id
// @access  Private
exports.updatePMSchedule = async (req, res) => {
  try {
    let pmSchedule = await PMSchedule.findById(req.params.id);

    if (!pmSchedule) {
      return res.status(404).json({
        success: false,
        message: 'PM schedule not found'
      });
    }

    pmSchedule = await PMSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('assignedTo', 'name email')
     .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: pmSchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Complete PM task
// @route   POST /api/pm-schedules/:id/complete
// @access  Private
exports.completePMTask = async (req, res) => {
  try {
    const { completionNotes, checklist } = req.body;
    const pmSchedule = await PMSchedule.findById(req.params.id);

    if (!pmSchedule) {
      return res.status(404).json({
        success: false,
        message: 'PM schedule not found'
      });
    }

    pmSchedule.status = 'Completed';
    pmSchedule.lastCompletedDate = Date.now();
    pmSchedule.completionNotes = completionNotes;
    
    if (checklist) {
      pmSchedule.checklist = checklist;
    }

    // Calculate next due date based on frequency
    const currentDate = new Date(pmSchedule.nextDueDate);
    let nextDate = new Date(currentDate);

    switch (pmSchedule.frequency) {
      case 'Daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'Weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'Monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'Quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'Annually':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    pmSchedule.nextDueDate = nextDate;
    pmSchedule.status = 'Scheduled'; // Reset status for next occurrence

    await pmSchedule.save();

    res.status(200).json({
      success: true,
      data: pmSchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete PM schedule
// @route   DELETE /api/pm-schedules/:id
// @access  Private (Admin only)
exports.deletePMSchedule = async (req, res) => {
  try {
    const pmSchedule = await PMSchedule.findById(req.params.id);

    if (!pmSchedule) {
      return res.status(404).json({
        success: false,
        message: 'PM schedule not found'
      });
    }

    // Soft delete
    pmSchedule.isActive = false;
    await pmSchedule.save();

    res.status(200).json({
      success: true,
      message: 'PM schedule deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};