const express = require('express');
const router = express.Router();
const {
  getAllWorkOrders,
  getWorkOrder,
  createWorkOrder,
  updateWorkOrder,
  updateStatus,
  addNote,
  deleteWorkOrder,
  uploadAttachment
} = require('../controllers/workOrderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate, workOrderRules } = require('../middleware/validator');
const upload = require('../middleware/upload');

router
  .route('/')
  .get(protect, getAllWorkOrders)
  .post(protect, validate(workOrderRules), createWorkOrder);

router
  .route('/:id')
  .get(protect, getWorkOrder)
  .put(protect, updateWorkOrder)
  .delete(protect, authorize('Admin'), deleteWorkOrder);

router.patch('/:id/status', protect, updateStatus);
router.post('/:id/notes', protect, addNote);
router.post('/:id/attachments', protect, upload.single('file'), uploadAttachment);

module.exports = router;