import { DocType } from "../completedDocsRule";
import { Exclusion } from "./exclusion";
import { IInputExclusionDescriptors } from "./exclusionDescriptors";
export declare class ExclusionFactory {
    constructExclusionsMap(ruleArguments: IInputExclusionDescriptors[]): Map<DocType, Array<Exclusion<any>>>;
    private addRequirements(exclusionsMap, descriptors);
    private createRequirementsForDocType(docType, descriptor);
}
