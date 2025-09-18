jest.mock("../../../src/middleware/company.authentication.middleware");
jest.mock("../../../src/utils/update.confirmation.statement.submission");

import request from "supertest";
import mocks from "../../mocks/all.middleware.mock";
import { companyAuthenticationMiddleware } from "../../../src/middleware/company.authentication.middleware";
import app from "../../../src/app";
import { urlParams, TASK_LIST_PATH, CONFIRM_EMAIL_PATH } from "../../../src/types/page.urls";
import { urlUtils } from "../../../src/utils/url";
import { sendUpdate } from "../../../src/utils/update.confirmation.statement.submission";
import { SECTIONS } from "../../../src/utils/constants";
import { SectionStatus } from "@companieshouse/api-sdk-node/dist/services/confirmation-statement";

const PAGE_HEADING = "Check the email address";
const EXPECTED_ERROR_TEXT = "Sorry, there is a problem with the service";
const COMPANY_NUMBER = "12345678";
const TASK_LIST_URL = TASK_LIST_PATH.replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER);
const CONFIRM_EMAIL_ADDRESS_URL = CONFIRM_EMAIL_PATH.replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER);
const ENTERED_EMAIL = "info@mock-test.com";

const mockCompanyAuthenticationMiddleware = companyAuthenticationMiddleware as jest.Mock;
mockCompanyAuthenticationMiddleware.mockImplementation((req, res, next) => next());
const mockSendUpdate = sendUpdate as jest.Mock;

describe("Confirm Email Address controller tests", () => {

  describe("When entered email has been provided", () => {

    beforeEach(() => {
      mocks.mockAuthenticationMiddleware.mockClear();
      mocks.mockServiceAvailabilityMiddleware.mockClear();
      mocks.mockSessionMiddleware.mockClear();
      mocks.mockCsrfMiddleware.mockClear();
    });

    it("Should navigate to the Confirm Email Address page", async () => {
      const response = await request(app).get(CONFIRM_EMAIL_ADDRESS_URL);
      expect(response.text).toContain(PAGE_HEADING);
      expect(response.text).toContain("Email address");
    });

    it("Should redirect to an error page when error is thrown", async () => {
      const spyGetUrlToPath = jest.spyOn(urlUtils, "getUrlToPath");
      spyGetUrlToPath.mockImplementationOnce(() => { throw new Error(); });
      const response = await request(app).get(CONFIRM_EMAIL_ADDRESS_URL);

      expect(response.text).toContain(EXPECTED_ERROR_TEXT);

      spyGetUrlToPath.mockRestore();
    });
  });

  describe("Check registered email address controller POST tests", () => {
    it("Should send update and return to task list page when email address is confirmed", async () => {
      const response = await request(app).post(CONFIRM_EMAIL_ADDRESS_URL);
      expect(mockSendUpdate.mock.calls[0][1]).toBe(SECTIONS.EMAIL);
      expect(mockSendUpdate.mock.calls[0][2]).toBe(SectionStatus.INITIAL_FILING);
      expect(mockSendUpdate.mock.calls[0][3]).toBe(ENTERED_EMAIL);
      expect(response.status).toEqual(302);
      expect(response.header.location).toEqual(TASK_LIST_URL);
    });

    it("Should redirect to an error page when error is returned in POST", async () => {
      mockSendUpdate.mockRejectedValueOnce(new Error());
      const response = await request(app).post(CONFIRM_EMAIL_ADDRESS_URL);
      expect(response.text).toContain(EXPECTED_ERROR_TEXT);
    });

  });
});
