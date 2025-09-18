import { Address } from "@companieshouse/api-sdk-node/dist/services/confirmation-statement";
import { appointmentTypes } from "../../src/utils/constants";

const mockNameElements = {
  forename: "Joe",
  surname: "Bloggs",
  title: "Mr"
};

const mockRleNameElements = {
  surname: "THE LEGAL EAGLE"
};

const mockPscUra: Address = {
  addressLine1: "10 this road",
  addressLine2: undefined,
  careOf: undefined,
  country: "Thisland",
  locality: "This town",
  poBox: undefined,
  postalCode: "TH1 1AB",
  premises: undefined,
  region: "Thisshire"
};

const mockPscServiceAddress: Address = {
  addressLine1: "Diddly squat farm shop",
  addressLine2: undefined,
  careOf: undefined,
  country: "England",
  locality: "Chadlington",
  poBox: undefined,
  postalCode: "OX7 3PE",
  premises: undefined,
  region: "Thisshire"
};

const mockRleServiceAddress: Address = {
  addressLine1: "10 That Road",
  addressLine2: undefined,
  careOf: undefined,
  country: "Neverland",
  locality: "The Tall City",
  poBox: undefined,
  postalCode: "TA1 1TA",
  premises: undefined,
  region: "ThatRegion"
};

export const mockPscList: any[] = [
  {
    appointmentType: appointmentTypes.INDIVIDUAL_PSC,
    nameElements: mockNameElements,
    nationality: "British",
    countryOfResidence: "United Kingdom",
    address: mockPscUra,
    serviceAddress: mockPscServiceAddress,
    dateOfBirthIso: "1965-03-21",
    appointmentDate: "1 January 2012",
    naturesOfControl: [
      "75% or more of shares held as a person",
      "Ownership of voting rights - more than 75%"
    ]
  },
  {
    appointmentType: appointmentTypes.RLE_PSC,
    nameElements: mockRleNameElements,
    nationality: "Elf",
    countryOfResidence: "Middle Earth",
    registerLocation: "MIDDLE EARTH",
    serviceAddress: mockRleServiceAddress,
    appointmentDate: "1 January 2013",
    lawGoverned: "THE LAW",
    legalForm: "THE LEGAL FORM",
    registrationNumber: "123456789",
    naturesOfControl: [
      "50% or more of shares held as a person",
      "Ownership of voting rights - more than 50%"
    ]
  },
  {
    appointmentType: appointmentTypes.LEGAL_PERSON_PSC,
    nameElements: mockRleNameElements,
    serviceAddress: mockRleServiceAddress,
    appointmentDate: "1 January 2014",
    lawGoverned: "UK",
    legalForm: "Charity - Unincorporated Association",
    naturesOfControl: [
      "Ownership of voting rights - more than 75%"
    ]
  }
];

export const mockMultiPscList: any[] = [
  {
    appointmentType: appointmentTypes.INDIVIDUAL_PSC,
    nameElements: mockNameElements,
    nationality: "British",
    countryOfResidence: "United Kingdom",
    address: mockPscUra,
    serviceAddress: mockPscServiceAddress,
    dateOfBirthIso: "1965-03-21",
    appointmentDate: "1 January 2012",
    naturesOfControl: [
      "75% or more of shares held as a person",
      "Ownership of voting rights - more than 75%"
    ]
  },
  {
    appointmentType: appointmentTypes.RLE_PSC,
    nameElements: mockRleNameElements,
    nationality: "Elf",
    countryOfResidence: "Middle Earth",
    registerLocation: "MIDDLE EARTH",
    serviceAddress: mockRleServiceAddress,
    appointmentDate: "1 January 2013",
    lawGoverned: "THE LAW",
    legalForm: "THE LEGAL FORM",
    registrationNumber: "123456789",
    naturesOfControl: [
      "50% or more of shares held as a person",
      "Ownership of voting rights - more than 50%"
    ]
  },
  {
    appointmentType: appointmentTypes.RLE_PSC,
    nameElements: mockRleNameElements,
    nationality: "Orc",
    countryOfResidence: "Middle Earth",
    registerLocation: "MIDDLE EARTH",
    serviceAddress: mockRleServiceAddress,
    appointmentDate: "1 January 2014",
    lawGoverned: "THE LAW",
    legalForm: "THE LEGAL FORM",
    registrationNumber: "987654321",
    naturesOfControl: [
      "40% or more of shares held as a person",
      "Ownership of voting rights - more than 40%"
    ]
  },
  {
    appointmentType: appointmentTypes.LEGAL_PERSON_PSC,
    nameElements: mockRleNameElements,
    serviceAddress: mockRleServiceAddress,
    appointmentDate: "1 January 2014",
    lawGoverned: "UK",
    legalForm: "Charity - Unincorporated Association",
    naturesOfControl: [
      "Ownership of voting rights - more than 75%"
    ]
  },
  {
    appointmentType: appointmentTypes.LEGAL_PERSON_PSC,
    nameElements: mockRleNameElements,
    serviceAddress: mockRleServiceAddress,
    appointmentDate: "1 January 2015",
    lawGoverned: "UK",
    legalForm: "Charity - Unincorporated Association",
    naturesOfControl: [
      "Ownership of voting rights - more than 25%"
    ]
  }
];
