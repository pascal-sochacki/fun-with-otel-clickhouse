export async function GET(request: Request) {
  return Response.json({
    $schema: "https://flagd.dev/schema/v0/flags.json",
    flags: {
      myBoolFlag: {
        state: "ENABLED",
        variants: {
          on: true,
          off: false,
        },
        defaultVariant: "on",
      },
      myStringFlag: {
        state: "ENABLED",
        variants: {
          key1: "val1",
          key2: "val2",
        },
        defaultVariant: "key1",
      },
      myFloatFlag: {
        state: "ENABLED",
        variants: {
          one: 1.23,
          two: 2.34,
        },
        defaultVariant: "one",
      },
      myIntFlag: {
        state: "ENABLED",
        variants: {
          one: 1,
          two: 2,
        },
        defaultVariant: "one",
      },
      myObjectFlag: {
        state: "ENABLED",
        variants: {
          object1: {
            key: "val",
          },
          object2: {
            key: true,
          },
        },
        defaultVariant: "object1",
      },
      isColorYellow: {
        state: "ENABLED",
        variants: {
          on: true,
          off: false,
        },
        defaultVariant: "off",
        targeting: {
          if: [
            {
              "==": [
                {
                  var: ["color"],
                },
                "yellow",
              ],
            },
            "on",
            "off",
          ],
        },
      },
      fibAlgo: {
        variants: {
          recursive: "recursive",
          memo: "memo",
          loop: "loop",
          binet: "binet",
        },
        defaultVariant: "recursive",
        state: "ENABLED",
        targeting: {
          if: [
            {
              $ref: "emailWithFaas",
            },
            "binet",
            null,
          ],
        },
      },
      headerColor: {
        variants: {
          red: "#FF0000",
          blue: "#0000FF",
          green: "#00FF00",
          yellow: "#FFFF00",
        },
        defaultVariant: "red",
        state: "ENABLED",
        targeting: {
          if: [
            {
              $ref: "emailWithFaas",
            },
            {
              fractional: [
                {
                  cat: [{ var: "$flagd.flagKey" }, { var: "email" }],
                },
                ["red", 25],
                ["blue", 25],
                ["green", 25],
                ["yellow", 25],
              ],
            },
            null,
          ],
        },
      },
    },
    $evaluators: {
      emailWithFaas: {
        in: [
          "@faas.com",
          {
            var: ["email"],
          },
        ],
      },
    },
  });
}
