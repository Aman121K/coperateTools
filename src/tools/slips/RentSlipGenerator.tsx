import { useState } from 'react';
import { Editor } from '../../components/Editor';
import { ToolLayout } from '../../components/ToolLayout';

export function RentSlipGenerator() {
  const [tenantName, setTenantName] = useState('');
  const [landlordName, setLandlordName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [rentMonth, setRentMonth] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [slipNo, setSlipNo] = useState(`RENT-${Date.now().toString().slice(-6)}`);

  const output = [
    'RENT PAYMENT SLIP',
    `Slip No: ${slipNo || '-'}`,
    `Date: ${paidDate || '-'}`,
    '',
    `Tenant Name: ${tenantName || '-'}`,
    `Landlord Name: ${landlordName || '-'}`,
    `Property Address: ${propertyAddress || '-'}`,
    `Rent Month: ${rentMonth || '-'}`,
    `Amount Paid: ${amount || '-'}`,
    `Payment Mode: ${paymentMode || '-'}`,
    '',
    'Received By:',
    'Signature: __________________',
  ].join('\n');

  return (
    <ToolLayout
      title="Rent Slip Generator"
      description="Create printable rent payment slips for monthly rent records."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="rent-slip-generator"
      showCopyMinified={false}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Tenant Name" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Landlord Name" value={landlordName} onChange={(e) => setLandlordName(e.target.value)} />
        <input className="md:col-span-2 px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Property Address" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Rent Month (e.g. Feb 2026)" value={rentMonth} onChange={(e) => setRentMonth(e.target.value)} />
        <input type="date" className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Amount (e.g. 25000)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Payment Mode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} />
        <input className="md:col-span-2 px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Slip Number" value={slipNo} onChange={(e) => setSlipNo(e.target.value)} />
        <div className="md:col-span-2">
          <Editor value={output} onChange={() => {}} language="plaintext" height="240px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}

