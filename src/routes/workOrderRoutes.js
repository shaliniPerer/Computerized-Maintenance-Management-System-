const express = require('express');
const router = express.Router();

const workOrderController = require('../controllers/workOrderController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router
  .route('/')
  .get(protect, workOrderController.getAllWorkOrders)
  .post(protect, workOrderController.createWorkOrder);

router
  .route('/:id')
  .get(protect, workOrderController.getWorkOrder)
  .put(protect, workOrderController.updateWorkOrder)
  .delete(protect, authorize('Admin'), workOrderController.deleteWorkOrder);

router.patch('/:id/status', protect, workOrderController.updateStatus);
router.post('/:id/notes', protect, workOrderController.addNote);
router.post(
  '/:id/attachments',
  protect,
  upload.single('file'),
  workOrderController.uploadAttachment
);

module.exports = router;
