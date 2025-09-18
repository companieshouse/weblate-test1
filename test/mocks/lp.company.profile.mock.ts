import { Resource } from "@companieshouse/api-sdk-node";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";

export const validCompanyProfile: CompanyProfile = {
  accounts: {
    nextAccounts: {
      periodEndOn: "2019-10-10",
      periodStartOn: "2019-01-01",
    },
    nextDue: "2020-05-31",
    overdue: false,
  },
  companyName: "Dynamo Innovations",
  companyNumber: "LP123456",
  companyStatus: "active",
  companyStatusDetail: "company status detail",
  confirmationStatement: {
    lastMadeUpTo: "2019-04-30",
    nextDue: "2020-04-30",
    nextMadeUpTo: "2020-03-15",
    overdue: false,
  },
  dateOfCreation: "2014-06-22",
  hasBeenLiquidated: false,
  hasCharges: false,
  hasInsolvencyHistory: false,
  jurisdiction: "england-wales",
  links: {},
  registeredOfficeAddress: {
    addressLineOne: "Line1",
    addressLineTwo: "Line2",
    careOf: "careOf",
    country: "uk",
    locality: "locality",
    poBox: "123",
    postalCode: "POST CODE",
    premises: "premises",
    region: "region",
  },
  sicCodes: ["123", "456", "789"],
  type: "limited-partnership",
  subtype: "limited-partnership"
};

export const validSDKResource: Resource<CompanyProfile> = {
  httpStatusCode: 200,
  resource: validCompanyProfile,
};

export const transactionId = 'trans-123456';

export const submissionId = 'sub-123456';
