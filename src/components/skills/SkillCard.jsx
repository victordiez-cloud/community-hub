import { Card, Badge } from 'react-bootstrap';

function SkillCard({ skill }) {
    return (
        <Card className="h-100">
            <Card.Body>
                <Card.Title>{skill.title}</Card.Title>
                <Card.Text className="text-muted">{skill.description}</Card.Text>
            </Card.Body>
            <Card.Footer className="bg-transparent">
                <Badge bg="success" className="fs-6">{skill.daily_price} €/jour</Badge>
            </Card.Footer>
        </Card>
    );
}

export default SkillCard;
