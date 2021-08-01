import React, { useState } from "react";
import {
  ResourceList,
  ResourceItem,
  Thumbnail,
  TextStyle,
  Card,
  Form,
  FormLayout,
  Button,
  TextField,
  Layout,
  SkeletonBodyText,
  SkeletonThumbnail,
} from "@shopify/polaris";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const GET_PRODUCT_VARIANTS = gql`
  query ProductVariants {
    productVariants(first: 10) {
      edges {
        node {
          id
          displayName
          product {
            featuredImage {
              originalSrc
            }
          }
        }
      }
    }
  }
`;
const CreateOrdersList = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  //[1,2,3]
  //items=1&items=2&items=3
  const submitHandler = (event) => {
    fetch(
      `/createDraftOrder?type=list&${selectedItems
        .map((item) => {
          return `items=${item}`;
        })
        .join("&")}`
    ).then((resp) => {
      console.log(resp);
    });
  };

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  let items = [];

  return (
    <>
      <Query query={GET_PRODUCT_VARIANTS}>
        {({ data, loading, error }) => {
          if (loading)
            return (
              <Layout>
                <Layout.Section>
                  <SkeletonThumbnail />
                </Layout.Section>
                <Layout.Section>
                  <SkeletonBodyText />
                </Layout.Section>
              </Layout>
            );
          if (error)
            return (
              <Card>
                <p>{error.message}</p>
              </Card>
            );

          items = data.productVariants.edges;
          return (
            <ResourceList
              resourceName={resourceName}
              items={items}
              renderItem={renderItem}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              selectable
            />
          );
        }}
      </Query>
      <Form onSubmit={submitHandler}>
        <FormLayout>
          <TextField value={selectedItems} type="hidden" />

          <Button submit>Create Order</Button>
        </FormLayout>
      </Form>
    </>
  );
};

const renderItem = (product) => {

  const { node } = product;
  console.log(node);
  const media = <Thumbnail source={node.product.featuredImage ? node.product.featuredImage.originalSrc : ""} />;

  return (
    <ResourceItem
      id={node.id}
      media={media}
      accessibilityLabel={`View details for ${node.displayName}`}
    >
      <h3>
        <TextStyle variation="strong">{node.displayName}</TextStyle>
      </h3>
    </ResourceItem>
  );
};

export default CreateOrdersList;
