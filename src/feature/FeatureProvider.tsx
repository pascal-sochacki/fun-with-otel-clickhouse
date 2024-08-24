"use client";
import {
  OpenFeatureProvider,
  OpenFeature,
  InMemoryProvider,
} from "@openfeature/react-sdk";

const flagConfig = {
  "new-message": {
    disabled: false,
    variants: {
      on: true,
      off: false,
    },
    defaultVariant: "off",
  },
};

OpenFeature.setProvider(new InMemoryProvider(flagConfig));

export function FeatureProvider(props: { children: React.ReactNode }) {
  return <OpenFeatureProvider>{props.children}</OpenFeatureProvider>;
}
