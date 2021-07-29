import React from "react";
import { Card, Layout, Page } from "@shopify/polaris";
import CreateOrder from "../components/graphql/CreateOrders";

class Orders extends React.Component {
    render() {
        return(
            <Page>
                <Layout.AnnotatedSection title="Orders" description=" Create new Orders">
                    <CreateOrder></CreateOrder>
                </Layout.AnnotatedSection>
            </Page>
        ); 
    }
}

export default Orders;