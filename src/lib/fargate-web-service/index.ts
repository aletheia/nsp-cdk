import { ContainerImage } from "@aws-cdk/aws-ecs";
import { Construct } from "@aws-cdk/core";
import {
  Fargate,
  FargateProps,
  FargateServiceType,
  ImageSourceType
} from "../fargate";

/** Application properties **/
export interface ApplicationProps {
  name?: string;
  dockerImage: ContainerImage | string;
}

export class ApplicationEndpoint extends Construct {
  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id);
    const { dockerImage } = props;
    let { name } = props;
    if (!name) {
      name = `${id}Fargate`;
    }
    let sourceType: ImageSourceType;
    if (typeof dockerImage === "string") {
      if (dockerImage.startsWith("aws:")) {
        sourceType = ImageSourceType.REPOSITORY_ARN;
      } else if (dockerImage.startsWith("./")) {
        sourceType = ImageSourceType.ASSET;
      }
    } else {
    }
    const fargateProps: FargateProps = {
      name,
      imageSource: dockerImage,
      imageSourceType: sourceType!,
      serviceType: FargateServiceType.LOAD_BALANCED
    };
    const fargate = new Fargate(this, id, fargateProps);
  }
}
