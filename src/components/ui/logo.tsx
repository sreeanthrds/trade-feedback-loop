
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 smooth-transition hover:opacity-80"
      onClick={onClick}
    >
      <span className="text-xl md:text-2xl font-serif font-bold text-primary">
        Trady
      </span>
    </Link>
  );
};

export default Logo;
