import React, { useState, useMemo } from 'react';

// SmPC doz tablosu
const BANDS = [
  { min: 40,  max: 50,  h1: 40,  h2: 40  },
  { min: 50,  max: 60,  h1: 50,  h2: 50  },
  { min: 60,  max: 70,  h1: 60,  h2: 60  },
  { min: 70,  max: 80,  h1: 70,  h2: 70  },
  { min: 80,  max: 90,  h1: 80,  h2: 70  },
  { min: 90,  max: 100, h1: 90,  h2: 80  },
  { min: 100, max: 110, h1: 100, h2: 90  },
  { min: 110, max: Infinity, h1: 100, h2: 100 },
];

function getBand(w) {
  return BANDS.find(b => w >= b.min && w < b.max) || BANDS[BANDS.length - 1];
}

// Günlük doz dağılımı: toplam mg → [gün1, gün2, ...] (max 20mg/gün, 4-5 gün)
function buildDays(totalMg) {
  const tablets = totalMg / 10;
  const days = tablets <= 8 ? 4 : 5;
  const schedule = [];
  let rem = totalMg;
  for (let i = 0; i < days; i++) {
    const remaining_days = days - i;
    const dose = rem > 10 * remaining_days ? 20 : 10;
    schedule.push(dose);
    rem -= dose;
  }
  while (schedule.length < 5) schedule.push(0);
  return schedule;
}

// Kutu kombinasyonu hesaplama (1, 4, 6 tabletlik ambalajlar)
function calcBoxes(tablets) {
  // En az kutu sayısı ile 6+4+1 kombinasyonu
  const options = [];
  for (let s6 = 0; s6 <= Math.ceil(tablets / 6); s6++) {
    for (let s4 = 0; s4 <= Math.ceil(tablets / 4); s4++) {
      for (let s1 = 0; s1 <= tablets; s1++) {
        if (s6 * 6 + s4 * 4 + s1 * 1 === tablets) {
          options.push({ s6, s4, s1, total: s6 + s4 + s1 });
        }
      }
    }
  }
  if (options.length === 0) return null;
  options.sort((a, b) => a.total - b.total || a.s1 - b.s1);
  return options[0];
}

const styles = {
  app: {
    minHeight: '100vh',
    background: '#f5f4f1',
    padding: '0 0 60px',
  },
  header: {
    background: '#1a1a1a',
    color: '#fff',
    padding: '28px 24px 24px',
  },
  headerEyebrow: {
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: '6px',
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  headerSub: {
    fontSize: '13px',
    color: '#888',
    marginTop: '4px',
  },
  body: {
    maxWidth: '520px',
    margin: '0 auto',
    padding: '0 16px',
  },
  section: {
    marginTop: '24px',
  },
  weightCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e8e6e0',
  },
  weightRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
  },
  weightLabel: {
    fontSize: '13px',
    color: '#666',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  weightVal: {
    fontSize: '28px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    minWidth: '72px',
    textAlign: 'right',
  },
  bandBadge: {
    display: 'inline-block',
    fontSize: '12px',
    color: '#666',
    background: '#f5f4f1',
    borderRadius: '6px',
    padding: '3px 10px',
    marginTop: '4px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '24px',
  },
  metricCard: {
    background: '#fff',
    borderRadius: '10px',
    padding: '14px 16px',
    border: '1px solid #e8e6e0',
  },
  metricVal: {
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  metricLbl: {
    fontSize: '12px',
    color: '#888',
    marginTop: '2px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: '10px',
    marginTop: '28px',
  },
  yearCard: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8e6e0',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  yearHeader: {
    background: '#1a1a1a',
    color: '#fff',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearHeaderSub: {
    fontSize: '12px',
    color: '#888',
  },
  weekBlock: {
    padding: '14px 16px',
    borderBottom: '1px solid #f0ede8',
  },
  weekTitle: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#555',
    marginBottom: '10px',
  },
  daysRow: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dayTotal: {
    fontSize: '12px',
    color: '#888',
    marginLeft: '4px',
  },
  boxesBlock: {
    padding: '14px 16px',
  },
  boxesTitle: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#555',
    marginBottom: '8px',
  },
  boxRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  boxBadge: {
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: '6px',
    padding: '4px 10px',
    border: '1px solid',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e8e6e0',
    margin: '0',
  },
  disclaimer: {
    fontSize: '11px',
    color: '#aaa',
    textAlign: 'center',
    marginTop: '32px',
    lineHeight: 1.6,
  },
};

function DayBox({ dose }) {
  const base = {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 600,
    flexShrink: 0,
    border: '1px solid',
  };
  if (dose === 0) {
    return <div style={{ ...base, background: '#f5f4f1', borderColor: '#e0ddd8', color: '#ccc' }}>—</div>;
  }
  if (dose === 10) {
    return <div style={{ ...base, background: '#EBF4FF', borderColor: '#BDD9F8', color: '#1155AA' }}>10 mg</div>;
  }
  return <div style={{ ...base, background: '#EEF0FF', borderColor: '#C9CCF5', color: '#3336A0' }}>20 mg</div>;
}

function BoxBadge({ count, size, color }) {
  if (count === 0) return null;
  const colors = {
    dark:  { bg: '#1a1a1a', border: '#1a1a1a', text: '#fff' },
    mid:   { bg: '#f0ede8', border: '#d0cdc8', text: '#333' },
    light: { bg: '#f8f7f5', border: '#e0ddd8', text: '#666' },
  };
  const c = colors[color] || colors.mid;
  return (
    <div style={{ ...styles.boxBadge, background: c.bg, borderColor: c.border, color: c.text }}>
      {count}× {size}'lı kutu
    </div>
  );
}

function WeekPlan({ weekNum, totalMg }) {
  const days = buildDays(totalMg);
  const activeDays = days.filter(d => d > 0).length;
  const boxes = calcBoxes(totalMg / 10);

  return (
    <div>
      <div style={styles.weekBlock}>
        <div style={styles.weekTitle}>
          Tedavi haftası {weekNum} — Ay {weekNum}
        </div>
        <div style={styles.daysRow}>
          {days.map((d, i) => <DayBox key={i} dose={d} />)}
          <span style={styles.dayTotal}>{totalMg} mg / {activeDays} gün</span>
        </div>
      </div>
      <div style={styles.boxesBlock}>
        <div style={styles.boxesTitle}>Reçete (bu hafta için)</div>
        <div style={styles.boxRow}>
          {boxes ? (
            <>
              <BoxBadge count={boxes.s6} size={6} color="dark" />
              <BoxBadge count={boxes.s4} size={4} color="mid" />
              <BoxBadge count={boxes.s1} size={1} color="light" />
            </>
          ) : (
            <span style={{ fontSize: '12px', color: '#888' }}>—</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [weight, setWeight] = useState(70);
  const band = useMemo(() => getBand(weight), [weight]);

  const yillikToplam = band.h1 + band.h2;
  const ikiYilToplam = yillikToplam * 2;
  const dosePerKg = (yillikToplam / weight).toFixed(2);
  const bandLabel = band.max === Infinity ? '≥110 kg' : `${band.min}–<${band.max} kg`;

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={styles.headerEyebrow}>MS Tedavisi · Kladribin</div>
        <div style={styles.headerTitle}>DMT Doz Hesaplama</div>
        <div style={styles.headerSub}>Kladribin 10 mg tablet · SmPC tablosuna göre</div>
      </div>

      <div style={styles.body}>

        {/* Ağırlık girişi */}
        <div style={styles.section}>
          <div style={styles.weightCard}>
            <div style={styles.weightRow}>
              <span style={styles.weightLabel}>Vücut ağırlığı</span>
              <input
                type="range"
                min={40} max={120} step={1}
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={styles.weightVal}>{weight} kg</span>
            </div>
            <span style={styles.bandBadge}>Doz bandı: {bandLabel}</span>
          </div>
        </div>

        {/* Metrikler */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricVal}>{band.h1} mg</div>
            <div style={styles.metricLbl}>Hafta 1 dozu</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricVal}>{band.h2} mg</div>
            <div style={styles.metricLbl}>Hafta 2 dozu</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricVal}>{yillikToplam} mg</div>
            <div style={styles.metricLbl}>Yıllık kümülatif</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricVal}>{dosePerKg} mg/kg</div>
            <div style={styles.metricLbl}>mg/kg / yıl</div>
          </div>
        </div>

        {/* Yıl planları */}
        {['Yıl 1', 'Yıl 2'].map((yr, yi) => (
          <div key={yi}>
            <div style={styles.sectionTitle}>{yr}</div>
            <div style={styles.yearCard}>
              <div style={styles.yearHeader}>
                <span>{yr} tedavi planı</span>
                <span style={styles.yearHeaderSub}>Toplam {yillikToplam} mg</span>
              </div>
              <WeekPlan weekNum={1} totalMg={band.h1} />
              <hr style={styles.divider} />
              <WeekPlan weekNum={2} totalMg={band.h2} />
            </div>
          </div>
        ))}

        {/* 2 yıl özet */}
        <div style={styles.sectionTitle}>2 Yıllık Özet</div>
        <div style={styles.yearCard}>
          <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>{ikiYilToplam} mg</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Toplam kümülatif doz</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>
                {((ikiYilToplam / weight) / 2).toFixed(2)} mg/kg
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Ortalama yıllık mg/kg</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>4</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Toplam tedavi haftası</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>
                {(band.h1 / 10 + band.h2 / 10) * 2}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Toplam tablet (2 yıl)</div>
            </div>
          </div>
        </div>

        <p style={styles.disclaimer}>
          Bu hesaplayıcı SmPC verilerine dayanmaktadır.<br />
          Klinik karar için yetkili ürün bilgisini esas alınız.
        </p>
      </div>
    </div>
  );
}
