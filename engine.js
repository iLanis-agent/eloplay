(function (root) {
  'use strict';
  // Elo rating system (Wikipedia, "Elo rating system"): E_A = 1 / (1 + 10^((R_B - R_A) / 400)), R_A' = R_A + K (S_A - E_A)
  function expected(ra, rb) { return 1 / (1 + Math.pow(10, (rb - ra) / 400)); }
  // rating gap that gives an expected score p (0 < p < 1): d = -400 log10(1/p - 1)
  function gap(p) { if (!(p > 0 && p < 1)) return null; return -400 * Math.log(1 / p - 1) / Math.LN10; }
  function update(r, k, games) {
    r = +r; k = +k;
    if (!isFinite(r) || !(k > 0) || !games || !games.length) return null;
    var exp = 0, act = 0, rows = [];
    for (var i = 0; i < games.length; i++) {
      var g = games[i], opp = +g.opp, s = +g.score;
      if (!isFinite(opp) || !(s === 0 || s === 0.5 || s === 1)) return null;
      var e = expected(r, opp); exp += e; act += s; rows.push({ opp: opp, score: s, e: e });
    }
    var change = k * (act - exp);
    return { expected: exp, actual: act, change: change, rating: r + change, rows: rows, games: games.length };
  }
  // chance of winning a game outright is not given by Elo; the expected score counts a draw as half a point.
  // odds string for expected score p, e.g. 0.909 -> 10.0 : 1
  function odds(p) { if (!(p > 0 && p < 1)) return null; return p / (1 - p); }
  // games you must win in a row to be at about the same rating as an opponent gap: not provided; keep API small.
  var api = { expected: expected, gap: gap, update: update, odds: odds };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.EloPlay = api;
})(typeof window !== 'undefined' ? window : this);
