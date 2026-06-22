import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <Container className="text-center mt-5">
            <h1>Bienvenue sur CommunityHub</h1>
            <p className="lead mt-3">
                Une plateforme communautaire permettant à des membres premium de créer des événements,
                proposer leurs compétences, échanger des messages et développer leur réseau.
            </p>
            <div className="d-flex gap-2 justify-content-center mt-4">
                <Button as={Link} to="/register" variant="primary" size="lg">S'inscrire</Button>
                <Button as={Link} to="/login" variant="outline-primary" size="lg">Se connecter</Button>
            </div>
        </Container>
    );
}

export default HomePage;
