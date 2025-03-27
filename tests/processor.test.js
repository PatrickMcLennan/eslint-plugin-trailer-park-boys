import { describe, it, expect } from "vitest";
import processor from "../lib/processor";

// Fake ESLint message format for postprocessing
function createESLintMessage(ruleId, message = "", line = 1, column = 1) {
  return [
    {
      ruleId,
      message,
      line,
      column,
    },
  ];
}

describe("TPB ESLint Plugin", () => {
  describe("preprocess()", () => {
    it("replaces TPB directive aliases with ESLint equivalents", () => {
      const [output] = processor.preprocess(
        `// frig off ricky\nconst x = 1;\n// let the liquor do the thinking: lahey's watching\ndebugger;`,
        "test.js"
      );

      expect(output).toContain("// eslint-disable-next-line");
    });

    it("translates TPB quote alias to known rule", () => {
      const [output] = processor.preprocess(
        `// frig off ricky: you don't need that, ricky\nconst y = 2;`,
        "test.js"
      );

      expect(output).toContain(
        "// eslint-disable-next-line: you don't need that, ricky"
      );
    });

    it("translates all TPB quote aliases to known rules", () => {
      const aliases = {
        "you don't need that, ricky": "no-unused-vars",
        "keep it down, boys": "no-console",
        "same same, but different": "eqeqeq",
        "lahey's watching": "no-debugger",
        "finish your sentence, bubbles": "semi",
        "julian only talks in singles": "quotes",
        "what's with all the fuckin numbers": "no-magic-numbers",
        "too many rickys in here": "no-shadow",
        "what even is that, julian": "no-undef",
        "you already said that, dumbass": "no-redeclare",
        "that's as empty as randy's fridge": "no-empty",
      };

      for (const [quote, rule] of Object.entries(aliases)) {
        const [output] = processor.preprocess(
          `// let the liquor do the thinking: ${quote}\nconst x = 1;`,
          "test.js"
        );
        expect(output).toContain(`// eslint-disable: ${quote}`);
      }
    });

    it("translates all environment directives correctly", () => {
      const directives = {
        "i need this to work in the shed": "// eslint-env node",
        "this is for the internet people": "// eslint-env browser",
        "the cops are watching": "// eslint-env es6",
      };

      for (const [tpbDirective, eslintDirective] of Object.entries(
        directives
      )) {
        const [output] = processor.preprocess(
          `// ${tpbDirective}\nconst x = 1;`,
          "test.js"
        );
        expect(output).toContain(eslintDirective);
      }
    });
  });

  describe("postprocess()", () => {
    it("overrides known ESLint rule messages with TPB quotes", () => {
      const result = processor.postprocess(
        [createESLintMessage("no-console", "Unexpected console statement")],
        "test.js"
      );

      expect(result[0].message).toMatch(/Keep the noise down, boys/);
    });

    it("injects variable into TPB message if available", () => {
      const result = processor.postprocess(
        [
          createESLintMessage(
            "no-unused-vars",
            "'unusedVar' is defined but never used"
          ),
        ],
        "test.js"
      );

      expect(result[0].message).toMatch(
        "‘unusedVar'? That's not even a thing, Ricky. You're making shit up again."
      );
    });

    it("passes through unrecognized rule messages untouched", () => {
      const result = processor.postprocess(
        [createESLintMessage("some-unknown-rule", "This is an unknown rule")],
        "test.js"
      );

      expect(result[0].message).toBe("This is an unknown rule");
    });

    it("translates all ESLint rules to TPB messages", () => {
      const testCases = [
        {
          rule: "eqeqeq",
          message: "Expected === and instead saw ==",
          expected:
            "It's not 'same same but different,' Ricky. It's gotta be *exactly* the same.",
        },
        {
          rule: "no-debugger",
          message: "Unexpected 'debugger' statement",
          expected:
            "You think Lahey's not watching? Lose the surveillance shit before he shows up drunk with a warrant.",
        },
        {
          rule: "semi",
          message: "Missing semicolon",
          expected:
            "You can't just leave things hangin', Bubbles. That's not how you end a sentence.",
        },
        {
          rule: "quotes",
          message: "Strings must use singlequote",
          expected:
            "Julian only talks in singles. And I mean that in every fuckin' way.",
        },
        {
          rule: "no-magic-numbers",
          message: "No magic numbers",
          expected:
            "What's with all the random numbers, Ricky? You got a number pad for a brain?",
        },
        {
          rule: "no-shadow",
          message: "Variable is already declared",
          expected:
            "Now there's two Rickys, and neither one knows what the fuck's goin' on.",
        },
        {
          rule: "no-undef",
          message: "undefined variable",
          expected:
            "You just made that up, didn't you? That's not a real thing, Julian.",
        },
        {
          rule: "no-redeclare",
          message: "Variable is already declared",
          expected:
            "You already said that, man. You're just goin' in circles like a drunk on a lawn tractor.",
        },
        {
          rule: "no-empty",
          message: "Empty block statement",
          expected:
            "That's emptier than Randy's veggie drawer. There's nothin' in there but shame.",
        },
      ];

      for (const { rule, message, expected } of testCases) {
        const result = processor.postprocess(
          [createESLintMessage(rule, message)],
          "test.js"
        );
        expect(result[0].message).toBe(expected);
      }
    });
  });
});
