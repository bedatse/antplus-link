import * as config from 'config';
import * as fs from 'fs';

export class CredentialNotExistError extends Error {
  readonly keyFilename:string;

  constructor(keyFilename) {
    super(`${keyFilename} does not exist`);
    this.keyFilename = keyFilename;
  }
}

export function getGoogleCredentials(keyHash: string) {
  const gcpId = config.get<string>('google-credentials.project-id');
  const keyFilename = `${gcpId}-${keyHash}.json`;
  const keyFileJSON = `credentials/${keyFilename}`;

  if (!fs.existsSync(keyFileJSON)) {
    throw new CredentialNotExistError(keyFilename);
  }

  return {
    projectId: gcpId,
    keyFilename: keyFileJSON,
  }
}
