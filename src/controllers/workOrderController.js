const WorkOrder = require('../models/WorkOrder');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * @desc    GET all work orders (role-based)
 * @route   GET /api/work-orders
 * @access  Private
 */
exports.getAllWorkOrders = async (req, res) => {
  try {
    const { category, priority, status, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    // Role-based visibility
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

    if (category && category !== 'All') filter.category = category;
    if (priority && priority !== 'All') filter.priority = priority;
    if (status && status !== 'All') filter.status = status;

    if (search) {
      filter.$or = [
        { workOrderId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const workOrders = await WorkOrder.find(filter)
      .populate('assignedTo', '_id name email role')
      .populate('createdBy', '_id name email')
      .populate('notes.user', '_id name')
      .populate('attachments.uploadedBy', '_id name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await WorkOrder.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: workOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    GET single work order
 * @route   GET /api/work-orders/:id
 * @access  Private
 */
exports.getWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate('assignedTo', '_id name email role')
      .populate('createdBy', '_id name email')
      .populate('notes.user', '_id name')
      .populate('attachments.uploadedBy', '_id name')
      .populate('activityLog.user', '_id name');

    if (!workOrder)
      return res.status(404).json({ success: false, message: 'Work order not found' });

    if (
      req.user.role === 'Technician' &&
      workOrder.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: workOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    CREATE work order
 * @route   POST /api/work-orders
 * @access  Private
 */
exports.createWorkOrder = async (req, res) => {
  try {
    const { assignedTo, ...rest } = req.body;

    const workOrder = new WorkOrder({
      ...rest,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      activityLog: [
        {
          action: 'created',
          user: req.user._id,
          userName: req.user.name,
          details: 'Work order created',
          timestamp: Date.now(),
        },
      ],
    });

    await workOrder.save();

    if (assignedTo) {
      await Notification.create({
        user: assignedTo,
        type: 'work_order',
        title: 'New Work Order Assigned',
        message: `You have been assigned work order: ${workOrder.workOrderId}`,
        relatedId: workOrder._id,
        relatedModel: 'WorkOrder',
      });
    }

    await workOrder.populate('assignedTo', '_id name email role');
    await workOrder.populate('createdBy', '_id name email');

    res.status(201).json({ success: true, data: workOrder });
  } catch (err) {
    console.error('Create Work Order Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    UPDATE work order
 * @route   PUT /api/work-orders/:id
 * @access  Private
 */
exports.updateWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    if (!workOrder)
      return res.status(404).json({ success: false, message: 'Work order not found' });

    workOrder.activityLog.push({
      action: 'updated',
      user: req.user._id,
      userName: req.user.name,
      details: 'Work order updated',
      timestamp: Date.now(),
    });

    Object.assign(workOrder, req.body);
    await workOrder.save();

    await workOrder.populate('assignedTo', '_id name email role');
    await workOrder.populate('createdBy', '_id name email');

    res.status(200).json({ success: true, data: workOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    UPDATE work order status
 * @route   PATCH /api/work-orders/:id/status
 * @access  Private
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const workOrder = await WorkOrder.findById(req.params.id);
    if (!workOrder)
      return res.status(404).json({ success: false, message: 'Work order not found' });

    const oldStatus = workOrder.status;
    workOrder.status = status;

    if (status === 'Completed') workOrder.completedAt = Date.now();
    if (status === 'Verified') workOrder.verifiedAt = Date.now();

    workOrder.activityLog.push({
      action: 'status_changed',
      user: req.user._id,
      userName: req.user.name,
      details: `Status changed from ${oldStatus} to ${status}`,
      timestamp: Date.now(),
    });

    await workOrder.save();
    res.status(200).json({ success: true, data: workOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    ADD note
 * @route   POST /api/work-orders/:id/notes
 * @access  Private
 */
exports.addNote = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    if (!workOrder)
      return res.status(404).json({ success: false, message: 'Work order not found' });

    workOrder.notes.push({
      user: req.user._id,
      userName: req.user.name,
      text: req.body.text,
      createdAt: Date.now(),
    });

    workOrder.activityLog.push({
      action: 'note_added',
      user: req.user._id,
      userName: req.user.name,
      details: 'Added a note',
      timestamp: Date.now(),
    });

    await workOrder.save();
    res.status(200).json({ success: true, data: workOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    DELETE work order
 * @route   DELETE /api/work-orders/:id
 * @access  Admin
 */
exports.deleteWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    if (!workOrder)
      return res.status(404).json({ success: false, message: 'Work order not found' });

    await workOrder.deleteOne();
    res.status(200).json({ success: true, message: 'Work order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    UPLOAD attachment
 * @route   POST /api/work-orders/:id/attachments
 * @access  Private
 */
exports.uploadAttachment = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    if (!workOrder)
      return res.status(404).json({ success: false, message: 'Work order not found' });

    if (!req.file)
      return res.status(400).json({ success: false, message: 'No file uploaded' });

    workOrder.attachments.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
      uploadedAt: Date.now(),
    });

    workOrder.activityLog.push({
      action: 'attachment_added',
      user: req.user._id,
      userName: req.user.name,
      details: `Uploaded ${req.file.originalname}`,
      timestamp: Date.now(),
    });

    await workOrder.save();
    res.status(200).json({ success: true, data: workOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
