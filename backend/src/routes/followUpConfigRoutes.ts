import express from 'express'; // eslint-disable-line no-unused-vars
import {
  getAllFollowUpConfigs,
  getFollowUpConfigById,
  createFollowUpConfig,
  updateFollowUpConfig,
  deleteFollowUpConfig,
  createPredefinedQuestionSet,
  updatePredefinedQuestionSet,
  deletePredefinedQuestionSet,
  createTopicBasedQuestionSet,
  updateTopicBasedQuestionSet,
  deleteTopicBasedQuestionSet,
} from '../controllers/followUpConfigController.js';

const router = express.Router();

// FollowUpConfig CRUD
router.get('/', getAllFollowUpConfigs as any);
router.get('/:id', getFollowUpConfigById as any);
router.post('/', createFollowUpConfig as any);
router.put('/:id', updateFollowUpConfig as any);
router.delete('/:id', deleteFollowUpConfig as any);

// PredefinedQuestionSet nested CRUD
router.post('/:configId/predefined-question-sets', createPredefinedQuestionSet);
router.put('/predefined-question-sets/:id', updatePredefinedQuestionSet);
router.delete('/predefined-question-sets/:id', deletePredefinedQuestionSet);

// TopicBasedQuestionSet nested CRUD
router.post('/:configId/topic-based-question-sets', createTopicBasedQuestionSet);
router.put('/topic-based-question-sets/:id', updateTopicBasedQuestionSet);
router.delete('/topic-based-question-sets/:id', deleteTopicBasedQuestionSet);

export default router;
