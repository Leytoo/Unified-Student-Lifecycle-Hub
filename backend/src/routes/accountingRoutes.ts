import { Router } from 'express';
import { getFinancialRecords } from '../controllers/accountingController';

const router = Router();

// GET /api/accounting
router.get('/', getFinancialRecords);

export default router;