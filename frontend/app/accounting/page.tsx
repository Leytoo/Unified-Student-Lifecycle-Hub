'use client';

import React, { useState } from 'react';
import {
    Receipt,
    DollarSign,
    CheckCircle2,
    AlertCircle,
    Download,
    Filter,
    ShieldCheck,
    Search
} from 'lucide-react';

// Local mock data ensuring complete data privacy and offline capability
const mockFinancialRecords = [
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

export default function AccountingPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const filteredRecords = mockFinancialRecords.filter((record) => {
        const matchesSearch =
            record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-2">
                        <Receipt className="w-7 h-7 text-indigo-600" />
                        <h1 className="text-2xl font-bold text-slate-900">
                            Student Accounts & Accounting Library
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Enterprise financial ledger, tuition breakdown, and billing clearance governance.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition">
                    <Download className="w-4 h-4" /> Export Ledger (CSV)
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Total Receivables</span>
                        <DollarSign className="w-5 h-5 text-indigo-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mt-2">₱180,000.00</p>
                    <span className="text-xs text-slate-400">Total Assessable Fees</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Collected Revenue</span>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 mt-2">₱115,000.00</p>
                    <span className="text-xs text-emerald-600 font-medium">63.8% Collection Rate</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Outstanding Balance</span>
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-amber-600 mt-2">₱65,000.00</p>
                    <span className="text-xs text-amber-600 font-medium">2 Students Pending</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Financial Holds</span>
                        <ShieldCheck className="w-5 h-5 text-rose-500" />
                    </div>
                    <p className="text-2xl font-bold text-rose-600 mt-2">1 Active Hold</p>
                    <span className="text-xs text-slate-400">Restricted Exam Clearance</span>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by student name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="ALL">All Payment Statuses</option>
                        <option value="PAID">Fully Paid</option>
                        <option value="PARTIAL">Partial Payment</option>
                        <option value="UNPAID">Unpaid</option>
                    </select>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-md font-semibold text-slate-800">Student Financial Ledger</h2>
                    <span className="text-xs text-slate-500">Local Secured Mock Data</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Student ID</th>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3">Term</th>
                                <th className="px-6 py-3">Total Tuition</th>
                                <th className="px-6 py-3">Paid</th>
                                <th className="px-6 py-3">Balance</th>
                                <th className="px-6 py-3">Payment Status</th>
                                <th className="px-6 py-3">Clearance Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                                        No financial records found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((item) => (
                                    <tr key={item.studentId} className="hover:bg-slate-50/80 transition">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-700">{item.studentId}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500">{item.term}</td>
                                        <td className="px-6 py-4 font-mono">₱{item.totalTuition.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-4 font-mono text-emerald-600">₱{item.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-4 font-mono text-amber-600 font-semibold">₱{item.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                item.status === 'PARTIAL' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded ${item.dsoStatus === 'CLEARED' ? 'bg-slate-100 text-slate-700' :
                                                item.dsoStatus === 'PENDING_MIDTERM' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-rose-100 text-rose-800 font-semibold'
                                                }`}>
                                                {item.dsoStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}