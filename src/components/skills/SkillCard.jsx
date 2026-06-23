import { Card, Badge } from 'react-bootstrap';

function SkillCard({ skill, showAuthor = false }) {
    return (
        <Card className="h-100">
            <Card.Body>
                <Card.Title>{skill.title}</Card.Title>
                {showAuthor && (skill.pseudo || skill.user_pseudo) && (
                    <p className="text-primary small mb-1">
                        {skill.pseudo || skill.user_pseudo}
                    </p>
                )}
                <Card.Text className="text-muted">{skill.description}</Card.Text>
            </Card.Body>
            <Card.Footer className="bg-transparent">
                <Badge bg="success" className="fs-6">{skill.daily_price} €/jour</Badge>
            </Card.Footer>
        </Card>
    );
}

export default SkillCard;
