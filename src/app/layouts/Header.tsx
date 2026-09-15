import { useEffect, useState } from 'react';
import { NavBar } from '@/app/layouts/NavBar';

export function Header() {
  const [isNav, setIsNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const show = window.pageYOffset > 80;
      setIsNav(show);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <NavBar isNav={isNav} />
    </div>
  );
}
