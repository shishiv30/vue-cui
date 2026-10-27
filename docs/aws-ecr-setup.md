> Historical. GitHub Actions no longer build or deploy this repo. Storybook publishes from GitLab. See [storybook-ci.md](storybook-ci.md). Do not add GitHub secrets or an App Runner `start-deployment` step for Storybook.

# AWS ECR setup for GitHub Actions

The **Build and Release to AWS ECR** workflow and `AWS_ECR_ENABLED` are gone. The steps below are a record of that old GitHub path. They do not publish Storybook.

---

## Quick setup (AWS CLI)

If you have an AWS account and want to do everything from the terminal:

1. **Install and configure AWS CLI** (one-time):

   ```bash
   brew install awscli
   aws configure
   ```

   Enter your **Access Key ID** and **Secret Access Key**. Get them in AWS Console: **IAM** → **Users** → your user (or create one with admin access) → **Security credentials** → **Create access key**. Use the same region you want for ECR (e.g. `us-east-1`).  
   *New account? See [Create an IAM user with admin access](#create-an-iam-user-with-admin-access-for-aws-configure) below.*

2. **Run the setup script** (creates ECR repo + IAM user + access key, prints values for GitHub):

   ```bash
   ./scripts/aws-ecr-setup.sh
   ```

   Defaults: region `us-east-1`, ECR repo name `pure`. Override: `./scripts/aws-ecr-setup.sh eu-west-1 my-repo`.

3. The setup script and GitHub secrets from this guide are retired. Do not add them under GitHub Actions.

---

## Manual setup (Console)

### 1. Create an AWS account

1. Go to [aws.amazon.com](https://aws.amazon.com) and choose **Create an AWS Account**.
2. Complete sign-up (email, password, payment method, identity check).
3. You get 12 months free tier; ECR has a small free allowance.

---

### Create an IAM user with admin access (for `aws configure`)

You **don’t need to create a group**. Attach the admin policy directly to the user.

1. In AWS Console, open **IAM** (search “IAM” in the top bar) → **Users** → **Create user**.
2. **User name:** e.g. `admin` (or your name). Click **Next**.
3. **Set permissions:** choose **Attach policies directly** (do not select “Add user to group”).
4. In the policy list, search for **AdministratorAccess**, check the box next to it, then **Next**.
5. **Create user**.
6. Open the new user → **Security credentials** tab → **Create access key**.
7. Use case: **Command Line Interface (CLI)** → **Next** → **Create access key**. Copy the **Access key ID** and **Secret access key** and use them in `aws configure`.

*If you prefer using a group:* IAM → **User groups** → **Create group** (e.g. `Admins`) → attach **AdministratorAccess** → create group → **Users** → Create user → on “Set permissions” choose **Add user to group** and select **Admins**. Then create the access key as above.

---

### 2. Create an ECR repository

1. In the AWS Console, open **ECR** (Elastic Container Registry): search "ECR" in the top search bar.
2. Choose **Create repository**.
3. **Repository name:** e.g. `pure` (or your GitHub repo name).
4. Leave other options default, then **Create repository**.
5. Note the **URI** (e.g. `123456789012.dkr.ecr.us-east-1.amazonaws.com/pure`) — you’ll use this to pull images later.

---

### 3. Create an IAM user for GitHub Actions

1. In the AWS Console, open **IAM** → **Users** → **Create user**.
2. **User name:** e.g. `github-actions-pure`.
3. **Next** → attach policy directly. Create or use a policy that allows ECR push.

**Option A – minimal policy (recommended)**  
Create a custom policy with this JSON (replace `123456789012` with your AWS account ID if you want to limit to one repo). If you use the S3 CDN sync (repo variable `AWS_S3_CDN_BUCKET`), add the S3 block below. If you use CloudFront in front of the bucket, add the CloudFront block so the workflow can invalidate the cache after each deploy (otherwise visitors may keep getting old CSS/JS):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ecr:GetAuthorizationToken",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:CreateRepository",
        "ecr:DescribeRepositories"
      ],
      "Resource": "arn:aws:ecr:*:*:repository/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::YOUR_CDN_BUCKET_NAME"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::YOUR_CDN_BUCKET_NAME/*"
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/E3HB60PWQLPD0R"
    }
  ]
}
```

Replace `YOUR_CDN_BUCKET_NAME` with your S3 bucket name (e.g. `cdn.conjeezou.com`). For the CloudFront block, replace `ACCOUNT_ID` with your AWS account ID. This policy was for the old site image deploy. Storybook uses a separate IAM user; see [storybook-ci.md](storybook-ci.md).

If you prefer not to hardcode the distribution ID in the policy, use `"Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/*"` so the user can invalidate any distribution in the account.

**Option B – use AWS managed policies**  
- **ECR:** Attach **AmazonEC2ContainerRegistryPowerUser** (simpler, but broader ECR access).
- **S3 CDN sync:** If you set the repo variable `AWS_S3_CDN_BUCKET`, attach **AmazonS3FullAccess** so the user can sync `dist/` to your bucket. This grants access to all S3 buckets in the account; for a single-bucket scope use the custom S3 block in Option A instead.
- **CloudFront invalidation:** If you set `AWS_CLOUDFRONT_DISTRIBUTION_ID`, the IAM user needs `cloudfront:CreateInvalidation` and `cloudfront:GetInvalidation`. Use the CloudFront block in Option A, or attach **CloudFrontFullAccess** (broader) so the workflow can invalidate the cache after each deploy.

4. **Next** → **Create user**.
5. Open the user → **Security credentials** → **Create access key**.
6. Choose **Application running outside AWS** (e.g. GitHub Actions) → **Next** → **Create access key**.
7. Copy the **Access key ID** and **Secret access key** and store them somewhere safe (you won’t see the secret again).

---

### 4. GitHub secrets and App Runner

Do not add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ECR_ENABLED`, or `APP_RUNNER_SERVICE_ARN` in GitHub Actions for this repo. Those workflows are removed. Storybook uses GitLab CI variables listed in [storybook-ci.md](storybook-ci.md). App Runner `pure` is the main site only. It does not serve Storybook.
