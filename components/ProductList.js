import { React, useState } from "react";
import {
  Card,
  ResourceList,
  ResourceItem,
  TextStyle,
  Thumbnail,
  Modal,
  TextContainer,
} from "@shopify/polaris";

const ProductList = (props) => {
  const { products } = props;

  const [active, setActive] = useState(false);
  const [pid, setID] = useState(0);

  const handleChange = () => setActive(!active);

  const deleteTitle = `Delete the product with and ID of ${pid}`;

  if (!products || products.length == 0) {
    return (
      <Card sectioned>
        <p>No products available</p>
      </Card>
    );
  }

  return (
    <>
      <Modal
        open={active}
        onClose={handleChange}
        title={deleteTitle}
        primaryAction={{
          content: "Delete",
          onAction: () => {
            fetch(`/deleteProduct?id=${pid}`).then(response => console.log(response));
            handleChange();
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>Are you sure to delete this item?</p>
          </TextContainer>
        </Modal.Section>
      </Modal>

      <Card>
        <ResourceList
          resourceName={{ singular: "product", plural: "products" }}
          items={products}
          renderItem={(product) => {
            const { id, title, body_html } = product;
            const url = product.image.src;
            const media = <Thumbnail source={url} alt={title} />;

            return (
              <ResourceItem
                id={id}
                media={media}
                accessibilityLabel={`View details for ${title}`}
                shortcutActions={{
                  content: "Delete",
                  onAction: () => {
                    setID(id);
                    handleChange();
                  },
                }}
              >
                <h3>
                  <TextStyle variation="strong">{title}</TextStyle>
                </h3>
              </ResourceItem>
            );
          }}
        />
      </Card>
    </>
  );
};

export default ProductList;
