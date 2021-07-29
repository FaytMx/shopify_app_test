require("isomorphic-fetch");
const dotenv = require("dotenv");
const Koa = require("koa");
const next = require("next");

const Router = require("koa-router");
const axios = require("axios");

const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");

const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");

dotenv.config();

const { default: graphQLProxy } = require("@shopify/koa-shopify-graphql-proxy");
const { ApiVersion } = require("@shopify/koa-shopify-graphql-proxy");

const port = parseInt(process.env.PORT) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY } = process.env;

const getSubscriptionUrl = require("./components/graphql/Subscription");
const { getProducts, deleteProduct } = require("./server/products/products");
const {
  installScriptTag,
  deleteScriptTag,
} = require("./server/scripTags/scripTags");
const { createDraftOrder } = require("./server/orders/orders");

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.use(session({ secure: true, sameSite: "none" }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: [
        "read_products",
        "write_products",
        "write_script_tags",
        "read_script_tags",
        "read_orders",
        "write_orders",
        "read_draft_orders",
        "write_draft_orders",
      ],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        // await getSubscriptionUrl(ctx, accessToken, shop);
        ctx.redirect("https://" + shop + "/admin/apps");
      },
    })
  );

  server.use(graphQLProxy({ version: ApiVersion.October20 }));
  server.use(verifyRequest());

  //====================================================//
  //    GET PRODUCTS ROUTER
  //====================================================//

  router.get("/getProducts", verifyRequest(), async (ctx, res) => {
    const { shop, accessToken } = ctx.session;

    const response = await getProducts(accessToken, shop);

    ctx.body = response.data;
    ctx.res.statusCode = 200;
  });

  //====================================================//
  //    DELETE PRODUCTS ROUTER
  //====================================================//
  router.get("/deleteProduct", verifyRequest(), async (ctx, res) => {
    const { shop, accessToken } = ctx.session;
    const productID = ctx.query.id;

    await deleteProduct(accessToken, shop, productID);

    ctx.res.statusCode = 200;
  });

  //====================================================//
  //    CREATE SCRIPT TAGS
  //====================================================//
  router.get("/installScriptTags", verifyRequest(), async (ctx, res) => {
    const { shop, accessToken } = ctx.session;

    await installScriptTag(accessToken, shop);

    ctx.res.statusCode = 200;
  });

  //====================================================//
  //    DELETE SCRIPT TAG
  //====================================================//
  router.get("/uninstallScriptTag", verifyRequest(), async (ctx, res) => {
    const { shop, accessToken } = ctx.session;
    const scriptTagID = ctx.query.id;

    await deleteScriptTag(accessToken, shop, scriptTagID);

    ctx.res.statusCode = 200;
  });

  //====================================================//
  //    createDraftOrder
  //====================================================//
  router.get("/createDraftOrder", verifyRequest(), async (ctx, res) => {
    const { shop, accessToken } = ctx.session;
    const title = ctx.query.title;
    const quantity = ctx.query.quantity;
    const price = ctx.query.price;

    await createDraftOrder(accessToken, shop, title, quantity, price);

    ctx.res.statusCode = 200;
  });

  server.use(router.routes());
  server.use(router.allowedMethods());

  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return;
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
