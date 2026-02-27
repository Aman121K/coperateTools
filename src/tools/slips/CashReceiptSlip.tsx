import { useState } from 'react';
import { Editor } from '../../components/Editor';
import { ToolLayout } from '../../components/ToolLayout';

export function CashReceiptSlip() {
  const [receiptNo, setReceiptNo] = useState(`CR-${Date.now().toString().slice(-6)}`);
  const [receivedFrom, setReceivedFrom] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [receiverName, setReceiverName] = useState('');

  const output = [
    'CASH RECEIPT SLIP',
    `Receipt No: ${receiptNo || '-'}`,
    `Date: ${date || '-'}`,
    '',
    `Received From: ${receivedFrom || '-'}`,
    `Amount: ${amount || '-'}`,
    `Purpose: ${purpose || '-'}`,
    '',
    `Received By: ${receiverName || '-'}`,
    'Signature: __________________',
  ].join('\n');

  return (
    <ToolLayout
      title="Cash Receipt Slip"
      description="Generate quick cash receipt slips for daily transactions."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="cash-receipt-slip"
      showCopyMinified={false}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Receipt Number" value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} />
        <input type="date" className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="md:col-span-2 px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Received From" value={receivedFrom} onChange={(e) => setReceivedFrom(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Receiver Name" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
        <input className="md:col-span-2 px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Purpose / Description" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        <div className="md:col-span-2">
          <Editor value={output} onChange={() => {}} language="plaintext" height="240px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}

