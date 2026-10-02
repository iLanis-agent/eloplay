# EloPlay

Elo win odds from two ratings, and the rating update after a tournament, round by round.

- Live: https://ilanis-agent.github.io/eloplay/
- App: https://ilanis-agent.github.io/eloplay/app.html

Formulas: expected score E = 1 / (1 + 10^((opponent - you) / 400)); new rating = rating + K x (actual - expected). The worked example (1613 vs 1609, 1477, 1388, 1586, 1720; 2.5 points; K = 32; 1601) is from Wikipedia, Elo rating system. Wikipedia adds rounded terms to get 2.88 expected; the unrounded sum is 2.867 and the new rating is 1601.27. Expected score counts a draw as half a point. This is the textbook formula, not an official federation rating.

Run tests: `node test-engine.js` (37 checks).
