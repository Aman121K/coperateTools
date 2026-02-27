import { useState } from 'react';
import { Editor } from '../../components/Editor';
import { ToolLayout } from '../../components/ToolLayout';

export function SecurityDepositSlip() {
  const [slipNo, setSlipNo] = useState(`SD-${Date.now().toString().slice(-6)}`);
  const [payerName, setPayerName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [refundTerms, setRefundTerms] = useState('Refundable at end of tenancy after deductions, if any.');

  const output = [
    'SECURITY DEPOSIT SLIP',
    `Slip No: ${slipNo || '-'}`,
    `Date: ${date || '-'}`,
    '',
    `Payer Name: ${payerName || '-'}`,
    `Receiver Name: ${receiverName || '-'}`,
    `Property/Reference: ${propertyAddress || '-'}`,
    `Deposit Amount: ${amount || '-'}`,
    `Refund Terms: ${refundTerms || '-'}`,
    '',
    'Payer Signature: __________________',
    'Receiver Signature: __________________',
  ].join('\n');

  return (
    <ToolLayout
      title="Security Deposit Slip"
      description="Generate security deposit acknowledgement slips for rentals and agreements."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="security-deposit-slip"
      showCopyMinified={false}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Slip Number" value={slipNo} onChange={(e) => setSlipNo(e.target.value)} />
        <input type="date" className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Payer Name" value={payerName} onChange={(e) => setPayerName(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Receiver Name" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
        <input className="md:col-span-2 px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Property Address / Agreement Ref" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Deposit Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Refund Terms (short)" value={refundTerms} onChange={(e) => setRefundTerms(e.target.value)} />
        <div className="md:col-span-2">
          <Editor value={output} onChange={() => {}} language="plaintext" height="240px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}

