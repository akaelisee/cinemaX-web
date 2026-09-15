import { Link } from 'react-router';
import styled from 'styled-components';
import LogoWhite from '@/assets/img/logo-white.png';
import LogoBlue from '@/assets/img/logo-blue.png';

export function Logo() {
  return (
    <LogoImg>
      <Link to="/">
        <img src={LogoWhite} alt="logo" />
      </Link>
    </LogoImg>
  );
}

export function LogoTwo() {
  return (
    <LogoImg>
      <img style={{ width: '240px' }} src={LogoBlue} alt="logo" />
    </LogoImg>
  );
}

const LogoImg = styled.div`
  img {
    width: 140px;
  }
`;
