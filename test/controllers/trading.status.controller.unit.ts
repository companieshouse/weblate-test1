jest.mock("../../src/middleware/company.authentication.middleware");
jest.mock("../../src/utils/update.confirmation.statement.submission");

import request from "supertest";
import mocks from "../mocks/all.middleware.mock";
import { companyAuthenticationMiddleware } from "../../src/middleware/company.authentication.middleware";
import app from "../../src/app";
import { TASK_LIST_PATH, TRADING_STATUS_PATH, TRADING_STOP_PATH, urlParams } from "../../src/types/page.urls";
import { TRADING_STATUS_ERROR } from "../../src/utils/constants";
import { sendTradingStatusUpdate } from "../../src/utils/update.confirmation.statement.submission";

const mockCompanyAuthenticationMiddleware = companyAuthenticationMiddleware as jest.Mock;
mockCompanyAuthenticationMiddleware.mockImplementation((req, res, next) => next());
const mockSendTradingStatusUpdate = sendTradingStatusUpdate as jest.Mock;

const PAGE_HEADING = "Check the trading status";
const COMPANY_NUMBER = "12345678";
const SERVICE_UNAVAILABLE_TEXT = "Sorry, there is a problem with the service";

const TRADING_STATUS_URL = TRADING_STATUS_PATH.replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER);
const TASK_LIST_URL = TASK_LIST_PATH.replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER);
const TRADING_STOP_URL = TRADING_STOP_PATH.replace(`:${urlParams.PARAM_COMPANY_NUMBER}`, COMPANY_NUMBER);

describe("Trading status controller tests", () => {

  beforeEach(() => {
    mocks.mockAuthenticationMiddleware.mockClear();
    mockSendTradingStatusUpdate.mockClear();
  });

  it("Should navigate to the trading status page", async () => {
    const response = await request(app).get(TRADING_STATUS_URL);
    expect(response.text).toContain(PAGE_HEADING);
    expect(response.text).toContain("No company shares were traded on a market during this confirmation period.");
  });

  it("Should navigate to the task list page when trading status is correct", async () => {
    const response = await request(app)
      .post(TRADING_STATUS_URL)
      .send({ tradingStatus: "yes" });
    expect(mockSendTradingStatusUpdate.mock.calls[0][1]).toBe(true);
    expect(response.status).toEqual(302);
    expect(response.header.location)
      .toEqual(TASK_LIST_URL);
  });

  it("Should navigate to stop page when trading status is not correct", async () => {
    const response = await request(app)
      .post(TRADING_STATUS_URL)
      .send({ tradingStatus: "no" });
    expect(mockSendTradingStatusUpdate.mock.calls[0][1]).toBe(false);
    expect(response.status).toEqual(302);
    expect(response.header.location).toEqual(TRADING_STOP_URL);
  });

  it("Should redisplay trading status page with error when trading status is not selected", async () => {
    const response = await request(app).post(TRADING_STATUS_URL);
    expect(response.status).toEqual(200);
    expect(response.header.location).not
      .toEqual(TRADING_STATUS_URL);
    expect(response.text).toContain(PAGE_HEADING);
    expect(response.text).toContain(TRADING_STATUS_ERROR);
    expect(response.text).toContain("No company shares were traded on a market during this confirmation period.");
  });

  it("Should return error page when radio button id is not valid", async () => {
    const response = await request(app)
      .post(TRADING_STATUS_URL)
      .send({ tradingStatus: "malicious code block" });

    expect(response.status).toEqual(500);
    expect(response.text).toContain(SERVICE_UNAVAILABLE_TEXT);
  });

  it("Should redirect to an error page when error is returned in POST", async () => {
    mockSendTradingStatusUpdate.mockRejectedValueOnce(new Error());
    const response = await request(app)
      .post(TRADING_STATUS_URL)
      .send({ tradingStatus: "yes" });
    expect(response.text).toContain(SERVICE_UNAVAILABLE_TEXT);
  });
});
