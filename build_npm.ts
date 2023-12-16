import { build, emptyDir } from "https://deno.land/x/dnt@0.39.0/mod.ts";
import { resolve } from "https://deno.land/std@0.208.0/path/mod.ts";

const npmOutDir = "./npm";

await emptyDir(npmOutDir);

const version = "0.0.2";

Promise.all([
  build({
    entryPoints: ["./annotation.ts", "./dateTime.ts", "./url.ts"],
    outDir: npmOutDir,
    shims: {
      deno: true,
    },
    package: {
      name: "@narumincho/simple-graphql-server-common",
      version,
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
  Deno.writeTextFile(
    resolve(npmOutDir, "README.md"),
    `# simple_graphql_server_common@v${version}

GraphQL server common library for https://github.com/narumincho/dart-packages/tree/main/packages/simple_graphql_client_gen
`
  ),
]);
