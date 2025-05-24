import {
  Tailwind,
  Html,
  Container,
  Section,
  Row,
  Column,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function Email() {
  return (
    <Html>
      <Tailwind>
        <Container>
          <Section>
            <Row>
              <Column>Logo</Column>
            </Row>
          </Section>
          <Section>
            <Row>
              <Column>
                <Text>This is a paragraph.</Text>
              </Column>
            </Row>
          </Section>
          <Section></Section>
        </Container>
      </Tailwind>
    </Html>
  );
}
