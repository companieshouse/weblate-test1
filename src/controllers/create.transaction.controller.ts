import { postTransaction } from "../services/transaction.service";
import { NextFunction, Request, Response } from "express";
import { urlUtils } from "../utils/url";
import { TRADING_STATUS_PATH, urlParams } from "../types/page.urls";
import { DESCRIPTION, REFERENCE } from "../utils/constants";
import { Session } from "@companieshouse/node-session-handler";
import { createConfirmationStatement } from "../services/confirmation.statement.service";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { ConfirmationStatementCreated } from "@companieshouse/api-sdk-node/dist/services/confirmation-statement";
import { isLimitedPartnershipCompanyType } from "../utils/limited.partnership";
import { isAuthorisedAgent } from "@companieshouse/ch-node-utils";
import * as urls from "../types/page.urls";
import { getCompanyProfileFromSession } from "../utils/session";

export const get = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const session = req.session as Session;
    const companyNumber = req.params[urlParams.PARAM_COMPANY_NUMBER];
    const transaction: Transaction = await postTransaction(session, companyNumber, DESCRIPTION, REFERENCE);
    const transactionId = transaction.id as string;
    const submissionResponse = await createConfirmationStatement(session, transactionId);
    if (submissionResponse.httpStatusCode === 201) {
      const castedResponseResource: ConfirmationStatementCreated =
        submissionResponse.resource as ConfirmationStatementCreated;

      let nextPageUrl;
      if (isLimitedPartnershipCompanyType(getCompanyProfileFromSession(req)) && isAuthorisedAgent(req.session)) {
        nextPageUrl = urlUtils.getUrlWithCompanyNumberTransactionIdAndSubmissionId(`${urls.LP_BEFORE_YOU_FILE_PATH}?lang=en`, companyNumber, transactionId, castedResponseResource.id);
      } else {
        nextPageUrl = urlUtils.getUrlWithCompanyNumberTransactionIdAndSubmissionId(TRADING_STATUS_PATH, companyNumber, transactionId, castedResponseResource.id);
      }

      return res.redirect(nextPageUrl);
    }
    next(new Error(`Unable to create Confirmation Statement, httpStatusCode = ${submissionResponse.httpStatusCode}, resource = ${JSON.stringify(submissionResponse.resource)}`));
  } catch (e) {
    return next(e);
  }
};
