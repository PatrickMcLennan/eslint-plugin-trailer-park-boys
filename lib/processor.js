module.exports = {
  preprocess(text, filename) {
    const quoteToRuleMap = {
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

    return [
      text
        .replace(/\/\/\s*frig off ricky/g, "// eslint-disable-next-line")
        .replace(/\/\/\s*let the liquor do the thinking/g, "// eslint-disable")
        .replace(
          /\/\/\s*nobody wants to admit they ate 9 cans of ravioli/g,
          "// eslint-enable"
        )
        .replace(
          /\/\/\s*i need this to work in the shed/g,
          "// eslint-env node"
        )
        .replace(
          /\/\/\s*this is for the internet people/g,
          "// eslint-env browser"
        )
        .replace(/\/\/\s*the cops are watching/g, "// eslint-env es6")

        .replace(/\/\/\s*frig off ricky:\s*(.+)/g, (match, quote) => {
          const rule = quoteToRuleMap[quote.trim()];
          return rule ? `// eslint-disable-next-line ${rule}` : match;
        })
        .replace(
          /\/\/\s*let the liquor do the thinking:\s*(.+)/g,
          (match, quote) => {
            const rule = quoteToRuleMap[quote.trim()];
            return rule ? `// eslint-disable ${rule}` : match;
          }
        )
        .replace(
          /\/\/\s*nobody wants to admit they ate 9 cans of ravioli:\s*(.+)/g,
          (match, quote) => {
            const rule = quoteToRuleMap[quote.trim()];
            return rule ? `// eslint-enable ${rule}` : match;
          }
        ),
    ];
  },

  postprocess(messages, filename) {
    const ruleToTPBMessage = {
      "no-unused-vars":
        "‘%s'? That's not even a thing, Ricky. You're making shit up again.",

      "no-console":
        "Keep the noise down, boys. You don't go around advertising criminal activity.",

      eqeqeq:
        "It's not 'same same but different,' Ricky. It's gotta be *exactly* the same.",

      "no-debugger":
        "You think Lahey's not watching? Lose the surveillance shit before he shows up drunk with a warrant.",

      semi: "You can't just leave things hangin', Bubbles. That's not how you end a sentence.",

      quotes:
        "Julian only talks in singles. And I mean that in every fuckin' way.",

      "no-magic-numbers":
        "What's with all the random numbers, Ricky? You got a number pad for a brain?",

      "no-shadow":
        "Now there's two Rickys, and neither one knows what the fuck's goin' on.",

      "no-undef":
        "You just made that up, didn't you? That's not a real thing, Julian.",

      "no-redeclare":
        "You already said that, man. You're just goin' in circles like a drunk on a lawn tractor.",

      "no-empty":
        "That's emptier than Randy's veggie drawer. There's nothin' in there but shame.",
    };

    for (const message of messages[0]) {
      const customMessage = ruleToTPBMessage[message.ruleId];
      if (customMessage) {
        if (customMessage.includes("%s")) {
          const match = message.message.match(/'([^']+)'/);
          const variable = match ? match[1] : "that";
          message.message = customMessage.replace("%s", variable);
        } else {
          message.message = customMessage;
        }
      }
    }

    return messages[0];
  },

  supportsAutofix: true,
};
