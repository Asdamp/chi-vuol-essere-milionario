import { test } from "node:test";
import assert from "node:assert/strict";
import { numeroInLettere, lettereInNumero } from "./numero-in-lettere.mjs";

test("casi noti", () => {
  const casi = {
    0: "zero",
    1: "uno",
    8: "otto",
    10: "dieci",
    16: "sedici",
    21: "ventuno",
    28: "ventotto",
    68: "sessantotto",
    100: "cento",
    101: "centouno",
    108: "centotto",
    180: "centottanta",
    181: "centottantuno",
    998: "novecentonovantotto",
    1000: "mille",
    1500: "millecinquecento",
    2000: "duemila",
    4706: "quattromilasettecentosei",
    998500: "novecentonovantottomilacinquecento",
    1000000: "un milione",
    4020000050: "quattro miliardi venti milioni cinquanta",
    18500170: "diciotto milioni cinquecentomilacentosettanta",
    901002500: "novecentoun milioni duemilacinquecento",
  };
  for (const [n, atteso] of Object.entries(casi)) {
    assert.equal(numeroInLettere(Number(n)), atteso, "numeroInLettere(" + n + ")");
  }
});

test("lettereInNumero su casi noti", () => {
  assert.equal(lettereInNumero("quattro miliardi venti milioni cinquanta"), 4020000050);
  assert.equal(lettereInNumero("diciotto milioni cinquecentomilacentosettanta"), 18500170);
  assert.equal(lettereInNumero("novecentonovantottomilacinquecento"), 998500);
  assert.equal(lettereInNumero("mille"), 1000);
});

test("round-trip su numeri scelti", () => {
  const numeri = [
    1, 7, 15, 21, 38, 100, 108, 180, 999, 1000, 1001, 1500, 2000, 4706,
    18500, 998500, 1000000, 1000001, 2000000, 18500170, 4020000050,
    999950000, 901002500, 123456789012,
  ];
  for (const n of numeri) {
    const lettere = numeroInLettere(n);
    assert.equal(lettereInNumero(lettere), n, n + " -> " + lettere);
  }
});

test("round-trip pseudo-casuale", () => {
  let s = 123456789;
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let k = 0; k < 2000; k++) {
    const n = Math.floor(rnd() * 999999999999);
    const lettere = numeroInLettere(n);
    assert.equal(lettereInNumero(lettere), n, n + " -> " + lettere);
  }
});
