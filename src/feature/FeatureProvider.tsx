"use client";
import { OpenFeatureProvider, OpenFeature } from "@openfeature/react-sdk";
import { FlagdWebProvider } from "@openfeature/flagd-web-provider";

OpenFeature.setProvider(
  new FlagdWebProvider({
    host: "localhost",
    port: 8013,
    tls: false,
  }),
);

export function FeatureProvider(props: { children: React.ReactNode }) {
  return <OpenFeatureProvider>{props.children}</OpenFeatureProvider>;
}
