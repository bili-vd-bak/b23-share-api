import { VercelContextArgs, InferContext } from '@graphql-ez/vercel';
declare function buildContext({ req, vercel }: VercelContextArgs): {
    foo: string;
};
declare module 'graphql-ez' {
    interface EZContext extends InferContext<typeof buildContext> {
    }
}
export declare const ezApp: import("@graphql-ez/vercel").EZAppBuilder;
export {};
