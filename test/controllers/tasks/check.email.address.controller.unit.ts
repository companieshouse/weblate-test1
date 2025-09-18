jest.mock("../../../src/services/company.profile.service");
jest.mock("../../../src/services/registered.email.address.service");
jest.mock("../../../src/utils/update.confirmation.statement.submission");

import request from "supertest";
import mocks from "../../mocks/all.middleware.mock";
import { validCompanyProfile } from "../../mocks/company.profile.mock";
import app from "../../../src/app";
import { CHECK_EMAIL_ADDRESS_PATH, TASK_LIST_PATH, CHANGE_EMAIL_PATH, RETURN_FROM_REA_PATH } from "../../../src/types/page.urls";
import { urlUtils } from "../../../src/utils/url";
import { getCompanyProfile } from "../../../src/services/company.profile.service";
import { getRegisteredEmailAddress } from "../../../src/services/registered.email.address.service";
import { CHECK_EMAIL_ADDRESS_ERROR, SECTIONS } from "../../../src/utils/constants";
import { sendUpdate } from "../../../src/utils/update.confirmation.statement.submission";
import { SectionStatus } from "@companieshouse/api-sdk-node/dist/services/confirmation-statement";
import { session } from "../../mocks/session.middleware.mock";

const mockGetCompanyProfile = getCompanyProfile as jest.Mock;
const mockGetRegisteredEmailAddress = getRegisteredEmailAddress as jest.Mock;
const mockSendUpdate = sendUpdate as jest.Mock;

const PAGE_HEADING = "Check registered email address";
const PAGE_CONTENT_SAMPLE = "Is the registered email address correct?";
const EXPECTED_ERROR_TEXT = "Sorry, there is a problem with the service";
const EXPECTED_EMAIL = "test@email.com";
const COMPANY_NUMBER = "12345678";
const TRANSACTION_ID = "66454";
const SUBMISSION_ID = "435435";

const CHECK_EMAIL_ADDRESS_URL = urlUtils.getUrlWithCompanyNumberTransactionIdAndSubmissionId(CHECK_EMAIL_ADDRESS_PATH, COMPANY_NUMBER, TRANSACTION_ID, SUBMISSION_ID);
const RETURN_FROM_REA_URL = urlUtils.getUrlWithCompanyNumberTransactionIdAndSubmissionId(RETURN_FROM_REA_PATH, COMPANY_NUMBER, TRANSACTION_ID, SUBMISSION_ID);
const TASK_LIST_URL = urlUtils.getUrlWithCompanyNumberTransactionIdAndSubmissionId(TASK_LIST_PATH, COMPANY_NUMBER, TRANSACTION_ID, SUBMISSION_ID);

describe("Check registered email address controller GET tests", () => {

  beforeEach(() => {
    clearMocks();
  });

  it("Should navigate to the Check registered email address page", async () => {
    mockGetRegisteredEmailAddress.mockResolvedValueOnce(EXPECTED_EMAIL);

    const response = await request(app).get(CHECK_EMAIL_ADDRESS_URL);
    expect(response.text).toContain(PAGE_HEADING);
    expect(response.text).toContain(PAGE_CONTENT_SAMPLE);
    expect(response.text).toContain(EXPECTED_EMAIL);
  });

  it("Should redirect to an error page when error is thrown", async () => {
    const spyGetUrlToPath = jest.spyOn(urlUtils, "getUrlToPath");
    spyGetUrlToPath.mockImplementationOnce(() => { throw new Error(); });
    const response = await request(app).get(CHECK_EMAIL_ADDRESS_URL);

    expect(response.text).toContain(EXPECTED_ERROR_TEXT);

    // restore original function so it is no longer mocked
    spyGetUrlToPath.mockRestore();
  });
});

describe("Check registered email address controller POST tests", () => {

  beforeEach(() => {
    clearMocks();
  });

  it("Should return to task list page when rea is confirmed", async () => {
    const response = await request(app).post(CHECK_EMAIL_ADDRESS_URL).send({ checkEmailAddress: "yes" });

    expect(mockSendUpdate.mock.calls[0][1]).toBe(SECTIONS.EMAIL);
    expect(mockSendUpdate.mock.calls[0][2]).toBe(SectionStatus.CONFIRMED);
    expect(response.status).toEqual(302);
    expect(response.header.location).toEqual(TASK_LIST_URL);
  });

  it("Should route to rea service if email is incorrect", async () => {
    mockGetCompanyProfile.mockResolvedValueOnce(validCompanyProfile);
    mockGetRegisteredEmailAddress.mockResolvedValueOnce(EXPECTED_EMAIL);

    const response = await request(app).post(CHECK_EMAIL_ADDRESS_URL).send({ checkEmailAddress: "no" });

    expect(mockSendUpdate.mock.calls[0][1]).toBe(SECTIONS.EMAIL);
    expect(mockSendUpdate.mock.calls[0][2]).toBe(SectionStatus.NOT_CONFIRMED);
    expect(session.getExtraData("companyNumber")).toEqual(validCompanyProfile.companyNumber);
    expect(session.getExtraData("companyProfile")).toEqual(validCompanyProfile);
    expect(session.getExtraData("registeredEmailAddress")).toEqual(EXPECTED_EMAIL);
    expect(session.getExtraData("returnToConfirmationStatement")).toEqual(true);
    expect(session.getExtraData("confirmationStatementReturnUrl")).toEqual(RETURN_FROM_REA_URL);
    expect(response.status).toEqual(302);
    expect(response.header.location).toEqual(CHANGE_EMAIL_PATH);
  });

  it("Should redirect to task list when recently filed radio button is selected", async () => {
    const response = await request(app).post(CHECK_EMAIL_ADDRESS_URL).send({ checkEmailAddress: "recently_filed" });

    expect(response.status).toEqual(302);
    expect(response.header.location).toEqual(TASK_LIST_URL);
    expect(mockSendUpdate.mock.calls[0][1]).toBe(SECTIONS.EMAIL);
    expect(mockSendUpdate.mock.calls[0][2]).toBe(SectionStatus.RECENT_FILING);
  });

  it("Should redisplay check email page with error when radio button is not selected", async () => {
    mockGetRegisteredEmailAddress.mockResolvedValueOnce(EXPECTED_EMAIL);
    const response = await request(app).post(CHECK_EMAIL_ADDRESS_URL);

    expect(response.status).toEqual(200);
    expect(response.text).toContain(PAGE_HEADING);
    expect(response.text).toContain(CHECK_EMAIL_ADDRESS_ERROR);
    expect(response.text).toContain(PAGE_CONTENT_SAMPLE);
  });

  it("Should return error page when radio button id is not valid", async () => {
    const response = await request(app).post(CHECK_EMAIL_ADDRESS_URL).send({ checkEmailAddress: "malicious code" });

    expect(response.status).toEqual(500);
    expect(response.text).toContain(EXPECTED_ERROR_TEXT);
  });

  it("Should return an error page if error is thrown in post function", async () => {
    const spyGetUrlToPath = jest.spyOn(urlUtils, "getUrlToPath");
    spyGetUrlToPath.mockImplementationOnce(() => { throw new Error(); });
    const response = await request(app).post(CHECK_EMAIL_ADDRESS_URL);

    expect(response.text).toContain(EXPECTED_ERROR_TEXT);

    // restore original function so it is no longer mocked
    spyGetUrlToPath.mockRestore();
  });

});

function clearMocks() {
  mocks.mockAuthenticationMiddleware.mockClear();
  mocks.mockServiceAvailabilityMiddleware.mockClear();
  mocks.mockSessionMiddleware.mockClear();
  mockGetCompanyProfile.mockClear();
  mockGetRegisteredEmailAddress.mockClear();
  mockSendUpdate.mockClear();
}
