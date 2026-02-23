import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';
import { NumberInput } from '../../components/NumberInput';

export function SalarySlipGenerator() {
  const [name, setName] = useState('Employee Name');
  const [empId, setEmpId] = useState('EMP001');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [basic, setBasic] = useState(50000);
  const [hra, setHra] = useState(20000);
  const [specialAllowance, setSpecialAllowance] = useState(10000);
  const [deductions, setDeductions] = useState(5000);
  const [output, setOutput] = useState('');

  const generate = () => {
    const gross = basic + hra + specialAllowance;
    const net = gross - deductions;
    const slip = {
      employee: { name, empId },
      month,
      earnings: { basic, hra, specialAllowance, total: gross },
      deductions: { amount: deductions },
      netSalary: net,
    };
    setOutput(JSON.stringify(slip, null, 2));
  };

  return (
    <ToolLayout title="Salary Slip Generator" description="Generate salary slip data (JSON). Purpose: Create structured pay slip data for HR systems or employee records." input="" output={output} onInputChange={() => {}} toolId="salary-slip" singlePanel>
      <div className="max-w-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Employee ID</label>
            <input value={empId} onChange={(e) => setEmpId(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Month</label>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Basic</label>
            <NumberInput value={basic} onChange={setBasic} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">HRA</label>
            <NumberInput value={hra} onChange={setHra} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Special Allowance</label>
            <NumberInput value={specialAllowance} onChange={setSpecialAllowance} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Deductions</label>
            <NumberInput value={deductions} onChange={setDeductions} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
        </div>
        <button type="button" onClick={generate} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Generate</button>
        {output && <Editor value={output} onChange={() => {}} language="json" height="192px" readOnly />}
      </div>
    </ToolLayout>
  );
}
