import styled from 'styled-components';
import { Logo } from '@/shared/ui/Logo';

export function Footer() {
  return (
    <Foot>
      <div className="footer-columns">
        <Logo />
      </div>
    </Foot>
  );
}

const Foot = styled.div`
  text-align: center;
  background-color: #002737;
  margin-top: auto;
  width: 100%;
  .footer-columns {
    padding: 45px 0;
  }
`;
