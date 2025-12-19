const WorkOrder = require('../models/WorkOrder');
const Notification = require('../models/Notification');

// @desc    Get all work orders
// @route   GET /api/work-orders
// @access  Private
exports.getAllWorkOrders = async (req, res) => {
  try {
    const { category, priority, status, search, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (priority && priority !== 'All') filter.priority = priority;
    if (status && status !== 'All') filter.status = status;
    if (search) {
      filter.$or = [
        { workOrderId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const workOrders = await WorkOrder.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await WorkOrder.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: workOrders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: workOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single work order
// @route   GET /api/work-orders/:id
// @access  Private
exports.getWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .populate('notes.user', 'name')
      .populate('activityLog.user', 'name');

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: workOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create work order
// @route   POST /api/work-orders
// @access  Private
exports.createWorkOrder = async (req, res) => {
  try {
    const { title, description, category, priority, location, assignedTo } = req.body;

    const workOrder = await WorkOrder.create({
      title,
      description,
      category,
      priority,
      location,
      assignedTo,
      createdBy: req.user.id,
      activityLog: [{
        action: 'created',
        user: req.user.id,
        userName: req.user.name,
        details: 'Work order created',
        timestamp: Date.now()
      }]
    });

    // Populate fields
    await workOrder.populate('assignedTo', 'name email');
    await workOrder.populate('createdBy', 'name email');

    // Create notification for assigned user
    if (assignedTo) {
      await Notification.create({
        user: assignedTo,
        type: 'work_order',
        title: 'New Work Order Assigned',
        message: `You have been assigned work order: ${workOrder.workOrderId}`,
        relatedId: workOrder._id,
        relatedModel: 'WorkOrder'
      });
    }

    res.status(201).json({
      success: true,
      data: workOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update work order
// @route   PUT /api/work-orders/:id
// @access  Private
exports.updateWorkOrder = async (req, res) => {
  try {
    let workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    // Add activity log entry
    const activityEntry = {
      action: 'updated',
      user: req.user.id,
      userName: req.user.name,
      details: 'Work order details updated',
      timestamp: Date.now()
    };

    req.body.activityLog = [...workOrder.activityLog, activityEntry];

    workOrder = await WorkOrder.findByIdAndUpdate(
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
      data: workOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update work order status
// @route   PATCH /api/work-orders/:id/status
// @access  Private
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    const oldStatus = workOrder.status;
    workOrder.status = status;

    // Update completion/verification dates
    if (status === 'Completed' && !workOrder.completedAt) {
      workOrder.completedAt = Date.now();
    }
    if (status === 'Verified' && !workOrder.verifiedAt) {
      workOrder.verifiedAt = Date.now();
    }

    // Add activity log
    workOrder.activityLog.push({
      action: 'status_changed',
      user: req.user.id,
      userName: req.user.name,
      details: `Status changed from ${oldStatus} to ${status}`,
      timestamp: Date.now()
    });

    await workOrder.save();

    // Create notification for assigned user
    if (workOrder.assignedTo) {
      await Notification.create({
        user: workOrder.assignedTo,
        type: 'status',
        title: 'Work Order Status Updated',
        message: `Work order ${workOrder.workOrderId} status changed to ${status}`,
        relatedId: workOrder._id,
        relatedModel: 'WorkOrder'
      });
    }

    res.status(200).json({
      success: true,
      data: workOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add note to work order
// @route   POST /api/work-orders/:id/notes
// @access  Private
exports.addNote = async (req, res) => {
  try {
    const { text } = req.body;
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    workOrder.notes.push({
      user: req.user.id,
      userName: req.user.name,
      text,
      createdAt: Date.now()
    });

    workOrder.activityLog.push({
      action: 'note_added',
      user: req.user.id,
      userName: req.user.name,
      details: 'Added a note',
      timestamp: Date.now()
    });

    await workOrder.save();

    res.status(200).json({
      success: true,
      data: workOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete work order
// @route   DELETE /api/work-orders/:id
// @access  Private (Admin only)
exports.deleteWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    await workOrder.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Work order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload attachment
// @route   POST /api/work-orders/:id/attachments
// @access  Private
exports.uploadAttachment = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const attachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      uploadedAt: Date.now()
    };

    workOrder.attachments.push(attachment);

    workOrder.activityLog.push({
      action: 'attachment_added',
      user: req.user.id,
      userName: req.user.name,
      details: `Uploaded file: ${req.file.originalname}`,
      timestamp: Date.now()
    });

    await workOrder.save();

    res.status(200).json({
      success: true,
      data: workOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};