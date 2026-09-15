import { Outlet } from 'react-router';
import styled from 'styled-components';
import { Footer } from '@/app/layouts/Footer';
import { Header } from '@/app/layouts/Header';

export function PublicLayout() {
  return (
    <ContainerPage>
      <div className="container__limit">
        <Header />
        <Outlet />
      </div>
      <Footer />
    </ContainerPage>
  );
}

const ContainerPage = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .container__limit {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
  }
`;
