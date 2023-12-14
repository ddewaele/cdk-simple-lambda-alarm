import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';


export class CdkSimpleLambdaAlarmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the Lambda function
    const lambdaFunction = new lambda.Function(this, 'SimpleLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler', // Assumes your Lambda code is in index.js
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../simple-lambda')), // Path to your Lambda function code
      environment: {
      },
    });

    // Error rate metric
    const errorRate = new cloudwatch.MathExpression({
      label: "Lambda Error Rate",
      expression: "errors / invocations * 100",
      usingMetrics: {
        errors: lambdaFunction.metricErrors({ period: cdk.Duration.minutes(2) }),
        invocations: lambdaFunction.metricInvocations({ period: cdk.Duration.minutes(2) })
      },
      period: cdk.Duration.minutes(2),
    });

    // CloudWatch alarm
    new cloudwatch.Alarm(this, 'SimpleLambdaErrorRateAlarm', {
      metric: errorRate,
      threshold: 20,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.IGNORE,
    });

  }
}
