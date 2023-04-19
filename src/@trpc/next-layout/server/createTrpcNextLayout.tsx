/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { QueryClient, dehydrate } from "@tanstack/query-core";
import type { DehydratedState } from "@tanstack/react-query";
import type {
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  DataTransformer,
  MaybePromise,
  ProcedureRouterRecord,
  ProcedureType,
  inferProcedureInput,
  inferProcedureOutput,
  inferRouterContext,
} from "@trpc/server";
import { createRecursiveProxy } from "@trpc/server/shared";

import { getRequestStorage } from "./local-storage";
import "server-only";

interface CreateTRPCNextLayoutOptions<TRouter extends AnyRouter> {
  router: TRouter;
  createContext: () => MaybePromise<inferRouterContext<TRouter>>;
  transformer?: DataTransformer;
}

/**
 * @internal
 */
export type DecorateProcedure<TProcedure extends AnyProcedure> =
  TProcedure extends AnyQueryProcedure
    ? {
        fetch(
          input: inferProcedureInput<TProcedure>
        ): Promise<inferProcedureOutput<TProcedure>>;
        fetchInfinite(
          input: inferProcedureInput<TProcedure>
        ): Promise<inferProcedureOutput<TProcedure>>;
      }
    : never;

type OmitNever<TType> = Pick<
  TType,
  {
    [K in keyof TType]: TType[K] extends never ? never : K;
  }[keyof TType]
>;
/**
 * @internal
 */
export type DecoratedProcedureRecord<
  TProcedures extends ProcedureRouterRecord,
  TPath extends string = ""
> = OmitNever<{
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<
        TProcedures[TKey]["_def"]["record"],
        `${TPath}${TKey & string}.`
      >
    : TProcedures[TKey] extends AnyQueryProcedure
    ? DecorateProcedure<TProcedures[TKey]>
    : never;
}>;

type CreateTRPCNextLayout<TRouter extends AnyRouter> = DecoratedProcedureRecord<
  TRouter["_def"]["record"]
> & {
  dehydrate(): Promise<DehydratedState>;
};

function getQueryKey(
  path: string[],
  input: unknown,
  isFetchInfinite?: boolean
) {
  return input === undefined
    ? [path, { type: isFetchInfinite ? "infinite" : "query" }] // We added { type: "infinite" | "query"  }, because it is how trpc v10.0 format the new queryKeys
    : [
        path,
        {
          input: { ...input },
          type: isFetchInfinite ? "infinite" : "query",
        },
      ];
}

export function createTRPCNextLayout<TRouter extends AnyRouter>(
  opts: CreateTRPCNextLayoutOptions<TRouter>
): CreateTRPCNextLayout<TRouter> {
  function getState() {
    const requestStorage = getRequestStorage<{
      _trpc: {
        queryClient: QueryClient;
        context: inferRouterContext<TRouter>;
      };
    }>();
    requestStorage._trpc = requestStorage._trpc ?? {
      cache: Object.create(null),
      context: opts.createContext(),
      queryClient: new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
    };
    return requestStorage._trpc;
  }
  const transformer = opts.transformer ?? {
    serialize: (v) => v,
    deserialize: (v) => v,
  };

  return createRecursiveProxy(async (callOpts) => {
    const path = [...callOpts.path];
    const lastPart = path.pop();
    const state = getState();
    const ctx = state.context;
    const { queryClient } = state;

    if (lastPart === "dehydrate" && path.length === 0) {
      if (queryClient.isFetching()) {
        await new Promise<void>((resolve) => {
          const unsub = queryClient.getQueryCache().subscribe((event) => {
            if (event?.query.getObserversCount() === 0) {
              resolve();
              unsub();
            }
          });
        });
      }
      const dehydratedState = dehydrate(queryClient);

      return transformer.serialize(dehydratedState);
    }

    const fullPath = path.join(".");
    const procedure = opts.router._def.procedures[fullPath] as AnyProcedure;

    const type: ProcedureType = "query";

    const input = callOpts.args[0];
    const queryKey = getQueryKey(path, input, lastPart === "fetchInfinite");

    if (lastPart === "fetchInfinite") {
      return queryClient.fetchInfiniteQuery(queryKey, () =>
        procedure({
          rawInput: input,
          path: fullPath,
          ctx,
          type,
        })
      );
    }

    return queryClient.fetchQuery(queryKey, () =>
      procedure({
        rawInput: input,
        path: fullPath,
        ctx,
        type,
      })
    );
  }) as CreateTRPCNextLayout<TRouter>;
}
