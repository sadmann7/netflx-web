"use client";

import { useMemo } from "react";
import { Hydrate, type DehydratedState } from "@tanstack/react-query";
import { type DataTransformer } from "@trpc/server";

export function createHydrateClient(opts: { transformer?: DataTransformer }) {
  return function HydrateClient(props: {
    children: React.ReactNode;
    state: DehydratedState;
  }) {
    const { state, children } = props;

    const transformedState: DehydratedState = useMemo(() => {
      if (opts.transformer) {
        return opts.transformer.deserialize(state) as DehydratedState;
      }
      return state;
    }, [state]);

    return <Hydrate state={transformedState}>{children}</Hydrate>;
  };
}
