import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.webp';

import './Header.css';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogo = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
      <div className='header'>
        <div className="logo-title" onClick={handleLogo}>
          <img src={logo} alt="logo" />
          <h2>Pictures With Wild</h2>
        </div>
        {username && (
          <ul className='menu'>
            <li onClick={() => navigate('/ImageUpload')}><a href='javascript:void(0)'>Upload Images</a></li>
            <li onClick={() => navigate('/ImageList')}><a href='javascript:void(0)'>Available Images</a></li>
            <li onClick={handleLogout}><a href='javascript:void(0)'>Logout</a></li>
          </ul>
        )}
      </div>
  );
};

export default Header;
