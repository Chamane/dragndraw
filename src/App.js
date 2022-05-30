import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Container, Row, Col, Card } from 'react-bootstrap';
import useMeasure from 'react-use-measure'

import { DragnDraw } from './DragnDraw';

const App = ()=>{

  const [ref, bounds] = useMeasure()

  return (
    <Container>
      <Row className='justify-content-center'>
        <Col md={6} xs={12}>
          <Card className='mt-4' ref={ref}>
            <Card.Body className='m-0 p-0'>
              <DragnDraw width={bounds.width} height={500} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
