const axios = require("axios");

const getProducts = async (accessToken, shop) => {
  const url = `https://${shop}/admin/api/2020-10/products.json`;

  const shopifyHeaders = (token) => ({
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
  });

  const getProducts = await axios.get(url, {
    headers: shopifyHeaders(accessToken),
  });

  return getProducts;
};

const deleteProduct = async (accessToken, shop, productID) => {
  const url = `https://${shop}/admin/api/2020-10/products/${productID}.json`;

  const shopifyHeaders = (token) => ({
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
  });

  await axios
    .delete(url, {
      headers: shopifyHeaders(accessToken),
    })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
};

module.exports = {getProducts, deleteProduct};
