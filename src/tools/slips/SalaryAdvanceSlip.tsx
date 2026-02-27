import { useState } from 'react';
import { Editor } from '../../components/Editor';
import { ToolLayout } from '../../components/ToolLayout';

export function SalaryAdvanceSlip() {
  const [slipNo, setSlipNo] = useState(`ADV-${Date.now().toString().slice(-6)}`);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [recoveryMonth, setRecoveryMonth] = useState('');

  const output = [
    'SALARY ADVANCE SLIP',
    `Slip No: ${slipNo || '-'}`,
    `Request Date: ${requestDate || '-'}`,
    '',
    `Employee Name: ${employeeName || '-'}`,
    `Employee ID: ${employeeId || '-'}`,
    `Department: ${department || '-'}`,
    `Advance Amount: ${advanceAmount || '-'}`,
    `Recovery Month: ${recoveryMonth || '-'}`,
    '',
    'Employee Signature: __________________',
    'Approver Signature: __________________',
  ].join('\n');

  return (
    <ToolLayout
      title="Salary Advance Slip"
      description="Create salary advance request slips for payroll and HR use."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="salary-advance-slip"
      showCopyMinified={false}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Slip Number" value={slipNo} onChange={(e) => setSlipNo(e.target.value)} />
        <input type="date" className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" value={requestDate} onChange={(e) => setRequestDate(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Employee Name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Advance Amount" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} />
        <input className="md:col-span-2 px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Recovery Month (e.g. March 2026)" value={recoveryMonth} onChange={(e) => setRecoveryMonth(e.target.value)} />
        <div className="md:col-span-2">
          <Editor value={output} onChange={() => {}} language="plaintext" height="240px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}

