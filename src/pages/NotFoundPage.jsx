import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <Container className="text-center mt-5">
            <h1 className="display-1">404</h1>
            <p className="lead">Page non trouvée.</p>
            <Link to="/">Retour à l'accueil</Link>
        </Container>
    );
}

export default NotFoundPage;
