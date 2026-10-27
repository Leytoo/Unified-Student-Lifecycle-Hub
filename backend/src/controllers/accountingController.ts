import { Request, Response } from 'express';

// Mock database records for accounting / tuition
const financialRecords = [
    {
        studentId: 'STU-2026-0001',
        name: 'Sophia Alvarez',
        term: 'AY 2025-2026 2nd Sem',
        totalTuition: 45000.00,
        paidAmount: 45000.00,
        balance: 0.00,
        status: 'PAID',
        dsoStatus: 'CLEARED'
    },
    {
        studentId: 'STU-2026-0002',
        name: 'Liam Chen',
        term: 'AY 2025-2026 2nd Sem',
        totalTuition: 42000.00,
        paidAmount: 25000.00,
        balance: 17000.00,
        status: 'PARTIAL',
        dsoStatus: 'PENDING_MIDTERM'
    },
    {
        studentId: 'STU-2026-0003',
        name: 'Mateo Cruz',
        term: 'AY 2025-2026 2nd Sem',
        totalTuition: 48000.00,
        paidAmount: 0.00,
        balance: 48000.00,
        status: 'UNPAID',
        dsoStatus: 'HOLD_FINANCIAL'
    },
    {
        studentId: 'STU-2026-0004',
        name: 'Emma Watson',
        term: 'AY 2025-2026 2nd Sem',
        totalTuition: 45000.00,
        paidAmount: 45000.00,
        balance: 0.00,
        status: 'PAID',
        dsoStatus: 'CLEARED'
    }
];

export const getFinancialRecords = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            data: financialRecords,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch financial records',
        });
    }
};