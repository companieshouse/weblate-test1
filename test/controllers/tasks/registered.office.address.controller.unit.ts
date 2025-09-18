jest.mock("../../../src/middleware/company.authentication.middleware");
jest.mock("../../../src/services/company.profile.service");
jest.mock("../../../src/utils/update.confirmation.statement.submission");

import request from "supertest";
import mocks from "../../mocks/all.middleware.mock";
import { companyAuthenticationMiddleware } from "../../../src/middleware/company.authentication.middleware";
import app from "../../../src/app";
import { REGISTERED_OFFICE_ADDRESS_PATH, TASK_LIST_PATH, urlParams, WRONG_RO_PATH } from "../../../src/types/page.urls";
import { urlUtils } from "../../../src/utils/url";
import { getCompanyProfile } from "../../../src/services/company.profile.service";
import { validCompanyProfile } from "../../mocks/company.profile.mock";
import { REGISTERED_OFFICE_ADDRESS_ERROR, SECTIONS } from "../../../src/utils/constants";
import { sendUpdate } from "../../../src/utils/update.confirmation.statement.submission";
import { SectionStatus } from "@companieshouse/api-sdk-node/dist/services/confirmation-statement";

const mockCompanyAuthenticationMiddleware = companyAuthenticationMiddleware as jest.Mock;
mockCompanyAuthenticationMiddleware.mockImplementation((req, res, next) => next());
const mockGetCompanyProfile = getCompanyProfile as jest.Mock;
const mockSendUpdate = sendUpdate as jest.Mock;

const PAGE_HEADING = "Review the registered office address";
const EXPECTED_ERROR_TEXT = "Sorry, there is a problem with the service";
const COMPANY_NUMBER = "12345678";

const REGISTERED_OFFICE_ADDRESS_URL = REGISTERED_OFFICE_ADDRESS_PATH.replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER);
const TASK_LIST_URL = TASK_LIST_PATH.replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER);
const WRONG_RO_URL = WRONG_RO_PATH.replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER);

describe("Registered Office Address controller tests", () => {

  beforeEach(() => {
    mocks.mockAuthenticationMiddleware.mockClear();
    mocks.mockServiceAvailabilityMiddleware.mockClear();
    mocks.mockSessionMiddleware.mockClear();
    mockGetCompanyProfile.mockClear();
    mockSendUpdate.mockClear();
  });

  it("Should navigate to the Registered Office Address page", async () => {
    mockGetCompanyProfile.mockResolvedValueOnce(validCompanyProfile);
    const response = await request(app).get(REGISTERED_OFFICE_ADDRESS_URL);

    expect(response.text).toContain(PAGE_HEADING);
    expect(response.text).toContain("Check the registered office address");
    expect(response.text).toContain(validCompanyProfile.registeredOfficeAddress.addressLineOne);
    expect(response.text).toContain(validCompanyProfile.registeredOfficeAddress.addressLineTwo);
    expect(response.text).toContain(validCompanyProfile.registeredOfficeAddress.postalCode);
  });

  it("Should redirect to an error page when error is thrown", async () => {
    const spyGetUrlToPath = jest.spyOn(urlUtils, "getUrlToPath");
    spyGetUrlToPath.mockImplementationOnce(() => { throw new Error(); });
    const response = await request(app).get(REGISTERED_OFFICE_ADDRESS_URL);

    expect(response.text).toContain(EXPECTED_ERROR_TEXT);

    // restore original function so it is no longer mocked
    spyGetUrlToPath.mockRestore();
  });

  it("Should return to task list page when roa is confirmed", async () => {
    const response = await request(app).post(REGISTERED_OFFICE_ADDRESS_URL).send({ registeredOfficeAddress: "yes" });

    expect(mockSendUpdate.mock.calls[0][1]).toBe(SECTIONS.ROA);
    expect(mockSendUpdate.mock.calls[0][2]).toBe(SectionStatus.CONFIRMED);
    expect(response.status).toEqual(302);
    expect(response.header.location).toEqual(TASK_LIST_URL);
  });

  it("Should display stop screen if roa details are incorrect", async () => {
    const response = await request(app).post(REGISTERED_OFFICE_ADDRESS_URL).send({ registeredOfficeAddress: "no" });

    expect(mockSendUpdate.mock.calls[0][1]).toBe(SECTIONS.ROA);
    expect(mockSendUpdate.mock.calls[0][2]).toBe(SectionStatus.NOT_CONFIRMED);
    expect(response.status).toEqual(302);
    expect(response.header.location).toEqual(WRONG_RO_URL);
  });

  it("Should redirect to task list when recently filed radio button is selected", async () => {
    const response = await request(app)
      .post(REGISTERED_OFFICE_ADDRESS_URL)
      .send({ registeredOfficeAddress: "recently_filed" });

    expect(response.status).toEqual(302);
    expect(response.header.location).toEqual(TASK_LIST_URL);
    expect(mockSendUpdate.mock.calls[0][1]).toBe(SECTIONS.ROA);
    expect(mockSendUpdate.mock.calls[0][2]).toBe(SectionStatus.RECENT_FILING);
  });

  it("Should redisplay roa page with error when radio button is not selected", async () => {
    mockGetCompanyProfile.mockResolvedValueOnce(validCompanyProfile);
    const response = await request(app).post(REGISTERED_OFFICE_ADDRESS_URL);

    expect(response.status).toEqual(200);
    expect(response.text).toContain(PAGE_HEADING);
    expect(response.text).toContain(REGISTERED_OFFICE_ADDRESS_ERROR);
    expect(response.text).toContain("Check the registered office address");
  });

  it("Should return error page when radio button id is not valid", async () => {
    const response = await request(app)
      .post(REGISTERED_OFFICE_ADDRESS_URL)
      .send({ registeredOfficeAddress: "malicious code block" });

    expect(response.status).toEqual(500);
    expect(response.text).toContain(EXPECTED_ERROR_TEXT);
  });

  it("Should return an error page if error is thrown in post function", async () => {
    const spyGetUrlToPath = jest.spyOn(urlUtils, "getUrlToPath");
    spyGetUrlToPath.mockImplementationOnce(() => { throw new Error(); });
    const response = await request(app).post(REGISTERED_OFFICE_ADDRESS_URL);

    expect(response.text).toContain(EXPECTED_ERROR_TEXT);

    // restore original function so it is no longer mocked
    spyGetUrlToPath.mockRestore();
  });

});
