var E = require('./engine.js'), n = 0, bad = 0;
function near(a, b, tol, m) { n++; if (!(Math.abs(a - b) <= tol)) { bad++; console.log('FAIL', m, a, b); } }
function is(a, b, m) { n++; if (a !== b) { bad++; console.log('FAIL', m, a, b); } }
// equal ratings: expected 0.5; 400 points up: 10/11 = 0.9091 (10 to 1 odds); 200 up: 0.7597
near(E.expected(1500, 1500), 0.5, 1e-12, 'equal'); near(E.expected(1900, 1500), 10 / 11, 1e-12, '400 up'); near(E.expected(1700, 1500), 0.7597, 0.0001, '200 up'); near(E.expected(1500, 1900), 1 / 11, 1e-12, '400 down');
// symmetry: E_A + E_B = 1
[[1613, 1609], [1200, 2100], [800, 1000]].forEach(function (x) { near(E.expected(x[0], x[1]) + E.expected(x[1], x[0]), 1, 1e-12, 'sym ' + x); });
// Wikipedia worked example: A 1613 vs 1609 (L), 1477 (D), 1388 (W), 1586 (W), 1720 (L): expected terms .51 .69 .79 .54 .35 = 2.88, actual 2.5, K=32 -> 1601
var games = [{ opp: 1609, score: 0 }, { opp: 1477, score: 0.5 }, { opp: 1388, score: 1 }, { opp: 1586, score: 1 }, { opp: 1720, score: 0 }];
var u = E.update(1613, 32, games);
near(u.rows[0].e, 0.51, 0.005, 'e1'); near(u.rows[1].e, 0.69, 0.005, 'e2'); near(u.rows[2].e, 0.79, 0.005, 'e3'); near(u.rows[3].e, 0.54, 0.005, 'e4'); near(u.rows[4].e, 0.35, 0.005, 'e5');
near(u.expected, 2.88, 0.02, 'sum (Wikipedia adds the rounded terms)'); near(u.expected, 2.8666, 0.0001, 'unrounded sum'); near(u.actual, 2.5, 0, 'act'); is(Math.round(u.rating), 1601, 'new rating 1601'); is(u.games, 5, 'games');
// Wikipedia: two wins, one loss, two draws = 3 points -> 1617
var g3 = games.map(function (g, i) { return { opp: g.opp, score: [1, 0.5, 1, 0, 0.5][i] }; }); near(E.update(1613, 32, g3).actual, 3, 0, 'act3'); is(Math.round(E.update(1613, 32, g3).rating), 1617, '1617');
// zero-sum between two players in one game with equal K
var a = E.update(1500, 20, [{ opp: 1600, score: 1 }]), b = E.update(1600, 20, [{ opp: 1500, score: 0 }]); near(a.change + b.change, 0, 1e-9, 'zero sum'); near(a.change, 20 * (1 - E.expected(1500, 1600)), 1e-12, 'upset gain');
// scoring exactly the expected score changes nothing
var ex = E.update(1500, 32, [{ opp: 1500, score: 0.5 }]); near(ex.change, 0, 1e-12, 'no change');
// a win over an equal opponent with K 32 gives +16; K 10 gives +5
near(E.update(1500, 32, [{ opp: 1500, score: 1 }]).change, 16, 1e-12, 'k32'); near(E.update(1500, 10, [{ opp: 1500, score: 1 }]).change, 5, 1e-12, 'k10');
// gap and odds
near(E.gap(0.5), 0, 1e-9, 'gap .5'); near(E.gap(10 / 11), 400, 1e-9, 'gap 400'); near(E.gap(0.76), 200, 2, 'gap ~200'); near(E.odds(10 / 11), 10, 1e-9, 'odds 10'); near(E.expected(1500 + E.gap(0.3), 1500), 0.3, 1e-12, 'gap round trip');
// invalid input
is(E.gap(0), null, 'gap 0'); is(E.gap(1), null, 'gap 1'); is(E.odds(1), null, 'odds 1'); is(E.update(1500, 0, games), null, 'k0'); is(E.update(1500, 32, []), null, 'empty'); is(E.update(1500, 32, [{ opp: 1500, score: 0.3 }]), null, 'bad score'); is(E.update(1500, 32, [{ opp: 'x', score: 1 }]), null, 'bad opp'); is(E.update('x', 32, games), null, 'bad r');
console.log((n - bad) + '/' + n + ' passed'); process.exit(bad ? 1 : 0);
