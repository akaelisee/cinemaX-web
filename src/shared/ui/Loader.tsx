import { useSlowLoad } from '@/shared/hooks/useSlowLoad';

export function Loader({ pending = true, overlay = true }: { pending?: boolean; overlay?: boolean }) {
  const slow = useSlowLoad(pending, 5000);
  const bars = (
    <>
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
      {slow ? (
        <p style={{ color: '#071120', textAlign: 'center', fontSize: '14px', marginTop: '12px' }}>
          Réveil du serveur…
        </p>
      ) : null}
    </>
  );

  if (!overlay) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>{bars}</div>;
  }

  return (
    <div className="abs">
      <div className="abs__loader">{bars}</div>
    </div>
  );
}

export function LoaderPayement() {
  return (
    <div className="lds-container">
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
