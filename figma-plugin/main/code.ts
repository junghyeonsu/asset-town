import { EventHandler } from "@create-figma-plugin/utilities";

export interface GetAssetListHandler extends EventHandler {
  name: "GET_ASSET_LIST";
  handler: (projectId: string, dataset: string) => void;
}

(function main() {
  figma.showUI(__html__, { width: 600, height: 500 });
})();
