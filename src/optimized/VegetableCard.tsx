import { memo, useState, useEffect, useRef } from 'react';
import LazyImage from './LazyImage';

interface VegetableCardProps {
  veg: {
    name: string;
    description: string;
    image: string;
    icon: string;
  };
  index: number;
}

const VegetableCard = memo(({ veg, index }: VegetableCardProps) => {
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        height: '500px',
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'rgba(10,10,10,0.8)',
        contain: 'layout style paint',
      } as React.CSSProperties}
    >
      {inView && (
        <>
          <LazyImage
            src={veg.image}
            alt={veg.name}
            style={{ position: 'absolute', inset: 0 }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)',
          }} />
          <div style={{
            position: 'absolute', top: '24px', right: '24px',
            width: '64px', height: '64px',
            background: 'rgba(255,255,255,0.95)', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px',
          }}>
            {veg.icon}
          </div>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '32px', color: '#fff',
          }}>
            <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>{veg.name}</h3>
            <p style={{ fontSize: '15px', lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>{veg.description}</p>
          </div>
        </>
      )}
    </div>
  );
});

VegetableCard.displayName = 'VegetableCard';

export default VegetableCard;
