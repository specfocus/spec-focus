import { Timezone } from './timezone';

describe("Test Timezone", () => {
  it("should parse a correct timezone", () => {
    expect(Timezone.parse("Z08:00").value).toBe("+08:00");
    expect(Timezone.parse("+08:00").value).toBe("+08:00");
    expect(Timezone.parse("-08:00").value).toBe("-08:00");
    expect(Timezone.parse("Z0800").value).toBe("+08:00");
    expect(Timezone.parse("+0800").value).toBe("+08:00");
    expect(Timezone.parse("-0800").value).toBe("-08:00");
  })
})