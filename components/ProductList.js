import { React } from "react";
import {
  Card,
  ResourceList,
  Avatar,
  ResourceItem,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import { Markup } from "interweave";

const ProductList = (props) => {
  const { products } = props;

  const handleClick = (id) => {
      console.log(id);
  }

  if (!products || products.length == 0) {
    return (
      <Card sectioned>
        <p>No products available</p>
      </Card>
    );
  }

  return (
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
              onClick={handleClick}
            >
              <h3>
                <TextStyle variation="strong">{title}</TextStyle>
              </h3>
              <div>
                <Markup content={body_html}></Markup>
              </div>
            </ResourceItem>
          );
        }}
      />
    </Card>
  );
};

export default ProductList;
