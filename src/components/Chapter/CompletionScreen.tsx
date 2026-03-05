import { useNavigate } from 'react-router-dom';

export default function CompletionScreen() {
  const navigate = useNavigate();
  return (
    <div className="completion-screen">
      <span className="completion-emoji">🎉</span>
      <h2 style={{ letterSpacing: '-1px' }}>Cours terminé !</h2>
      <p style={{ color: '#a0a0c0', marginTop: '16px' }}>
        Félicitations — tu as complété tous les chapitres du cours.
      </p>
      <button
        className="btn btn-primary"
        style={{ margin: '32px auto 0', display: 'inline-flex' }}
        onClick={() => navigate('/')}
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
