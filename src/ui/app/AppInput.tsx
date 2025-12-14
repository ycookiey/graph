'use client';

import { useEffect, useState } from 'react';
import InputForm from '../../components/InputForm';

export default function AppInput({ userId }: { userId: string | null }) {
  const [todayValue, setTodayValue] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayEntry = async () => {
      try {
        const res = await fetch('/api/entries/today');
        if (res.ok) {
          const data = (await res.json()) as { value: number | null };
          if (data.value !== null) {
            setTodayValue(data.value);
          }
        }
      } catch (err) {
        console.error('Failed to fetch today entry:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayEntry();
  }, []);

  const handleSubmit = async (value: number) => {
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });

    if (!res.ok) {
      throw new Error('Failed to save');
    }

    setTodayValue(value);
  };

  if (loading) {
    return (
      <main className="input-page">
        <div className="loading">...</div>
      </main>
    );
  }

  return (
    <main className="input-page">
      <div className="input-content">
        <a href="/app" className="back-btn" aria-label="Back">
          ←
        </a>

        <div className="input-card">
          <InputForm onSubmit={handleSubmit} initialValue={todayValue} isLoading={loading} />
        </div>

        {userId ? <div className="user-info">{userId}</div> : null}
      </div>
    </main>
  );
}

