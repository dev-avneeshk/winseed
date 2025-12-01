import { useState, useEffect, useRef, memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  placeholder?: string;
  className?: string;
}

const LazyImage = memo(({ src, alt, style, placeholder = 'rgba(10,10,10,0.3)', className }: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} style={{ position: 'relative', ...style }} className={className}>
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            ...style
          }}
        />
      )}
      {!loaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: placeholder,
          ...style
        }} />
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
