import React, { useState, useEffect, useRef, lazy, Suspense, memo, useMemo, useCallback } from 'react';
import { X, Sprout, Microscope, Leaf, Package, Star, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from './optimized/LazyImage';
import VegetableCardOptimized from './optimized/VegetableCard';

const WorldMapDemo = lazy(() => import('@/components/ui/world-map-demo'));
const AppleCardsCarouselDemo = lazy(() => import('@/components/ui/apple-cards-carousel-demo'));

// ============================================================================
// DESIGN TOKENS
// ============================================================================
const TOKENS = {
  colors: {
    bg: '#0a0a0a',
    bgDeep: '#000000',
    accent: '#7EF6A1',
    text: '#E6E6E6',
    textSecondary: '#9AA0A6',
  },
  animation: {
    stickyHeight: 400,
    convergenceStart: 0.12,
    convergenceEnd: 0.88,
    staggerRange: 0.12,
    startScale: 0.7,
    endScale: 1.02,
    startRotation: 25,
    hoverTilt: 6,
    springStiffness: 120,
    springDamping: 12,
  }
};

// ============================================================================
// LOADING SCREEN WITH PROGRESS BAR
// ============================================================================
const LoadingScreen = memo(({ progress }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: `linear-gradient(135deg, ${TOKENS.colors.bgDeep} 0%, ${TOKENS.colors.bg} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.04, 1], opacity: [1, 0.9, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          fontSize: 'clamp(56px, 13vw, 140px)',
          fontWeight: 400,
          marginBottom: '40px',
          letterSpacing: '-0.03em',
        }}
      >
        <span style={{ 
          color: TOKENS.colors.text,
          fontWeight: 300,
        }}>Win</span>
        <span style={{ 
          color: TOKENS.colors.accent,
          fontWeight: 400,
          filter: 'drop-shadow(0 0 40px rgba(126, 246, 161, 0.5))',
        }}>Seeds</span>
      </motion.div>

      <div style={{
        width: 'clamp(200px, 40vw, 400px)',
        height: '4px',
        background: 'rgba(126, 246, 161, 0.2)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '24px',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${TOKENS.colors.accent}, rgba(126, 246, 161, 0.8))`,
            borderRadius: '2px',
          }}
        />
      </div>

      <motion.div
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1, 0.95] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          color: TOKENS.colors.textSecondary,
          fontSize: '16px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Loading Quality Seeds…
      </motion.div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '32px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: TOKENS.colors.accent,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
});

// ============================================================================
// FADE IN ON SCROLL WRAPPER
// ============================================================================
const FadeInOnScroll = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: 'easeOut', delay }}
    style={{ willChange: 'opacity, transform' }}
  >
    {children}
  </motion.div>
);

// ============================================================================
// WINSEED LOGO COMPONENT
// ============================================================================
const WinseedLogo = ({ width = 150 }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {/* wordmark */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            fontFamily:
              '-apple-system,BlinkMacSystemFont,"SF Pro Rounded","Inter",sans-serif',
            fontSize: 24,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.03em',
          }}
        >
          wi
        </span>
        <span
          style={{
            position: 'relative',
            fontFamily:
              '-apple-system,BlinkMacSystemFont,"SF Pro Rounded","Inter",sans-serif',
            fontSize: 24,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.03em',
          }}
        >
          n
          {/* green dot over i */}
          <span
            style={{
              position: 'absolute',
              left: 8,
              top: -6,
              width: 5,
              height: 5,
              borderRadius: '999px',
              backgroundColor: '#7EF6A1',
            }}
          />
        </span>
        <span
          style={{
            fontFamily:
              '-apple-system,BlinkMacSystemFont,"SF Pro Rounded","Inter",sans-serif',
            fontSize: 24,
            fontWeight: 700,
            color: '#7EF6A1',
            letterSpacing: '-0.03em',
          }}
        >
          seed
        </span>
      </div>

      {/* leaf icon, tight to text */}
      <svg
        width="22"
        height="20"
        viewBox="0 0 22 20"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginTop: 2 }}
      >
        <g fill="#7EF6A1">
          <path d="M11 20C8 15 6.8 11.4 7.1 7.6 7.5 3.5 10 1 10 1c4.2.3 7 2.7 9 6.4C16.9 9.9 14 13.3 11 20z" />
          <path d="M11 20C8 13.3 5.1 9.9 3 7.4 5 3.7 7.8 1.3 12 1c0 0 2.5 2.5 2.9 6.6.3 3.8-.9 7.4-3.9 12.4z" />
        </g>
      </svg>
    </div>
  );
};

// ============================================================================
// Other Components (memoized) and Utilities
// ============================================================================

const SectionFallback = memo(({ label }) => (
  <div
    style={{
      width: '100%',
      minHeight: '320px',
      borderRadius: '24px',
      border: '1px solid rgba(126, 246, 161, 0.2)',
      background: 'rgba(10, 10, 10, 0.4)',
      color: TOKENS.colors.textSecondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }}
  >
    Loading {label}…
  </div>
));

const IconContainer = memo(({ mouseX, title, icon, active, onClick }) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        cursor: 'pointer',
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
              padding: '4px 12px',
              background: 'rgba(10, 10, 10, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(126, 246, 161, 0.2)',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              color: TOKENS.colors.text,
              whiteSpace: 'nowrap',
              zIndex: 200,
            }}
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: active ? TOKENS.colors.accent : 'rgba(30, 30, 30, 0.6)',
          color: active ? TOKENS.colors.bgDeep : TOKENS.colors.text,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {icon}
      </motion.div>
    </motion.div>
  );
});

const FloatingDock = memo(({ items, currentPage }) => {
  const [mouseX, setMouseX] = useState(null);

  const scrollToSection = (sectionRef) => {
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '40px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 150,
      }}
    >
      <motion.div
        onMouseMove={(e) => setMouseX(e.pageX)}
        onMouseLeave={() => setMouseX(null)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10, 10, 10, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '12px 20px',
          border: '1px solid rgba(126, 246, 161, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          pointerEvents: 'auto',
        }}
      >
        {items.map((item) => (
          <IconContainer
            key={item.page}
            mouseX={mouseX}
            title={item.title}
            icon={item.icon}
            active={currentPage === item.page}
            onClick={() => scrollToSection(item.ref)}
          />
        ))}
      </motion.div>
    </div>
  );
});

const pathVariants = {
  initial: { strokeDashoffset: 800, strokeDasharray: "50 800" },
  animate: {
    strokeDashoffset: 0,
    strokeDasharray: "20 800",
    opacity: [0, 1, 1, 0],
  },
};

const BackgroundLines = memo(() => {
  const paths = useMemo(() => [
    "M720 450C720 450 742.459 440.315 755.249 425.626C768.039 410.937 778.88 418.741 789.478 401.499C800.076 384.258 817.06 389.269 826.741 380.436C836.423 371.603 851.957 364.826 863.182 356.242C874.408 347.657 877.993 342.678 898.867 333.214C919.741 323.75 923.618 319.88 934.875 310.177C946.133 300.474 960.784 300.837 970.584 287.701C980.384 274.564 993.538 273.334 1004.85 263.087C1016.15 252.84 1026.42 250.801 1038.22 242.1C1050.02 233.399 1065.19 230.418 1074.63 215.721C1084.07 201.024 1085.49 209.128 1112.65 194.884C1139.8 180.64 1132.49 178.205 1146.43 170.636C1160.37 163.066 1168.97 158.613 1181.46 147.982C1193.95 137.35 1191.16 131.382 1217.55 125.645C1243.93 119.907 1234.19 118.899 1254.53 100.846C1274.86 82.7922 1275.12 92.8914 1290.37 76.09C1305.62 59.2886 1313.91 62.1868 1323.19 56.7536C1332.48 51.3204 1347.93 42.8082 1361.95 32.1468C1375.96 21.4855 1374.06 25.168 1397.08 10.1863C1420.09 -4.79534 1421.41 -3.16992 1431.52 -15.0078",
    "M720 450C720 450 741.044 435.759 753.062 410.636C765.079 385.514 770.541 386.148 782.73 370.489C794.918 354.83 799.378 353.188 811.338 332.597C823.298 312.005 825.578 306.419 843.707 295.493C861.837 284.568 856.194 273.248 877.376 256.48C898.558 239.713 887.536 227.843 909.648 214.958C931.759 202.073 925.133 188.092 941.063 177.621C956.994 167.151 952.171 154.663 971.197 135.041C990.222 115.418 990.785 109.375 999.488 96.1291C1008.19 82.8827 1011.4 82.2181 1032.65 61.8861C1053.9 41.5541 1045.74 48.0281 1064.01 19.5798C1082.29 -8.86844 1077.21 -3.89415 1093.7 -19.66C1110.18 -35.4258 1105.91 -46.1146 1127.68 -60.2834C1149.46 -74.4523 1144.37 -72.1024 1154.18 -97.6802C1163.99 -123.258 1165.6 -111.332 1186.21 -135.809C1206.81 -160.285 1203.29 -160.861 1220.31 -177.633C1237.33 -194.406 1236.97 -204.408 1250.42 -214.196",
    "M720 450C720 450 712.336 437.768 690.248 407.156C668.161 376.544 672.543 394.253 665.951 365.784C659.358 337.316 647.903 347.461 636.929 323.197C625.956 298.933 626.831 303.639 609.939 281.01C593.048 258.381 598.7 255.282 582.342 242.504C565.985 229.726 566.053 217.66 559.169 197.116C552.284 176.572 549.348 171.846 529.347 156.529C509.345 141.211 522.053 134.054 505.192 115.653C488.33 97.2527 482.671 82.5627 473.599 70.7833C464.527 59.0039 464.784 50.2169 447 32.0721C429.215 13.9272 436.29 0.858563 423.534 -12.6868C410.777 -26.2322 407.424 -44.0808 394.364 -56.4916C381.303 -68.9024 373.709 -72.6804 365.591 -96.1992C357.473 -119.718 358.364 -111.509 338.222 -136.495C318.08 -161.481 322.797 -149.499 315.32 -181.761C307.843 -214.023 294.563 -202.561 285.795 -223.25C277.026 -243.94 275.199 -244.055 258.602 -263.871",
  ], []);

  const colors = useMemo(() => ["#7EF6A1", "#5FD689", "#7EF6A1"], []);

  return (
    <motion.svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.4,
      }}
    >
      {paths.map((path, idx) => (
        <motion.path
          key={`path-${idx}`}
          d={path}
          stroke={colors[idx % colors.length]}
          strokeWidth="2.3"
          strokeLinecap="round"
          variants={pathVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.floor(Math.random() * 10),
            repeatDelay: Math.floor(Math.random() * 10 + 2),
          }}
        />
      ))}
    </motion.svg>
  );
});

// Easing and helper functions
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Product and vegetable data (memoized)
const products = [
  { id: 1, icon: Sprout, title: 'Elite Genetics', trait: 'Championship bloodlines', startPos: { x: -45, y: -35 }, rotation: -28, stagger: 0, color: 'rgba(126, 246, 161, 0.25)' },
  { id: 2, icon: Zap, title: 'Rapid Growth', trait: '40% faster maturity', startPos: { x: 50, y: -40 }, rotation: 32, stagger: 0.04, color: 'rgba(126, 200, 246, 0.22)' },
  { id: 3, icon: Star, title: 'Proven Yield', trait: '99.2% germination rate', startPos: { x: -55, y: 25 }, rotation: -24, stagger: 0.08, color: 'rgba(246, 200, 126, 0.22)' },
  { id: 4, icon: Microscope, title: 'Lab Certified', trait: 'ISO verified quality', startPos: { x: 48, y: 30 }, rotation: 26, stagger: 0.12, color: 'rgba(200, 126, 246, 0.22)' },
  { id: 5, icon: Package, title: 'Fresh Stock', trait: 'Shipped within 48hrs', startPos: { x: 0, y: -50 }, rotation: -18, stagger: 0.16, color: 'rgba(246, 126, 161, 0.22)' },
];

const vegetables = [
  {
    name: 'Carrots',
    description:
      'Our carrots are carefully bred for consistency, vibrant colour, excellent root shape, and adaptability to diverse growing conditions.',
    image:
      'https://images.stockcake.com/public/1/7/0/17076ac9-fb1c-4a79-ac17-8d02644ea0e8_large/earth-s-orange-treasure-stockcake.jpg',
    icon: '🥕',
  },
  {
    name: 'Beetroot',
    description:
      'High-performing beetroot hybrids selected for colour, uniform roots, and strong performance in key processing and fresh markets.',
    image:
      'https://images.stockcake.com/public/6/b/a/6ba4e0d2-68b7-460e-bf5e-426844743c51_large/fresh-beetroot-display-stockcake.jpg',
    icon: '🫚',
  },
  {
    name: 'Peas',
    description:
      'Premium pea genetics focused on sweetness, pod fill and disease resistance for reliable yield season after season.',
    image:
      'https://images.stockcake.com/public/6/2/2/622170f9-2125-4590-bf65-2fe040c21886_large/fresh-green-peas-stockcake.jpg',
    icon: '🫛',
  },
  {
    name: 'Onion',
    description:
      'Onion varieties with strong skins, firm bulbs and reliable storage performance for demanding supply chains.',
    image:
      'https://images.stockcake.com/public/3/9/a/39a89dc6-2e4b-42d3-b811-aef3933e9f58_large/illuminated-onion-roots-stockcake.jpg',
    icon: '🧅',
  },
];

// FloatingCard component (memoized with hover effects)
const FloatingCard = memo(({ product, progress, reducedMotion }) => {
  const cardRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const cardProgress = useMemo(() => clamp((progress - 0.25 - product.stagger) / (0.75 - product.stagger), 0, 1), [progress, product.stagger]);
  const eased = useMemo(() => easeOutBack(cardProgress), [cardProgress]);

  useEffect(() => {
    if (!cardRef.current || reducedMotion) return;

    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;

    const tx = product.startPos.x * vw * (1 - eased);
    const ty = product.startPos.y * vh * (1 - eased);
    const scale = lerp(TOKENS.animation.startScale, TOKENS.animation.endScale, eased);
    const rotation = product.rotation * (1 - eased);
    const opacity = eased;

    let tiltX = 0, tiltY = 0;
    if (hover && window.innerWidth >= 768) {
      tiltX = (mousePos.y - 0.5) * -TOKENS.animation.hoverTilt;
      tiltY = (mousePos.x - 0.5) * TOKENS.animation.hoverTilt;
    }

    const hoverLift = hover ? -6 : 0;
    const hoverScale = hover ? 1.06 : 1;

    cardRef.current.style.transform = `
      translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty + hoverLift}px), 0)
      scale(${scale * hoverScale})
      rotateZ(${rotation}deg)
      rotateX(${tiltX}deg)
      rotateY(${tiltY}deg)
    `;
    cardRef.current.style.opacity = opacity;

    const shadowAlpha = eased * 0.28;
    cardRef.current.style.boxShadow = `
      0 30px 70px ${product.color.replace('0.22', shadowAlpha)},
      0 10px 30px rgba(0, 0, 0, 0.4)
    `;
  }, [eased, hover, mousePos, product, reducedMotion]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const Icon = product.icon;

  const animatedStyle = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 'clamp(280px, 22vw, 340px)',
    padding: 'clamp(28px, 3vw, 40px)',
    background: 'rgba(10, 10, 10, 0.45)',
    backdropFilter: 'blur(12px) saturate(120%)',
    border: '1px solid rgba(126, 246, 161, 0.12)',
    borderRadius: '24px',
    willChange: 'transform, opacity',
    transition: 'box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    transformStyle: 'preserve-3d',
    cursor: 'pointer',
  };

  const staticStyle = {
    position: 'relative',
    left: 'auto',
    top: 'auto',
    width: 'min(360px, 90vw)',
    margin: '12px auto',
    padding: '28px',
    background: 'rgba(10, 10, 10, 0.65)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(126, 246, 161, 0.2)',
    borderRadius: '20px',
    cursor: 'default',
    transform: 'none',
    opacity: 1,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
  };

  const interactiveHandlers = reducedMotion ? {} : {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onMouseMove: handleMouseMove,
  };

  return (
    <div
      ref={cardRef}
      {...interactiveHandlers}
      className="floating-card"
      style={reducedMotion ? staticStyle : animatedStyle}
    >
      <div style={{ 
        fontSize: 'clamp(48px, 5vw, 64px)',
        marginBottom: '16px',
        color: TOKENS.colors.accent,
        filter: 'drop-shadow(0 0 20px rgba(126, 246, 161, 0.4))',
      }}>
        <Icon size="1em" strokeWidth={1.5} />
      </div>
      <h3 style={{
        fontSize: 'clamp(24px, 2.2vw, 32px)',
        fontWeight: 600,
        color: TOKENS.colors.text,
        marginBottom: '8px',
        letterSpacing: '-0.02em',
      }}>
        {product.title}
      </h3>
      <p style={{
        fontSize: 'clamp(14px, 1.1vw, 16px)',
        color: TOKENS.colors.textSecondary,
        marginBottom: '20px',
      }}>
        {product.trait}
      </p>
      <button
        style={{
          padding: '10px 24px',
          background: `linear-gradient(135deg, ${TOKENS.colors.accent}, rgba(126, 246, 161, 0.8))`,
          border: 'none',
          borderRadius: '12px',
          color: TOKENS.colors.bgDeep,
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Learn More
      </button>
    </div>
  );
});

const VegetableCard = memo(({ veg, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    style={{
      position: 'relative',
      height: '500px',
      borderRadius: '24px',
      overflow: 'hidden',
      cursor: 'pointer',
      background: '#000',
    }}
    whileHover={{ scale: 1.02 }}
  >
    <img
      src={veg.image}
      alt={veg.name}
      loading="lazy"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        inset: 0,
      }}
    />
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)',
    }} />
    <div style={{
      position: 'absolute',
      top: '24px',
      right: '24px',
      width: '64px',
      height: '64px',
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
    }}>
      {veg.icon}
    </div>
    <div style={{
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      padding: '32px',
      color: '#fff',
    }}>
      <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>{veg.name}</h3>
      <p style={{ fontSize: '15px', lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>{veg.description}</p>
    </div>
  </motion.div>
));

// ============================================================================
// MAIN APP WITH LOADING INDICATOR
// ============================================================================
export default function WinSeeds() {
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState('hero');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Refs for sections
  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const vegetablesRef = useRef(null);
  const breedingRef = useRef(null);
  const distributionRef = useRef(null);
  const newsRef = useRef(null);
  const aboutRef = useRef(null);

  // Dock items memo
  const dockItems = useMemo(() => [
    { page: 'hero', title: 'Home', icon: <Sprout size={24} strokeWidth={2} />, ref: heroRef },
    { page: 'products', title: 'Our Products', icon: <Package size={24} strokeWidth={2} />, ref: productsRef },
    { page: 'vegetables', title: 'Vegetable Range', icon: <Leaf size={24} strokeWidth={2} />, ref: vegetablesRef },
    { page: 'breeding', title: 'Our Programme', icon: <Microscope size={24} strokeWidth={2} />, ref: breedingRef },
    { page: 'distribution', title: 'Global Partners', icon: <Zap size={24} strokeWidth={2} />, ref: distributionRef },
    { page: 'news', title: 'Latest News', icon: <Star size={24} strokeWidth={2} />, ref: newsRef },
    { page: 'about', title: 'About Us', icon: <X size={24} strokeWidth={2} />, ref: aboutRef },
  ], []);

  // Loading stages tracking
  const [loadingStages, setLoadingStages] = useState({
    images: false,
    fonts: false,
    components: false,
    animationsReady: false,
    allLoaded: false,
  });

  // Wait for full page load (all resources)
  useEffect(() => {
    const handleFullLoad = () => {
      setLoadingStages(s => ({ ...s, allLoaded: true }));
      setLoadingProgress(100);
    };

    // Check if page is already loaded (in case script loads after page load event)
    if (document.readyState === 'complete') {
      handleFullLoad();
    } else {
      window.addEventListener('load', handleFullLoad);
      return () => {
        window.removeEventListener('load', handleFullLoad);
      };
    }
  }, []);

  // Smooth crossfade from loading to content
  useEffect(() => {
    if (loadingStages.allLoaded) {
      setLoadingProgress(100);
      // Reduce timeout to 200ms for quick fade transition with no grey flash
      const hideTimeout = setTimeout(() => setIsFullyLoaded(true), 200);
      return () => clearTimeout(hideTimeout);
    }
  }, [loadingStages.allLoaded]);

  // Preload images
  useEffect(() => {
    const images = [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800',
      'https://images.unsplash.com/photo-1590493026-13ff2f1a0aba?w=800',
      'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800',
      'https://images.unsplash.com/photo-1598030173-74fdeee7a9f2?w=800',
    ];

    let loadedCount = 0;
    const total = images.length;

    const load = (index = 0) => {
      if (index >= total) {
        setLoadingStages(s => ({ ...s, images: true }));
        return;
      }
      const img = new Image();
      img.src = images[index];
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(p => Math.max(p, (loadedCount / total) * 25));
        load(index + 1);
      };
      img.onerror = () => {
        loadedCount++;
        setLoadingProgress(p => Math.max(p, (loadedCount / total) * 25));
        load(index + 1);
      };
    };

    load();
  }, []);

  // Font loading detection
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setLoadingStages(s => ({ ...s, fonts: true }));
        setLoadingProgress(p => Math.max(p, 50));
      });
    } else {
      setTimeout(() => {
        setLoadingStages(s => ({ ...s, fonts: true }));
        setLoadingProgress(p => Math.max(p, 50));
      }, 1000);
    }
  }, []);

  // Motion preference detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMotionPref = () => {
      setReducedMotion(mediaQuery.matches || window.innerWidth < 768);
      setLoadingStages(s => ({ ...s, components: true }));
    };

    updateMotionPref();

    mediaQuery.addEventListener('change', updateMotionPref);
    window.addEventListener('resize', updateMotionPref);

    return () => {
      mediaQuery.removeEventListener('change', updateMotionPref);
      window.removeEventListener('resize', updateMotionPref);
    };
  }, []);

  // Final stage of loading and hide loader
  useEffect(() => {
    if (loadingStages.allLoaded) {
      // allLoaded is set by window.onload, no need for additional delay
      return;
    }
    
    if (loadingStages.images && loadingStages.fonts && loadingStages.components) {
      const t = setTimeout(() => {
        setLoadingStages(s => ({ ...s, animationsReady: true }));
        setLoadingProgress(100);

        const hideTimeout = setTimeout(() => setIsFullyLoaded(true), 800);
        return () => clearTimeout(hideTimeout);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [loadingStages]);

  // Scroll and active section handling after fully loaded
  // Optimized scroll handler - prevents layout thrashing
  useEffect(() => {
    if (!isFullyLoaded || typeof window === 'undefined' || reducedMotion) return;

    let rafId: number | null = null;
    let lastKnownScrollY = 0;
    let ticking = false;

    const updateScroll = () => {
      const scrollY = lastKnownScrollY;
      if (!productsRef.current) { 
        ticking = false; 
        return; 
      }

      const rect = productsRef.current.getBoundingClientRect();
      const top = scrollY + rect.top;
      const viewportHeight = window.innerHeight;
      const start = top - viewportHeight;
      const length = viewportHeight * 4;
      const raw = Math.max(0, Math.min((scrollY - start) / length, 1));

      setScrollProgress(raw);

      const sections = [
        { ref: heroRef, name: 'hero' },
        { ref: productsRef, name: 'products' },
        { ref: vegetablesRef, name: 'vegetables' },
        { ref: breedingRef, name: 'breeding' },
        { ref: distributionRef, name: 'distribution' },
        { ref: newsRef, name: 'news' },
        { ref: aboutRef, name: 'about' },
      ];

      const midpoint = viewportHeight / 2;
      for (const s of sections) {
        if (s.ref.current) {
          const r = s.ref.current.getBoundingClientRect();
          if (r.top <= midpoint && r.bottom >= midpoint) {
            setCurrentPage(s.name);
            break;
          }
        }
      }
      ticking = false;
    };

    const onScroll = () => {
      lastKnownScrollY = window.scrollY;
      if (!ticking) {
        rafId = window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isFullyLoaded, reducedMotion]);

  // Render with smooth crossfade between loading and content
  return (
    <>
      <AnimatePresence>
        {!isFullyLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingScreen progress={loadingProgress} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFullyLoaded ? 1 : 0 }}
        transition={{ duration: 0.3, delay: isFullyLoaded ? 0.3 : 0 }}
        style={{
          pointerEvents: isFullyLoaded ? 'auto' : 'none',
          background: `linear-gradient(180deg, ${TOKENS.colors.bgDeep} 0%, ${TOKENS.colors.bg} 100%)`,
          color: TOKENS.colors.text,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
      {/* Noise texture overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.9\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
        pointerEvents: 'none',
        zIndex: 100,
      }} />

      {/* Top Nav */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 36px',
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(126, 246, 161, 0.1)',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '80px',
        boxSizing: 'border-box',
      }}>
        <img
          src="/logo.png"
          alt="Winseed"
          style={{
            height: '100px',
            width: 'auto',
            display: 'block',
            margin: 0,
            padding: 0,
          }}
        />
        <div style={{ display: 'flex', gap: '32px', fontSize: '16px' }}>
          <a href="#products" style={{ color: TOKENS.colors.textSecondary, textDecoration: 'none' }}>Products</a>
          <a href="#breeding" style={{ color: TOKENS.colors.textSecondary, textDecoration: 'none' }}>Breeding</a>
          <a href="#contact" style={{ color: TOKENS.colors.textSecondary, textDecoration: 'none' }}>Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <BackgroundLines />
        <h1 style={{
          fontSize: 'clamp(56px, 11vw, 140px)',
          fontWeight: 300,
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: '-0.04em',
          marginBottom: '32px',
          position: 'relative',
          zIndex: 10,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        }}>
          <span style={{ color: TOKENS.colors.text, fontWeight: 300 }}>Quality</span>{' '}
          <span style={{ color: TOKENS.colors.accent, fontWeight: 400 }}>Seeds</span>
          <br />
          <span style={{ color: TOKENS.colors.text, fontWeight: 300 }}>with Worldwide</span>
          <br />
          <span style={{ color: TOKENS.colors.accent, fontWeight: 400 }}>Impact</span>
        </h1>
        <FadeInOnScroll delay={0.1}>
          <p style={{
            fontSize: 'clamp(18px, 1.8vw, 24px)',
            color: TOKENS.colors.textSecondary,
            maxWidth: '700px',
            textAlign: 'center',
            lineHeight: 1.7,
            position: 'relative',
            zIndex: 10,
            fontWeight: 300,
          }}>
            Premium seed breeding with verified performance.
            <br />
            Scroll to explore our collection.
          </p>
        </FadeInOnScroll>
      </section>

      {/* Products Section */}
      <section
        id="products"
        ref={productsRef}
        style={{
          minHeight: typeof window !== 'undefined' && window.innerWidth < 768 ? 'auto' : `${TOKENS.animation.stickyHeight}vh`,
          position: 'relative',
          background: '#050505',
        }}
      >
        {typeof window !== 'undefined' && window.innerWidth >= 768 && (
          <>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${Math.max(0.1, 1 - scrollProgress * 1.2)})`,
              opacity: Math.max(0, 1 - scrollProgress * 1.5),
              fontSize: 'clamp(60px, 12vw, 180px)',
              fontWeight: 200,
              letterSpacing: '-0.04em',
              textAlign: 'center',
              lineHeight: 1.1,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 10,
              willChange: 'transform, opacity',
            }}>
              Our
              <br />
              <span style={{ color: TOKENS.colors.accent, fontWeight: 300 }}>Premium</span>
              <br />
              Collection
            </div>
            <div style={{
              position: 'sticky',
              top: 0,
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {products.map(product => (
                <FloatingCard
                  key={product.id}
                  product={product}
                  progress={scrollProgress}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </>
        )}

        {typeof window !== 'undefined' && window.innerWidth < 768 && (
          <>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 700,
                margin: '24px 16px 12px',
                color: '#fff',
              }}
            >
              <span>Our </span>
              <span style={{ color: TOKENS.colors.accent }}>Premium</span>{' '}
              <span>Collection</span>
            </h2>
            <div
              style={{
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'hidden',
                gap: '12px',
                padding: '0 16px 32px',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {products.map(product => (
                <div
                  key={product.id}
                  style={{
                    flex: '0 0 80vw',
                    maxWidth: '320px',
                  }}
                >
                  <FloatingCard
                    product={product}
                    progress={1}
                    reducedMotion={true}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Vegetable Range Section */}
      <section
        id="vegetables"
        ref={vegetablesRef}
        style={{
          minHeight: '80vh',
          padding: '80px 40px',
          background: '#f5f5f7',
        }}
      >
        <FadeInOnScroll>
          <h2 style={{
            fontSize: 'clamp(32px, 7vw, 72px)',
            fontWeight: 700,
            marginBottom: '16px',
            color: '#000',
            textAlign: 'center',
            wordBreak: 'break-word',
            maxWidth: '94vw',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <span style={{ color: '#000' }}>Our</span>{' '}
            <span style={{ color: TOKENS.colors.accent }}>Vegetable</span>{' '}
            <span style={{ color: '#000' }}>Range</span>
          </h2>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.1}>
          <div
            style={{
              width: '100%',
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: '16px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '18px',
                minHeight: '320px',
                alignItems: 'flex-start',
              }}
            >
              {vegetables.map((veg, i) => (
                <div
                  key={veg.name}
                  style={{
                    flex: '0 0 80vw',
                    maxWidth: '340px',
                  }}
                >
                  <VegetableCardOptimized veg={veg} index={i} />
                </div>
              ))}
            </div>
          </div>
        </FadeInOnScroll>
      </section>

      {/* Breeding Section */}
      <section
        id="breeding"
        ref={breedingRef}
        style={{
          padding: '72px 20px',
          background: '#050505',
        }}
      >
        <div
          style={{
            maxWidth: '1024px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Left copy block */}
          <div
            style={{
              color: TOKENS.colors.text,
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(32px, 5.5vw, 52px)',
                fontWeight: 300,
                marginBottom: '16px',
                letterSpacing: '-0.03em',
              }}
            >
              <span style={{ color: '#fff' }}>Plant</span>{' '}
              <span style={{ color: TOKENS.colors.accent }}>Breeder</span>
            </h2>
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.7,
                color: TOKENS.colors.textSecondary,
                maxWidth: '540px',
              }}
            >
              Winseed is a plant breeder, producer, and distributor of quality vegetable
              seeds, aiming to be a global leader in a carefully-selected portfolio.
            </p>
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.7,
                color: TOKENS.colors.textSecondary,
                marginTop: '16px',
                maxWidth: '540px',
              }}
            >
              Our flagship products include carrots, beetroot and peas, with our activities
              mostly focused on these products. Several other products including radish and
              broad beans are also developed and produced for selected markets.
            </p>
          </div>

          {/* Right stats card */}
          <div
            style={{
              background: 'rgba(10, 10, 10, 0.7)',
              borderRadius: '24px',
              border: '1px solid rgba(126, 246, 161, 0.25)',
              padding: '40px 32px',
              textAlign: 'center',
            }}
          >
            <Leaf size={64} color={TOKENS.colors.accent} strokeWidth={1.2} />
            <h3
              style={{
                fontSize: '32px',
                margin: '24px 0 8px',
                fontWeight: 600,
                color: TOKENS.colors.text,
              }}
            >
              15+ Years
            </h3>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: TOKENS.colors.textSecondary,
              }}
            >
              Of breeding excellence and genetic refinement
            </p>
          </div>
        </div>
      </section>

      {/* Distribution Section */}
      <section
        id="distribution"
        ref={distributionRef}
        style={{
          padding: '80px 0',
          background: '#fff',
        }}
      >
        <FadeInOnScroll>
          <h2 style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 700,
            marginBottom: '32px',
            color: '#000',
            textAlign: 'center',
            padding: '0 40px',
          }}>
            <span style={{ color: '#000' }}>Our</span>{' '}
            <span style={{ color: TOKENS.colors.accent }}>Global</span>{' '}
            <span style={{ color: '#000' }}>Distribution</span>{' '}
            <span style={{ color: TOKENS.colors.accent }}>Partners</span>
          </h2>
        </FadeInOnScroll>

        <div
          style={{
            width: '100%',
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '0 40px',
          }}
        >
          <FadeInOnScroll delay={0.1}>
            <div
              style={{
                width: '100%',
                aspectRatio: '16 / 6',
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#000',
              }}
            >
              <Suspense fallback={<SectionFallback label="Global distribution" />}>
                <WorldMapDemo />
              </Suspense>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* News Section */}
      <section id="news" ref={newsRef} style={{
        minHeight: '80vh',
        padding: '80px 40px',
        background: '#f5f5f7',
        position: 'relative',
      }}>
        <FadeInOnScroll>
          <h2 style={{
            fontSize: 'clamp(34px, 5vw, 56px)',
            fontWeight: 700,
            marginBottom: '24px',
            color: '#000',
          }}>
            <span style={{ color: TOKENS.colors.accent }}>Latest</span>{' '}
            <span style={{ color: '#000' }}>news from</span>{' '}
            <span style={{ color: TOKENS.colors.accent }}>Winseed.</span>
          </h2>
        </FadeInOnScroll>

        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <FadeInOnScroll delay={0.1}>
            <Suspense fallback={<SectionFallback label="Latest news" />}>
              <AppleCardsCarouselDemo />
            </Suspense>
          </FadeInOnScroll>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} style={{
        minHeight: '100vh',
        padding: '120px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          <div style={{ marginBottom: '80px' }}>
            <FadeInOnScroll>
              <h2 style={{
                fontSize: 'clamp(40px, 6vw, 72px)',
                fontWeight: 200,
                marginBottom: '32px',
                letterSpacing: '-0.03em',
              }}>
                We are proud to be helping address the growing
                <br />
                <span style={{ color: TOKENS.colors.accent }}>global demand</span> for healthy, nutritious,
                <br />
                plant-based food.
              </h2>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.1}>
              <p style={{
                fontSize: '20px',
                lineHeight: 1.8,
                color: TOKENS.colors.textSecondary,
                maxWidth: '800px',
              }}>
                From our headquarters in New Zealand, we invest in research and plant breeding, product development and production to bring quality seeds to the world.
              </p>
            </FadeInOnScroll>
          </div>

          <FadeInOnScroll delay={0.15}>
            <div style={{ display: 'grid', gap: '24px' }}>
              {[
                { label: 'Research & development', title: 'Our Breeding Programme' },
                { label: 'Products available', title: 'Our Seed Varieties' },
                { label: 'Where you can buy', title: 'Our Distribution Partners' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(10, 10, 10, 0.45)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(126, 246, 161, 0.12)',
                  borderRadius: '20px',
                  padding: '40px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(8px)';
                  e.currentTarget.style.borderColor = 'rgba(126, 246, 161, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = 'rgba(126, 246, 161, 0.12)';
                }}
                >
                  <div>
                    <p style={{ fontSize: '14px', color: TOKENS.colors.textSecondary, marginBottom: '8px' }}>{item.label}</p>
                    <h3 style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: TOKENS.colors.accent, fontWeight: 600 }}>{item.title}</h3>
                  </div>
                  <div style={{ fontSize: '32px', color: TOKENS.colors.accent }}>→</div>
                </div>
              ))}
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{
        minHeight: '60vh',
        padding: '120px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <FadeInOnScroll>
          <h2 style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 200,
            marginBottom: '32px',
            letterSpacing: '-0.03em',
          }}>
            Our <span style={{ color: TOKENS.colors.accent }}>Mission</span>
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <p style={{
            fontSize: 'clamp(18px, 2vw, 24px)',
            color: TOKENS.colors.text,
            maxWidth: '1000px',
            lineHeight: 1.6,
            marginBottom: '48px',
          }}>
            To drive a vertically-integrated ecosystem that delivers high-quality products and solutions that exceed the needs of the market.
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '60px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <div style={{
              padding: '16px 48px',
              background: TOKENS.colors.accent,
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 700,
              color: TOKENS.colors.bgDeep,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              RESEARCH & DEVELOPMENT
            </div>
            <div style={{
              padding: '16px 48px',
              background: TOKENS.colors.accent,
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 700,
              color: TOKENS.colors.bgDeep,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              PRODUCTION & DISTRIBUTION
            </div>
          </div>
        </FadeInOnScroll>

        {/* Process Flow */}
        <FadeInOnScroll delay={0.2}>
          <div style={{ width: '100%', maxWidth: '1400px' }}>
            <h3 style={{
              textAlign: 'center',
              color: TOKENS.colors.text,
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: 600,
              marginBottom: '60px',
              letterSpacing: '-0.02em',
            }}>
              From Insight to Impact
            </h3>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
              marginBottom: '32px',
            }}>
              {/* Step 1 */}
              <div style={{ textAlign: 'center', flex: '0 1 auto' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 16px',
                  background: 'rgba(126, 246, 161, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                }}>
                  🔍
                </div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: TOKENS.colors.text,
                  margin: '0',
                }}>
                  Understand<br />Grower Needs
                </p>
              </div>

              {/* Arrow 1 */}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  color: TOKENS.colors.accent,
                  fontSize: '22px',
                  margin: '0 8px',
                  flex: '0 0 auto',
                }}
              >
                →
              </motion.div>

              {/* Step 2 */}
              <div style={{ textAlign: 'center', flex: '0 1 auto' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 16px',
                  background: 'rgba(126, 246, 161, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                }}>
                  🧬
                </div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: TOKENS.colors.text,
                  margin: '0',
                }}>
                  Develop Elite Genetics
                </p>
              </div>

              {/* Arrow 2 */}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                style={{
                  color: TOKENS.colors.accent,
                  fontSize: '22px',
                  margin: '0 8px',
                  flex: '0 0 auto',
                }}
              >
                →
              </motion.div>

              {/* Step 3 */}
              <div style={{ textAlign: 'center', flex: '0 1 auto' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 16px',
                  background: 'rgba(126, 246, 161, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Sprout size={40} color={TOKENS.colors.accent} />
                </div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: TOKENS.colors.text,
                  margin: '0',
                }}>
                  Create New Varieties
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
            }}>
              {/* Step 4 */}
              <div style={{ textAlign: 'center', flex: '0 1 auto' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 16px',
                  background: 'rgba(126, 246, 161, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                }}>
                  🚜
                </div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: TOKENS.colors.text,
                  margin: '0',
                }}>
                  Multiply High‑<br />Performing Seed
                </p>
              </div>

              {/* Arrow 3 */}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                style={{
                  color: TOKENS.colors.accent,
                  fontSize: '22px',
                  margin: '0 8px',
                  flex: '0 0 auto',
                }}
              >
                →
              </motion.div>

              {/* Step 5 */}
              <div style={{ textAlign: 'center', flex: '0 1 auto' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 16px',
                  background: 'rgba(126, 246, 161, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Package size={40} color={TOKENS.colors.accent} />
                </div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: TOKENS.colors.text,
                  margin: '0',
                }}>
                  Quality Processing<br />&amp; Grading
                </p>
              </div>

              {/* Arrow 4 */}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                style={{
                  color: TOKENS.colors.accent,
                  fontSize: '22px',
                  margin: '0 8px',
                  flex: '0 0 auto',
                }}
              >
                →
              </motion.div>

              {/* Step 6 */}
              <div style={{ textAlign: 'center', flex: '0 1 auto' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 16px',
                  background: 'rgba(126, 246, 161, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                }}>
                  ✈️
                </div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: TOKENS.colors.text,
                  margin: '0',
                }}>
                  Deliver Seeds<br />Worldwide
                </p>
              </div>
            </div>
          </div>
        </FadeInOnScroll>
      </section>

      {/* Floating Dock */}
      <FloatingDock currentPage={currentPage} items={dockItems} />
      </motion.div>
    </>
  );
}
