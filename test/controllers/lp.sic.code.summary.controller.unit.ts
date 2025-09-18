import middlewareMocks from "../mocks/all.middleware.mock";
import request from "supertest";
import app from "../../src/app";
import { REVIEW_PATH, LP_REVIEW_PATH, LP_SIC_CODE_SUMMARY_PATH, urlParams, LP_CHECK_YOUR_ANSWER_PATH, LP_CS_DATE_PATH } from "../../src/types/page.urls";
import * as limitedPartnershipUtils from "../../src/utils/limited.partnership";
import * as sessionAcspUtils from "../../src/utils/session.acsp";
import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";

const COMPANY_NUMBER = "12345678";
const TRANSACTION_ID = "66454";
const SUBMISSION_ID = "435435";
const URL = LP_SIC_CODE_SUMMARY_PATH
  .replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER)
  .replace(`:${urlParams.PARAM_TRANSACTION_ID}`, TRANSACTION_ID)
  .replace(`:${urlParams.PARAM_SUBMISSION_ID}`, SUBMISSION_ID);

jest.mock("../../src/services/company.profile.service", () => ({
  getCompanyProfile: jest.fn()
}));

middlewareMocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
  const session: Session = new Session();
  session.data = {
    extra_data: {
      company_profile: {
        sicCodes: ["70001", "70002", "70003"]
      }
    }
  };
  req.session = session;
  return next();
});

describe("Controller tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.setTimeout(15000);
    jest.spyOn(limitedPartnershipUtils, "isACSPJourney").mockReturnValue(true);
  });

  it("should return SIC Code Check and Confirm page", async () => {
    const response = await request(app).get(URL);

    expect(middlewareMocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    expect(response.text).toContain("Check and confirm what the limited partnership will be doing");
    expect(response.text).toContain('<div class="govuk-summary-list__value">70001</div>');
    expect(response.text).toContain('<div class="govuk-summary-list__value">70002</div>');
    expect(response.text).toContain('<div class="govuk-summary-list__value">70003</div>');
    expect(response.text).toContain('Add a new SIC code');
  });

  it("should add a valid SIC code", async () => {
    const response = await request(app)
      .post(`${URL}/add`)
      .send({ code: "70005", unsavedCodeList: "70001,70002,70003" });

    expect(response.text).toContain('<div class="govuk-summary-list__value">70001</div>');
    expect(response.text).toContain('<div class="govuk-summary-list__value">70002</div>');
    expect(response.text).toContain('<div class="govuk-summary-list__value">70003</div>');
    expect(response.text).toContain('<div class="govuk-summary-list__value">70005</div>');
  });

  it("should not add a duplicate SIC code", async () => {
    const response = await request(app)
      .post(`${URL}/add`)
      .send({ code: "70005" });

    const matches = response.text.match(/<div class="govuk-summary-list__value">70005<\/div>/g);

    expect(response.text).toContain('<div class="govuk-summary-list__value">70005</div>');
    expect(matches?.length).toBe(1);
  });

  it("should not add more than 4 SIC codes", async () => {

    const response = await request(app)
      .post(`${URL}/add`)
      .send({ code: "70006", unsavedCodeList: "70001,70002,70003,70005" });

    expect(response.text).not.toContain('<div class="govuk-summary-list__value">70006</div>');
  });

  it("should hide the add sic code section", async () => {

    const response = await request(app)
      .post(`${URL}/add`)
      .send({ code: "70007", unsavedCodeList: "70001,70002,70003,70005" });

    expect(response.text).not.toContain('<div class="govuk-summary-list__value">70007</div>');
    expect(response.text).not.toContain('Add a new SIC code');
  });

  it("should remove a valid SIC code and redirect", async () => {

    const response = await request(app)
      .post(`${URL}/70002/remove?lang=en`)
      .send({ unsavedCodeList: "70001,70002,70003,70005" });

    expect(response.text).toContain('<div class="govuk-summary-list__value">70001</div>');
    expect(response.text).not.toContain('<div class="govuk-summary-list__value">70002</div>');
    expect(response.text).toContain('<div class="govuk-summary-list__value">70003</div>');
    expect(response.text).toContain('<div class="govuk-summary-list__value">70005</div>');
  });
});

describe("SIC code summary post tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(limitedPartnershipUtils, "isACSPJourney").mockReturnValue(true);
  });

  it("should redirect to review page when valid SIC codes present", async () => {
    const response = await request(app)
      .post(`${URL}/save`)
      .send();

    const reviewPath = LP_REVIEW_PATH
      .replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER)
      .replace(`:${urlParams.PARAM_TRANSACTION_ID}`, TRANSACTION_ID)
      .replace(`:${urlParams.PARAM_SUBMISSION_ID}`, SUBMISSION_ID);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(reviewPath);
  });

  it("should redirect to review page when valid SIC codes present and BODY journey", async () => {
    jest.spyOn(limitedPartnershipUtils, "isACSPJourney").mockReturnValue(false);

    const response = await request(app)
      .post(`${URL}/save`)
      .send();

    const reviewPath = REVIEW_PATH
      .replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER)
      .replace(`:${urlParams.PARAM_TRANSACTION_ID}`, TRANSACTION_ID)
      .replace(`:${urlParams.PARAM_SUBMISSION_ID}`, SUBMISSION_ID);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(reviewPath);
  });

  it("should redirect to Check Your Answer page when back button clicked and confirmation statement date has changed", async() => {
    jest.spyOn(sessionAcspUtils, "getAcspSessionData").mockReturnValue({
      changeConfirmationStatementDate: true,
      beforeYouFileCheck: true,
      newConfirmationDate: null,
      confirmAllInformationCheck: false,
      confirmLawfulActionsCheck: false
    });

    const response = await request(app)
      .get(URL);

    const backPath = LP_CHECK_YOUR_ANSWER_PATH
      .replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER)
      .replace(`:${urlParams.PARAM_TRANSACTION_ID}`, TRANSACTION_ID)
      .replace(`:${urlParams.PARAM_SUBMISSION_ID}`, SUBMISSION_ID);

    expect(response.text).toContain(backPath);
  });

  it("should redirect to Check Your Answer page when back button clicked and confirmation statement date has NOT changed", async() => {
    jest.spyOn(sessionAcspUtils, "getAcspSessionData").mockReturnValue({
      changeConfirmationStatementDate: false,
      beforeYouFileCheck: true,
      newConfirmationDate: null,
      confirmAllInformationCheck: false,
      confirmLawfulActionsCheck: false
    });

    const response = await request(app)
      .get(URL);

    const backPath = LP_CS_DATE_PATH
      .replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER)
      .replace(`:${urlParams.PARAM_TRANSACTION_ID}`, TRANSACTION_ID)
      .replace(`:${urlParams.PARAM_SUBMISSION_ID}`, SUBMISSION_ID);

    expect(response.text).toContain(backPath);
  });
});
