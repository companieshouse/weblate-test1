import { NextFunction, Request, Response } from "express";
import { Templates } from "../types/template.paths";
import { formatForDisplay, getCompanyProfile } from "../services/company.profile.service";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { createConfirmationStatement, getNextMadeUpToDate } from "../services/confirmation.statement.service";
import { Session } from "@companieshouse/node-session-handler";
import { FEATURE_FLAG_PRIVATE_SDK_12052021 } from "../utils/properties";
import { isActiveFeature } from "../utils/feature.flag";
import { checkEligibility } from "../services/eligibility.service";
import {
  EligibilityStatusCode, NextMadeUpToDate
} from "@companieshouse/api-sdk-node/dist/services/confirmation-statement";
import {
  CREATE_TRANSACTION_PATH,
  INVALID_COMPANY_STATUS_PATH,
  LP_MUST_BE_AUTHORISED_AGENT_PATH,
  NO_FILING_REQUIRED_PATH,
  URL_QUERY_PARAM,
  USE_PAPER_PATH,
  USE_WEBFILING_PATH
} from "../types/page.urls";
import { urlUtils } from "../utils/url";
import { toReadableFormat } from "../utils/date";
import { COMPANY_PROFILE_SESSION_KEY, LIMITED_PARTNERSHIP_COMPANY_TYPE } from "../utils/constants";
import { isLimitedPartnershipCompanyType, isLimitedPartnershipSubtypeFeatureFlagEnabled } from "../utils/limited.partnership";
import { isAuthorisedAgent } from "@companieshouse/ch-node-utils";


export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyProfile: CompanyProfile = await getCompanyProfile(req.query.companyNumber as string);
    return res.render(Templates.CONFIRM_COMPANY, await buildPageOptions(req.session as Session, companyProfile));
  } catch (e) {
    return next(e);
  }
};

const buildPageOptions = async (session: Session, companyProfile: CompanyProfile): Promise<object> => {
  const pageOptions = {
    company: formatForDisplay(companyProfile),
    templateName: Templates.CONFIRM_COMPANY
  };

  if (companyProfile?.confirmationStatement?.nextMadeUpTo) {
    const nextMadeUpToDate: NextMadeUpToDate = await getNextMadeUpToDate(session, companyProfile.companyNumber);

    // can't use falsy here, isDue can be undefined
    if (nextMadeUpToDate.isDue === false) {
      pageOptions["notDueWarning"] = {
        newNextMadeUptoDate: nextMadeUpToDate.newNextMadeUpToDate ? toReadableFormat(nextMadeUpToDate.newNextMadeUpToDate) : ""
      };
    }
  }
  return pageOptions;
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session: Session = req.session as Session;
    const company: CompanyProfile = await getCompanyProfile(req.query.companyNumber as string);
    const companyNumber = company.companyNumber;
    const eligibilityStatusCode: EligibilityStatusCode = await checkEligibility(session, companyNumber);

    if (!isCompanyValidForService(eligibilityStatusCode)) {
      return displayEligibilityStopPage(res, eligibilityStatusCode, company);
    } else if (shouldRedirectToPaperFilingForInvalidLp(company)) {
      return displayEligibilityStopPage(res, EligibilityStatusCode.INVALID_COMPANY_TYPE_PAPER_FILING_ONLY, company);
    }

    let nextPageUrl;
    session.setExtraData(COMPANY_PROFILE_SESSION_KEY, company);
    if (isLimitedPartnershipCompanyType(company) && !isAuthorisedAgent(req.session)) {
      nextPageUrl = LP_MUST_BE_AUTHORISED_AGENT_PATH;
    } else {
      await createNewConfirmationStatement(session);
      nextPageUrl = urlUtils.getUrlWithCompanyNumber(CREATE_TRANSACTION_PATH, companyNumber);
    }
    return res.redirect(nextPageUrl);
  } catch (e) {
    return next(e);
  }
};

const isCompanyValidForService = (eligibilityStatusCode: EligibilityStatusCode): boolean =>
  eligibilityStatusCode === EligibilityStatusCode.COMPANY_VALID_FOR_SERVICE;

const displayEligibilityStopPage = (res: Response, eligibilityStatusCode: EligibilityStatusCode, company: CompanyProfile) => {
  const stopPagePath: string = stopPagesPathMap[eligibilityStatusCode];
  if (!stopPagePath) {
    throw new Error(`Unknown eligibilityStatusCode ${eligibilityStatusCode}`);
  }
  return res.redirect(urlUtils.setQueryParam(stopPagePath, URL_QUERY_PARAM.COMPANY_NUM, company.companyNumber));
};

const createNewConfirmationStatement = async (session: Session) => {
  if (isActiveFeature(FEATURE_FLAG_PRIVATE_SDK_12052021)) {
    const transactionId: string = "";
    await createConfirmationStatement(session, transactionId);
  }
};

export function shouldRedirectToPaperFilingForInvalidLp(companyProfile: CompanyProfile): boolean {
  const isLimitedPartnershipTypeWithValidSubtype = isLimitedPartnershipCompanyType(companyProfile);
  const isFeatureFlagEnabled = isLimitedPartnershipSubtypeFeatureFlagEnabled(companyProfile);

  if (companyProfile?.type === LIMITED_PARTNERSHIP_COMPANY_TYPE) {
    if (!isLimitedPartnershipTypeWithValidSubtype || !isFeatureFlagEnabled) {
      return true;
    }
  }
  return false;
}



const stopPagesPathMap = {
  [EligibilityStatusCode.INVALID_COMPANY_STATUS]: INVALID_COMPANY_STATUS_PATH,
  [EligibilityStatusCode.INVALID_COMPANY_TYPE_PAPER_FILING_ONLY]: USE_PAPER_PATH,
  [EligibilityStatusCode.INVALID_COMPANY_TRADED_STATUS_USE_WEBFILING]: USE_WEBFILING_PATH,
  [EligibilityStatusCode.INVALID_COMPANY_TYPE_USE_WEB_FILING]: USE_WEBFILING_PATH,
  [EligibilityStatusCode.INVALID_COMPANY_APPOINTMENTS_INVALID_NUMBER_OF_OFFICERS]: USE_WEBFILING_PATH,
  [EligibilityStatusCode.INVALID_COMPANY_APPOINTMENTS_MORE_THAN_ONE_PSC]: USE_WEBFILING_PATH,
  [EligibilityStatusCode.INVALID_COMPANY_APPOINTMENTS_MORE_THAN_FIVE_PSCS]: USE_WEBFILING_PATH,
  [EligibilityStatusCode.INVALID_COMPANY_APPOINTMENTS_MORE_THAN_ONE_SHAREHOLDER]: USE_WEBFILING_PATH,
  [EligibilityStatusCode.INVALID_COMPANY_TYPE_CS01_FILING_NOT_REQUIRED]: NO_FILING_REQUIRED_PATH
};
