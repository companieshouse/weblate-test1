import { NextFunction, Request, Response } from "express";
import { Templates } from "../../types/template.paths";
import { urlUtils } from "../../utils/url";
import { PROVIDE_EMAIL_ADDRESS_PATH, TASK_LIST_PATH } from "../../types/page.urls";
import { Session } from "@companieshouse/node-session-handler";
import { SECTIONS } from "../../utils/constants";
import { sendUpdate } from "../../utils/update.confirmation.statement.submission";
import { SectionStatus } from "@companieshouse/api-sdk-node/dist/services/confirmation-statement";

export const get = (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = req.session as Session;
    const backLinkUrl = urlUtils.getUrlToPath(PROVIDE_EMAIL_ADDRESS_PATH, req);
    const confirmEmailAddress = session.getExtraData("entered-email-address");
    return res.render(Templates.CONFIRM_EMAIL_ADDRESS, {
      templateName: Templates.CONFIRM_EMAIL_ADDRESS,
      backLinkUrl, confirmEmailAddress
    });
  } catch (error) {
    return next(error);
  }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as Session;
  const confirmEmailAddress = session.getExtraData("entered-email-address");
  try {
    await sendUpdate(req, SECTIONS.EMAIL, SectionStatus.INITIAL_FILING, confirmEmailAddress);
    return res.redirect(urlUtils.getUrlToPath(TASK_LIST_PATH, req));
  } catch (error) {
    return next(error);
  }
};
