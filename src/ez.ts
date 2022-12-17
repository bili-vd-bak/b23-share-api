import { CreateApp, VercelContextArgs, InferContext } from "@graphql-ez/vercel";
import { ezSchema, EZSchema, gql } from "@graphql-ez/plugin-schema";
import schema from "./schema";

function buildContext({ req, vercel }: VercelContextArgs) {
  // IncomingMessage
  req;

  // VercelRequest
  vercel.req;

  return {
    foo: "bar",
  };
}

// This snippet allows you to infer the context returned by your 'buildContext' and add it to the EZContext interface
declare module "graphql-ez" {
  interface EZContext extends InferContext<typeof buildContext> {}
}

export const ezApp = CreateApp({
  // You can use any valid GraphQL Schema
  ez: {
    plugins: [
      // EZ Plugins
      ezSchema({
        schema,
      }),
    ],
  },
  cors: true,
  envelop: {
    plugins: [
      // Envelop Plugins
    ],
  },
  // Other Options
});
