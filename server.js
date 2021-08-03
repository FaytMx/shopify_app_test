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

const {
  receiveWebhook,
  registerWebhook,
} = require("@shopify/koa-shopify-webhooks");

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY, HOST } = process.env;

const getSubscriptionUrl = require("./components/graphql/Subscription");
const { getProducts, deleteProduct } = require("./server/products/products");
const {
  installScriptTag,
  deleteScriptTag,
} = require("./server/scripTags/scripTags");
const { createDraftOrder } = require("./server/orders/orders");

const theme = require("./server/theme/updateTheme");

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
        "read_themes",
        "write_themes"
      ],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;

        const registerAppUninstallWebhook = await registerWebhook({
          address: `${HOST}/webhooks/app/uninstall`,
          topic: "APP_UNINSTALLED",
          accessToken,
          shop,
          apiVersion: ApiVersion.October20,
        });

        if (registerAppUninstallWebhook.success) {
          console.log("You have successfully installed a Webhook");
        } else {
          console.log(
            "Failed webhook registration",
            registerAppUninstallWebhook.result
          );
        }

        await theme.updateThemeLiquid(accessToken,shop);

        // await getSubscriptionUrl(ctx, accessToken, shop);
        ctx.redirect("https://" + shop + "/admin/apps");
      },
    })
  );

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

  router.post("/webhooks/app/uninstall", webhook, (ctx) => {
    console.log(ctx.state.webhook);
  });

  server.use(graphQLProxy({ version: ApiVersion.October20 }));

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
  router.get("/createDraftOrder", verifyRequest(), async (ctx, resp) => {
    const { shop, accessToken } = ctx.session;
    const type = ctx.query.type;

    if (type == "list") {
      const items = ctx.query.items;
      console.log(items);
      await createDraftOrder(accessToken, shop, items);
    } else {
      const title = ctx.query.title;
      const quantity = ctx.query.quantity;
      const price = ctx.query.price;

      await createDraftOrder(accessToken, shop, [], title, quantity, price);
    }

    ctx.res.statusCode = 200;
  });

  //======================================================//
  //          SEND VERIFY REQUEST WITH ROUTER
  //======================================================//

  router.get("(.*)", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.routes());
  server.use(router.allowedMethods());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
