import { ezSchema, EZSchema, gql } from "@graphql-ez/plugin-schema";

import { onedrive_item } from "./onedrive/item";
import { onedrive_raw } from "./onedrive/raw";

const schema: EZSchema = {
  typeDefs: gql`
    type Query {
      hello(test1: String, test2: String): String!
      od(path: String): OD!
    }
    type OD {
      folder(drive: String, nextPageToken: String): OD_folder!
      raw(FileName: String): OD_raw!
    }
    type OD_folder {
      items: [OD_folder_items]!
    }
    type OD_folder_items {
      sharelink: String
      folder: OD_folder_items_folder!
    }
    type OD_folder_items_folder {
      value: [OD_folder_items_folder_value]!
      nextPageToken: String
    }
    type OD_folder_items_folder_value {
      lastModifiedDateTime: String!
      name: String!
      size: Float!
      folder: OD_folder_items_folder_value_folder
    }
    type OD_folder_items_folder_value_folder {
      childCount: Float!
    }
    type OD_raw {
      dlinks: [OD_raw_dlinks]!
    }
    type OD_raw_dlinks {
      sharelink: String!
      dlink: String!
    }
  `,
  resolvers: {
    Query: {
      hello(_root, _args, ctx) {
        return "world";
      },
      od(_root, _args, ctx) {
        return {
          data: {
            path: _args.path,
          },
        };
      },
    },
    OD: {
      async folder(_root, _args, ctx) {
        return await onedrive_item({
          drive: _args.drive,
          path: _root.data.path,
          nextPageToken: _args.nextPageToken,
        });
      },
      async raw(_root, _args, ctx) {
        return await onedrive_raw({
          path: _root.data.path,
          FileName: _args.FileName,
        });
      },
    },
  },
};

export default schema;
