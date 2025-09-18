
import { Request, Response, Router } from "express";
import * as activeOfficers from "../controllers/tasks/active.officers.controller";
import * as activeOfficersDetails from "../controllers/tasks/active.officers.details.controller";
import * as activePscDetails from "../controllers/tasks/active.psc.details.controller";
import * as confirmCompanyRoute from "../controllers/confirm.company.controller";
import * as companyNumberRoute from "../controllers/company.number.controller";
import * as createTransactionRoute from "../controllers/create.transaction.controller";
import * as peopleWithSignificantControlRoute from "../controllers/tasks/people.with.significant.control.controller";
import * as pscStatementRoute from "../controllers/tasks/psc.statement.controller";
import * as shareholders from "../controllers/tasks/shareholders.controller";
import * as sicRoute from "../controllers/tasks/confirm.sic.code.controller";
import * as signoutRoute from "../controllers/signout.controller";
import * as startRoute from "../controllers/start.controller";
import * as statementOfCapitalRoute from "../controllers/tasks/statement.of.capital.controller";
import * as tradingStatusRoute from "../controllers/trading.status.controller";
import * as taskListRoute from "../controllers/task.list.controller";
import * as returnFromReaRoute from "../controllers/return.from.rea.controller";
import * as registeredOfficeAddressRoute from "../controllers/tasks/registered.office.address.controller";
import * as provideEmailAddressRoute from "../controllers/tasks/provide.email.address.controller";
import * as checkEmailAddressRoute from "../controllers/tasks/check.email.address.controller";
import * as confirmEmailAddressRoute from "../controllers/tasks/confirm.email.address.controller";
import * as registeredLocationsRoute from "../controllers/tasks/register.locations.controller";
import * as reviewRoute from "../controllers/review.controller";
import * as confirmationRoute from "../controllers/confirmation.controller";
import * as paymentCallbackRoute from "../controllers/payment.callback.controller";
import * as invalidCompanyStatusRoute from "../controllers/invalid.company.status.controller";
import * as paperFilingRoute from "../controllers/paper.filing.controller";
import * as useWebFilingRoute from "../controllers/use.webfiling.controller";
import * as noFilingRequiredRoute from "../controllers/no.filing.required.controller";
import * as tradingStopRoute from "../controllers/trading.stop.controller";
import * as wrongSicRoute from "../controllers/incorrect-information/wrong.sic.controller";
import * as wrongStatementOfCapitalRoute from "../controllers/incorrect-information/wrong.statement.of.capital.controller";
import * as wrongShareholdersRoute from "../controllers/incorrect-information/wrong.shareholders.controller";
import * as wrongRegisteredOfficeAddressRoute from "../controllers/incorrect-information/wrong.registered.office.address.controller";
import * as wrongRegisterLocationsRoute from "../controllers/incorrect-information/wrong.registers.controller";
import * as wrongOfficerDetailsRoute from "../controllers/incorrect-information/wrong.officer.details.controller";
import * as wrongPscDetailsRoute from "../controllers/incorrect-information/wrong.psc.details.controller";
import * as wrongPscStatementRoute from "../controllers/incorrect-information/wrong.psc.statement.controller";
import * as lpStartRoute from "../controllers/lp.start.controller";
import * as lpBeforeYouFileRoute from "../controllers/lp.before.you.file.controller";
import * as lpCheckYourAnswerRoute from "../controllers/lp.check.your.answer.controller";
import * as lpCSDateRoute from "../controllers/lp.cs.date.controller";
import * as lpSicCodeSummaryRoute from "../controllers/lp.sic.code.summary.controller";
import * as lpMustBeAuthorisedAgent from "../controllers/lp.must.be.authorised.agent.controller";

import * as urls from "../types/page.urls";
import { Templates } from "../types/template.paths";

export const router: Router = Router();

/**
 * Simply renders a view template.
 *
 * @param template the template name
 */
const renderTemplate = (template: string) => (req: Request, res: Response) => {
  return res.render(template);
};

router.get("/", startRoute.get);

router.get(urls.COMPANY_NUMBER, companyNumberRoute.get);

router.get(urls.ACCESSIBILITY_STATEMENT, renderTemplate(Templates.ACCESSIBILITY_STATEMENT));

router.get(urls.ACTIVE_OFFICERS, activeOfficers.get);
router.post(urls.ACTIVE_OFFICERS, activeOfficers.post);

router.get(urls.ACTIVE_OFFICERS_DETAILS, activeOfficersDetails.get);
router.post(urls.ACTIVE_OFFICERS_DETAILS, activeOfficersDetails.post);

router.get(urls.CONFIRM_COMPANY, confirmCompanyRoute.get);
router.post(urls.CONFIRM_COMPANY, confirmCompanyRoute.post);

router.get(urls.CREATE_TRANSACTION, createTransactionRoute.get);

router.get(urls.SIC, sicRoute.get);
router.post(urls.SIC, sicRoute.post);

router.get(urls.SIGNOUT_PATH, signoutRoute.get);
router.post(urls.SIGNOUT_PATH, signoutRoute.post);

router.get(urls.TRADING_STATUS, tradingStatusRoute.get);
router.post(urls.TRADING_STATUS, tradingStatusRoute.post);

router.get(urls.TASK_LIST, taskListRoute.get);
router.post(urls.TASK_LIST, taskListRoute.post);

router.get(urls.RETURN_FROM_REA, returnFromReaRoute.get);

router.get(urls.STATEMENT_OF_CAPITAL, statementOfCapitalRoute.get);
router.post(urls.STATEMENT_OF_CAPITAL, statementOfCapitalRoute.post);

router.get(urls.PEOPLE_WITH_SIGNIFICANT_CONTROL, peopleWithSignificantControlRoute.get);
router.post(urls.PEOPLE_WITH_SIGNIFICANT_CONTROL, peopleWithSignificantControlRoute.post);

router.get(urls.ACTIVE_PSC_DETAILS, activePscDetails.get);
router.post(urls.ACTIVE_PSC_DETAILS, activePscDetails.post);

router.get(urls.PSC_STATEMENT, pscStatementRoute.get);
router.post(urls.PSC_STATEMENT, pscStatementRoute.post);

router.get(urls.PROVIDE_EMAIL_ADDRESS, provideEmailAddressRoute.get);
router.post(urls.PROVIDE_EMAIL_ADDRESS, provideEmailAddressRoute.post);

router.get(urls.CHECK_EMAIL_ADDRESS, checkEmailAddressRoute.get);
router.post(urls.CHECK_EMAIL_ADDRESS, checkEmailAddressRoute.post);

router.get(urls.CONFIRM_EMAIL_ADDRESS, confirmEmailAddressRoute.get);
router.post(urls.CONFIRM_EMAIL_ADDRESS, confirmEmailAddressRoute.post);

router.get(urls.REGISTERED_OFFICE_ADDRESS, registeredOfficeAddressRoute.get);
router.post(urls.REGISTERED_OFFICE_ADDRESS, registeredOfficeAddressRoute.post);

router.get(urls.SHAREHOLDERS, shareholders.get);
router.post(urls.SHAREHOLDERS, shareholders.post);

router.get(urls.REGISTER_LOCATIONS, registeredLocationsRoute.get);
router.post(urls.REGISTER_LOCATIONS, registeredLocationsRoute.post);

router.get(urls.REVIEW, reviewRoute.get);
router.post(urls.REVIEW, reviewRoute.post);

router.get(urls.CONFIRMATION, confirmationRoute.get);

router.get(urls.PAYMENT_CALLBACK, paymentCallbackRoute.get);

router.get(urls.INVALID_COMPANY_STATUS, invalidCompanyStatusRoute.get);

router.get(urls.USE_PAPER, paperFilingRoute.get);

router.get(urls.USE_WEBFILING, useWebFilingRoute.get);

router.get(urls.NO_FILING_REQUIRED, noFilingRequiredRoute.get);

router.get(urls.TRADING_STOP, tradingStopRoute.get);

router.get(urls.WRONG_SIC, wrongSicRoute.get);

router.get(urls.WRONG_STATEMENT_OF_CAPITAL, wrongStatementOfCapitalRoute.get);

router.get(urls.WRONG_SHAREHOLDERS, wrongShareholdersRoute.get);

router.get(urls.WRONG_RO, wrongRegisteredOfficeAddressRoute.get);
router.post(urls.WRONG_RO, wrongRegisteredOfficeAddressRoute.post);

router.get(urls.WRONG_REGISTER_LOCATIONS, wrongRegisterLocationsRoute.get);
router.post(urls.WRONG_REGISTER_LOCATIONS, wrongRegisterLocationsRoute.post);

router.get(urls.WRONG_OFFICER_DETAILS, wrongOfficerDetailsRoute.get);
router.post(urls.WRONG_OFFICER_DETAILS, wrongOfficerDetailsRoute.post);

router.get(urls.WRONG_PSC_DETAILS, wrongPscDetailsRoute.get);
router.post(urls.WRONG_PSC_DETAILS, wrongPscDetailsRoute.post);

router.get(urls.WRONG_PSC_STATEMENT, wrongPscStatementRoute.get);
router.post(urls.WRONG_PSC_STATEMENT, wrongPscStatementRoute.post);

router.get(urls.ACSP_LIMITED_PARTNERSHIP, lpStartRoute.get);
router.post(urls.ACSP_LIMITED_PARTNERSHIP, lpStartRoute.post);

router.get(urls.LP_BEFORE_YOU_FILE, lpBeforeYouFileRoute.get);
router.post(urls.LP_BEFORE_YOU_FILE, lpBeforeYouFileRoute.post);

router.get(urls.LP_CHECK_YOUR_ANSWER, lpCheckYourAnswerRoute.get);
router.post(urls.LP_CHECK_YOUR_ANSWER, lpCheckYourAnswerRoute.post);

router.get(urls.LP_CS_DATE, lpCSDateRoute.get);
router.post(urls.LP_CS_DATE, lpCSDateRoute.post);

router.get(urls.LP_SIC_CODE_SUMMARY, lpSicCodeSummaryRoute.get);
router.post(urls.LP_SIC_CODE_SUMMARY_SAVE, lpSicCodeSummaryRoute.saveAndContinue);

router.post(urls.LP_SIC_CODE_SUMMARY_REMOVE, lpSicCodeSummaryRoute.removeSicCode);
router.post(urls.LP_SIC_CODE_SUMMARY_ADD, lpSicCodeSummaryRoute.addSicCode);

router.get(urls.LP_REVIEW, reviewRoute.get);
router.post(urls.LP_REVIEW, reviewRoute.post);

router.get(urls.LP_CONFIRMATION, confirmationRoute.get);

router.get(urls.LP_MUST_BE_AUTHORISED_AGENT, lpMustBeAuthorisedAgent.get);
