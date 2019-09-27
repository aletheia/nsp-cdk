import * as ec2 from "@aws-cdk/aws-ec2";
import { Repository } from "@aws-cdk/aws-ecr";
import * as ecs from "@aws-cdk/aws-ecs";
import { ContainerImage } from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import {
  ApplicationLoadBalancedFargateServiceProps,
  QueueProcessingFargateServiceProps,
  ScheduledFargateTaskProps
} from "@aws-cdk/aws-ecs-patterns";
import { Construct } from "@aws-cdk/core";
import camelcase from "lodash.camelcase";
import isString from "lodash.isstring";
import merge from "lodash.merge";
export enum ImageSourceType {
  ASSET,
  REPOSITORY_ARN,
  URL,
  IMAGE
}

export enum FargateServiceType {
  LOAD_BALANCED,
  QUEUE_PROCESSING,
  SCHEDULED
}

export interface FargateProps {
  name?: string;
  imageSource?: string | ecs.ContainerImage;
  imageSourceType: ImageSourceType;
  vpcProps?: ec2.VpcProps;
  clusterProps?: ecs.ClusterProps;
  serviceType: FargateServiceType;
  serviceProps?:
    | ecsPatterns.QueueProcessingFargateServiceProps
    | ecsPatterns.ApplicationLoadBalancedFargateServiceProps
    | ecsPatterns.ScheduledFargateTaskProps;
}

export class Fargate extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: FargateProps = {
      imageSourceType: ImageSourceType.ASSET,
      clusterProps: {},
      serviceType: FargateServiceType.LOAD_BALANCED
    }
  ) {
    super(scope, id);
    const { imageSource, imageSourceType, vpcProps } = props;
    let { name, clusterProps, serviceType, serviceProps } = props;
    name = name ? name : camelcase(id);

    // Configure container image source nd build/download image
    let image: ecs.ContainerImage;
    switch (imageSourceType) {
      case ImageSourceType.URL:
        if (!isString(imageSource)) {
          throw new Error(
            'Selected "URL" as image source type, but provided an ECR Image.'
          );
        }
        image = ecs.ContainerImage.fromRegistry(imageSource! as string);
        break;
      case ImageSourceType.REPOSITORY_ARN:
        if (!isString(imageSource)) {
          throw new Error(
            'Selected "URL" as image source type, but provided an ECR Image.'
          );
        }

        image = ecs.ContainerImage.fromEcrRepository(
          Repository.fromRepositoryArn(
            this,
            "ImageRepository",
            imageSource as string
          )
        );
        break;
      case ImageSourceType.IMAGE:
        if (isString(imageSource)) {
          throw new Error(
            'Selected "REPOSITORY" as image source type, but provided a string.'
          );
        }
        image = imageSource as ContainerImage;
        break;
      case ImageSourceType.ASSET:
        const localImagePath = imageSource! as string;
        if (!isString(imageSource) || localImagePath.startsWith("./")) {
          throw new Error(
            'Selected "ASSET" as image source type, but provided a not local path with Dockerfile.'
          );
        }
        image = ecs.ContainerImage.fromAsset(localImagePath);
        break;
      default:
        throw new Error("Unknown image source type in properties.");
    }

    // Configure Vpc and cluster
    if (vpcProps) {
      const vpc = new ec2.Vpc(this, `${name}VpC`, vpcProps);
      clusterProps = merge({ vpc }, clusterProps);
    }
    const cluster = new ecs.Cluster(this, `${name}Cluster`, clusterProps);

    if (!serviceProps) {
      serviceType = FargateServiceType.LOAD_BALANCED;
      serviceProps = {
        image
      };
    }
    const serviceId = `${name}FargateService`;
    let fargate;
    switch (serviceType) {
      case FargateServiceType.LOAD_BALANCED:
        fargate = new ecsPatterns.ApplicationLoadBalancedFargateService(
          this,
          serviceId,
          serviceProps as ApplicationLoadBalancedFargateServiceProps
        );
        break;
      case FargateServiceType.QUEUE_PROCESSING:
        fargate = new ecsPatterns.QueueProcessingFargateService(
          this,
          serviceId,
          serviceProps as QueueProcessingFargateServiceProps
        );
        break;
      case FargateServiceType.SCHEDULED:
        fargate = new ecsPatterns.ScheduledFargateTask(
          this,
          serviceId,
          serviceProps as ScheduledFargateTaskProps
        );
        break;
      default:
        throw new Error("Service type unsupported.");
    }
    return fargate;
  }
}
