import { Router } from 'express';
import gradeRoutes from './gradeRoutes';
import studentRoutes from './studentRoutes';
import governanceRoutes from './governanceRoutes';
import dataQualityRoutes from './dataQualityRoutes';

const router = Router();

router.use('/grades', gradeRoutes);
router.use('/students', studentRoutes);
router.use('/governance', governanceRoutes);
router.use('/dqm', dataQualityRoutes);

export default router;
