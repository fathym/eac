import { LcuPackageDetails } from './LcuPackageDetails';

export class LcuPackageConfig {
  public Package?: LcuPackageDetails;

  public Phases?: { [phase: string]: { Name: string } };
}
