import React from "react";
import { Card, Layout, Page } from "@shopify/polaris";
import CreateOrder from "../components/graphql/CreateOrders";
import CreateOrdersList from "../components/graphql/CreateOrdersList";

class Orders extends React.Component {
  render() {
    return (
      <Page>
        <Layout>
          <Layout.Section oneHalf>
            <Card title="Manual Orden Creation">
              <Card.Section>
                <CreateOrder></CreateOrder>
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card title="Create Order with Resource List">
              <Card.Section>
                  <CreateOrdersList></CreateOrdersList>
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Orders;
