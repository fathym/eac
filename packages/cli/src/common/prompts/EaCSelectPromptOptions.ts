import { EnterpriseAsCode } from '@semanticjs/common';

export interface EaCSelectPromptOptions {
  [key: string]: any;

  eac: EnterpriseAsCode;

  optional: boolean;
}
