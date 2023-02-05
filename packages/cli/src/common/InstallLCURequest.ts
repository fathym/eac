export interface InstallLCURequest {
  LCUPackage: string;

  Organization: string;

  Parameters: { [key: string]: string };

  Phase?: number;

  ProjectCreate: boolean;

  Project: string;
}
