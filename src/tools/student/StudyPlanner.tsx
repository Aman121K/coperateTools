import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';
import { NumberInput } from '../../components/NumberInput';

export function StudyPlanner() {
  const [topics, setTopics] = useState('Chapter 1\nChapter 2\nChapter 3');
  const [totalHours, setTotalHours] = useState(10);
  const [sessionLength, setSessionLength] = useState(2);
  const [output, setOutput] = useState('');

  const generate = () => {
    const list = topics.split('\n').filter((t) => t.trim());
    const hoursPerTopic = totalHours / list.length;
    const sessionsPerTopic = Math.ceil(hoursPerTopic / sessionLength);
    const schedule = list.map((topic) => ({
      topic: topic.trim(),
      hours: hoursPerTopic.toFixed(1),
      sessions: sessionsPerTopic,
      sessionLength,
    }));
    setOutput(JSON.stringify(schedule, null, 2));
  };

  return (
    <ToolLayout title="Study Session Planner" description="Divide topics into study sessions. Purpose: Allocate study time across subjects before exams or deadlines." input="" output={output} onInputChange={() => {}} toolId="study-planner" singlePanel>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Topics (one per line)</label>
          <Editor value={topics} onChange={setTopics} language="plaintext" height="150px" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Total hours</label>
            <NumberInput value={totalHours} onChange={setTotalHours} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Session length (hours)</label>
            <NumberInput value={sessionLength} onChange={setSessionLength} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
        </div>
        <button type="button" onClick={generate} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Generate Plan</button>
        {output && <Editor value={output} onChange={() => {}} language="plaintext" height="256px" readOnly />}
      </div>
    </ToolLayout>
  );
}
