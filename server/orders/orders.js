const axios = require("axios");

const createDraftOrder = async (
  accessToken,
  shop,
  items = [],
  title = "",
  quantity = 1,
  price = 0
) => {
  const url = `https://${shop}/admin/api/2020-10/graphql.json`;

  let variantsIDs = "";
  console.log(items);

  if (items.length > 0) {
    variantsIDs = items
      .map((item) => {
        return `{ variantId: "${item}" quantity: ${quantity}}`;
      })
      .join(",");
  } else {
    variantsIDs = `{ title: "${title}" quantity: ${quantity} originalUnitPrice: ${price}}`;
  }

  const CREATE_DRAFT_ORDER_QUERY = JSON.stringify({
    query: `mutation {
              draftOrderCreate(
                  input: {
                      lineItems: [${variantsIDs}]
                  }
              ) {
              draftOrder {
                  id
              }
              userErrors {
                  message
              }
          }
      }`,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: CREATE_DRAFT_ORDER_QUERY,
  });

  const responseJson = await response.json();

  const COMPLETE_DRAFT_ORDER_QUERY = JSON.stringify({
    query: `mutation {
              draftOrderComplete(
                  id: "${responseJson.data.draftOrderCreate.draftOrder.id}"
              ) {
              draftOrder {
                  id
              }
          }
      }`,
  });

  const completeDraftOrderResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: COMPLETE_DRAFT_ORDER_QUERY,
  });

  const responseCompleteDraftOrderJson =
    await completeDraftOrderResponse.json();
  console.log(responseCompleteDraftOrderJson);
};

module.exports = { createDraftOrder };
