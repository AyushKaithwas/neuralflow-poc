import { Layer } from "../base";
import { args } from "./zero_padding_2D.config";

export const zero_padding_2d = () =>
  new Layer({
    name: "Zero Padding 2D", // to be shown on our UI
    nameTf: "ZeroPadding2D", // name avaialable in tensorflow
    args,
  });
