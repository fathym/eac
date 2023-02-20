export interface InstallLCURequest {
  LCUPackage: string;

  Organization: string;

  Parameters: { [key: string]: any };

  Phase?: number;

  Project: string;
}
