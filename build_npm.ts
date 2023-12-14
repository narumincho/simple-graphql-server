import { build, emptyDir } from "https://deno.land/x/dnt@0.39.0/mod.ts";
import { resolve } from "https://deno.land/std@0.208.0/path/mod.ts";

const npmOutDir = "./npm";

await emptyDir(npmOutDir);

Promise.all([
  build({
    entryPoints: ["./annotation.ts", "./dateTime.ts", "./url.ts"],
    outDir: npmOutDir,
    shims: {
      deno: true,
    },
    package: {
      name: "@narumincho/simple-graphql-server-common",
      version: "0.0.1",
      author: "narumincho",
      description:
        "GraphQL server common library for simple_graphql_client_gen",
      license: "MIT",
      repository: {
        type: "git",
        url: "git+https://github.com/narumincho/simple_graphql_server_common",
      },
      bugs: {
        url: "https://github.com/narumincho/simple_graphql_server_common/issues",
      },
    },
  }),
  Deno.copyFile("LICENSE", resolve(npmOutDir, "LICENSE")),
  Deno.copyFile("README.md", resolve(npmOutDir, "README.md")),
]);
