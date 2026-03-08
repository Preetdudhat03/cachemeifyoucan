'use client';
import { useEffect, useState } from 'react';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) { clearInterval(interval); return 95; }
        return p + Math.random() * 18;
      });
    }, 80);

    const onLoad = () => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setHidden(true), 650);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  if (hidden) return null;

  return (
    <div id="loader" className={hidden ? 'hidden' : ''} role="status" aria-label="Loading OptionSight AI">
      <div className="loader-inner">
        <div className="loader-bar">
          <div className="loader-progress" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <span className="loader-text">INITIALIZING OPTIONSIGHT AI</span>
      </div>
    </div>
  );
}
