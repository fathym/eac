export interface InstallLCURequest {
  LCUPackage: string;

  Organization: string;

  Parameters: { [key: string]: string };

  Phase?: number;

  Project: string;
}
