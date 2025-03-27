# eslint-plugin-trailer-park-boys

[![npm version](https://img.shields.io/npm/v/eslint-plugin-trailer-park-boys)](https://www.npmjs.com/package/eslint-plugin-trailer-park-boys)
[![Tests](https://img.shields.io/github/actions/workflow/status/patrickmclennan/eslint-plugin-trailer-park-boys/test.yml?branch=main)](https://github.com/patrickmclennan/eslint-plugin-trailer-park-boys/actions)

> Enforce code standards _and_ Canadian humour.

---

If you are a developer from Sunnyvale, this plugin is for you. It allows teams to override standard eslint directives and rules with new aliases, as well as returning clearer, more developer friendly error messages.

Instead of

```javascript
// eslint-disable-next-line no-debugger
debugger;
```

You can now write:

```javascript
// frig off ricky: lahey's watching
debugger;
```

Linting the above without the ignores returns the following error:

```bash
You think Lahey's not watching? Lose the surveillance shit before he shows up drunk with a warrant  no-debugger
```

See below for a mapping of all values.

## 🗺️ Table of values

### Added directive mappings

| Alias                                            | ESLint Equivalent        |
| ------------------------------------------------ | ------------------------ |
| frig off ricky                                   | eslint-disable-next-line |
| let the liquor do the thinking                   | eslint-disable           |
| nobody wants to admit they ate 9 cans of ravioli | eslint-enable            |
| i need this to work in the shed                  | eslint-env node          |
| this is for the internet people                  | eslint-env browser       |
| the cops are watching                            | eslint-env es6           |

### Added rule mappings

| Alias                              | Rule             |
| ---------------------------------- | ---------------- |
| you don't need that, ricky         | no-unused-vars   |
| keep it down, boys                 | no-console       |
| same same, but different           | eqeqeq           |
| lahey's watching                   | no-debugger      |
| finish your sentence, bubbles      | semi             |
| julian only talks in singles       | quotes           |
| what's with all the fuckin numbers | no-magic-numbers |
| too many rickys in here            | no-shadow        |
| what even is that, julian          | no-undef         |
| you already said that, dumbass     | no-redeclare     |
| that's as empty as randy's fridge  | no-empty         |

## 🚀 Install

```bash
npm install --save-dev eslint-plugin-trailer-park-boys
```

In your eslint config, then add the following:

```js
  plugins: ["trailer-park-boys"],
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn",
    "no-debugger": "warn",
    // etc
  },
```

> [!NOTE]
> You still need to enable the eslint rules — this plugin replaces the messages, not the rules themselves.

## ✅ Tests

Sleep well knowing that there is 100% test coverage via [Vitest](https://vitest.dev/) (yes seriously lol)

## 💡 Want to Contribute?

PRs are welcome for new aliases and quotes. Before submitting, ensure that documentation, code and tests have all been updated.

## 🧾 License

MIT © Patrick McLennan
