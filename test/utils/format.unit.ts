import { formatAddressForDisplay, formatTitleCase, toUpperCase } from "../../src/utils/format";
import { Address } from "@companieshouse/api-sdk-node/dist/services/confirmation-statement";

describe("formatTitleCase tests", () => {
  it("should return title case", () => {
    const formatted: string = formatTitleCase("example");
    const formattedCaps: string = formatTitleCase("CAPS");
    const formattedMulti: string = formatTitleCase("format multiple words");
    expect(formatted).toEqual("Example");
    expect(formattedCaps).toEqual("Caps");
    expect(formattedMulti).toEqual("Format Multiple Words");
  });

  it("should return empty string", () => {
    const empty: string = formatTitleCase("");
    const emptyUndefined: string = formatTitleCase(undefined);
    expect(empty).toEqual("");
    expect(emptyUndefined).toEqual("");
  });
});

describe("formatAddressForDisplay tests", () => {
  it("should comma separate address values", () => {
    const address: Address = {
      addressLine1: "10 my street",
      locality: "South Glamorgan",
      country: "UK",
      postalCode: "CF1 1AA"
    } as Address;
    const formattedAddress: string = formatAddressForDisplay(address);

    expect(formattedAddress).toBe("10 my street, South Glamorgan, UK, CF1 1AA");
  });
});

describe("toUpperCase tests", () => {
  it("should convert to upper case", () => {
    const result: string = toUpperCase("this is a test");
    expect(result).toBe("THIS IS A TEST");
  });

  it("should convert to upper case with special chars", () => {
    const result: string = toUpperCase("thîs is á têst");
    expect(result).toBe("THÎS IS Á TÊST");
  });

  it("should return empty string if passed undefined", () => {
    const result: string = toUpperCase(undefined);
    expect(result).toBe("");
  });
});
