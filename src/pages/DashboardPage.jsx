import { Container, Card, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function DashboardPage() {
    const { user } = useSelector(state => state.auth);

    return (
        <Container className="mt-5">
            <h2>Mon profil</h2>
            {user ? (
                <Card className="mt-3" style={{ maxWidth: '500px' }}>
                    <Card.Body>
                        <Card.Title>@{user.pseudo}</Card.Title>
                        <Card.Text as="div">
                            <p><strong>Nom :</strong> {user.firstname} {user.lastname}</p>
                            <p><strong>Email :</strong> {user.email}</p>
                            {user.city && <p><strong>Ville :</strong> {user.city}</p>}
                            {user.phone && <p><strong>Téléphone :</strong> {user.phone}</p>}
                            <p>
                                <strong>Statut :</strong>{' '}
                                <Badge bg={user.user_status_id === 2 ? 'warning' : 'secondary'}>
                                    {user.user_status_id === 2 ? 'Organisateur' : 'Utilisateur'}
                                </Badge>
                            </p>
                        </Card.Text>
                    </Card.Body>
                </Card>
            ) : (
                <p className="text-muted mt-3">Chargement du profil...</p>
            )}
        </Container>
    );
}

export default DashboardPage;
