# Storybook CI (GitLab)

Push to this repository runs [`.gitlab-ci.yml`](../.gitlab-ci.yml). The pipeline builds static Storybook and syncs it to S3. It does not use Helm, `kotlin-service-template`, GitHub Actions, ECR, or App Runner.

App Runner `pure` stays the main site. Storybook is a separate static site.

## Jobs

| Job | When | What |
| --- | --- | --- |
| `build-storybook` | default branch, or a merge request | `npm run build:storybook` → `dist/storybook` |
| `dev-storybook-deploy` | default branch (automatic) | sync to `s3://$STORYBOOK_S3_BUCKET/primary` |
| `mr-storybook-deploy` | merge request (manual) | sync to `s3://$STORYBOOK_S3_BUCKET/mr-<iid>` |
| `stop-mr-storybook-deploy` | merge request (manual) | delete that prefix and invalidate CloudFront |

`PUBLIC_PATH` and `STORYBOOK_BASE` are `https://${URL_SLUG}${STORYBOOK_PUBLIC_HOST}/`. On a merge request `URL_SLUG` is `mr-<iid>.` (subdomain). On the default branch it is empty. `.storybook/main.ts` sets Vite `base` from `STORYBOOK_BASE`, then `PUBLIC_PATH`.

## GitLab CI/CD variables

Set these on the GitLab project (**Settings → CI/CD → Variables**). Mask the keys. The pipeline does not create the bucket or the distribution.

| Variable | Kind | Purpose |
| --- | --- | --- |
| `STORYBOOK_PUBLIC_HOST` | variable | Hostname in front of CloudFront, no scheme. Example: `storybook.example.com` |
| `STORYBOOK_S3_BUCKET` | variable | Bucket name. Objects go under `primary/` and `mr-<iid>/` |
| `STORYBOOK_AWS_DISTRIBUTION_ID` | variable | CloudFront distribution ID |
| `STORYBOOK_AWS_ACCESS_KEY_ID` | masked | IAM user for GitLab only |
| `STORYBOOK_AWS_SECRET_ACCESS_KEY` | masked | Secret for that user |
| `STORYBOOK_AWS_REGION` | variable | Optional. Defaults to `us-east-1` |
| `CACHE_TTL` | variable | Optional. Defaults to `300` in `.gitlab-ci.yml` |

This project needs its own bucket, distribution, and keys.

## AWS resources to create once

1. **S3 bucket** used only for Storybook. Do not put these prefixes on the site CDN bucket.
2. **CloudFront distribution** with that bucket as the origin. Map the public host (and `mr-*` hostnames, if you use them) to the distribution. Send unknown paths to `index.html` so Storybook routes load.
3. **IAM user** for GitLab, with only:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::YOUR_STORYBOOK_BUCKET"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::YOUR_STORYBOOK_BUCKET/*"
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
    }
  ]
}
```

4. **DNS** for `STORYBOOK_PUBLIC_HOST` (and a wildcard if merge-request subdomains should resolve). Without DNS, the CloudFront domain name can be the host.
5. **GitLab runners** that can pull `node:25` and `amazon/aws-cli`.

Not required for Storybook: GitHub secrets, Chromatic, an ECR image, or an App Runner service.
