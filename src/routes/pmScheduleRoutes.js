const express = require('express');
const router = express.Router();
const {
  getAllPMSchedules,
  getPMSchedule,
  createPMSchedule,
  updatePMSchedule,
  completePMTask,
  deletePMSchedule
} = require('../controllers/pmScheduleController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate, pmScheduleRules } = require('../middleware/validator');

router
  .route('/')
  .get(protect, getAllPMSchedules)
  .post(protect, authorize('Admin', 'Technician'), validate(pmScheduleRules), createPMSchedule);

router
  .route('/:id')
  .get(protect, getPMSchedule)
  .put(protect, authorize('Admin', 'Technician'), updatePMSchedule)
  .delete(protect, authorize('Admin'), deletePMSchedule);

router.post('/:id/complete', protect, completePMTask);

module.exports = router;