'use client';

import { useEffect, useMemo, useState } from 'react';
import Graph, { type DataPoint } from '../../components/Graph';
import PeriodSelector, { type Period } from '../../components/PeriodSelector';
import { generateTheme } from '../../components/RandomTheme';

export default function AppHome() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [period, setPeriod] = useState<Period>(30);
  const [loading, setLoading] = useState(true);

  const theme = useMemo(() => generateTheme(), []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/entries?days=${period}`);
        if (res.ok) {
          const entries = (await res.json()) as DataPoint[];
          setData(entries);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  useEffect(() => {
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [theme]);

  return (
    <main
      className="main-container"
      style={{
        background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})`,
      }}
    >
      <div className="content">
        <div className="header">
          <PeriodSelector value={period} onChange={setPeriod} />
          <a href="/app/input" className="nav-btn" aria-label="Input">
            +
          </a>
        </div>

        <div className="graph-wrapper">
          {loading ? (
            <div className="loading">...</div>
          ) : data.length > 0 ? (
            <Graph data={data} theme={theme} />
          ) : (
            <div className="empty">
              <div className="empty-icon">○</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

