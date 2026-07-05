Your goal is to update any vulnerable dependencies.

Do the following:
1. Run `npm audit` to find vulnerable installed packages in this project.
2. For each vulnerable package, bump it to the minimum version that resolves the vulnerability while staying compatible with the rest of the pinned dependencies in this project. Do NOT run `npm audit fix` — per CLAUDE.md, dependencies here are pinned to versions known to work together, and `audit fix` can bump past compatible versions and break the app.
3. Run tests and verify the updates didn't break anything.
