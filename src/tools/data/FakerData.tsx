import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type DataType = 'user' | 'product' | 'order' | 'address';

function generateUser() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
  };
}

function generateProduct() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
  };
}

function generateOrder() {
  return {
    id: faker.string.uuid(),
    orderNumber: faker.string.alphanumeric(8).toUpperCase(),
    total: faker.commerce.price(),
    status: faker.helpers.arrayElement(['pending', 'shipped', 'delivered']),
    createdAt: faker.date.recent().toISOString(),
  };
}

function generateAddress() {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zip: faker.location.zipCode(),
    country: faker.location.country(),
  };
}

export function FakerData() {
  const [type, setType] = useState<DataType>('user');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    const arr =
      type === 'user'
        ? Array.from({ length: Math.min(count, 50) }, generateUser)
        : type === 'product'
        ? Array.from({ length: Math.min(count, 50) }, generateProduct)
        : type === 'order'
        ? Array.from({ length: Math.min(count, 50) }, generateOrder)
        : Array.from({ length: Math.min(count, 50) }, generateAddress);
    setOutput(JSON.stringify(arr, null, 2));
  };

  return (
    <ToolLayout
      title="Dummy Data Generator"
      description="Generate fake users, products, orders, or addresses. Purpose: Populate test data for dev or demos."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="faker"
      singlePanel
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Data type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DataType)}
              className="px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--accent)]/50"
            >
              <option value="user">👤 User</option>
              <option value="product">📦 Product</option>
              <option value="order">📋 Order</option>
              <option value="address">📍 Address</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Count (1–50)</label>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1)))}
              className="w-24 px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--accent)]/50"
            />
          </div>
          <div className="self-end">
            <button
              type="button"
              onClick={generate}
              className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium"
            >
              Generate
            </button>
          </div>
        </div>
        {output && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Generated JSON</label>
            <Editor value={output} onChange={() => {}} language="json" height="400px" readOnly />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
