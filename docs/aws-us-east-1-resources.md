> Historical. This guide describes the previous EJS property or AWS deploy flow. Current behavior is in README.md and change-list.md.

# AWS us-east-1 resources (list with descriptions)

Inventory of resources in **us-east-1** (N. Virginia) as of the last check.

---

## EC2 / VPC

| Resource | ID/Name | Description |
|----------|---------|-------------|
| **VPC** | `vpc-01d934d8fd656bc6a` | Default VPC, CIDR 172.31.0.0/16. |
| **Subnets** | 6 subnets | One per AZ (us-east-1a–f): `subnet-02bce7ff50a02cab8` (1a), `subnet-016682adac17959cc` (1b), `subnet-0fe90e1790be57302` (1c), `subnet-0086a16c141c42132` (1d), `subnet-0fd3b664f5c14511e` (1e), `subnet-03fc6be8d82ed2301` (1f). |
| **Security groups** | `default` (sg-0a3600c900a4032bb) | Default VPC security group. |
| **Elastic IPs** | 2 | `eipalloc-04cdd6056690eae52` (100.28.44.234), `eipalloc-0c20f6f7b573520a7` (44.217.192.128). May be unassociated or used by other resources. |

---

## Certificates (ACM)

| Resource | Domain | Description |
|----------|--------|-------------|
| **Certificate** | conjeezou.com | Public cert (e.g. root or www). Status: ISSUED. |
| **Certificate** | cdn.conjeezou.com | For CDN/CloudFront. Status: ISSUED. |

---

## App Runner

| Resource | ID/Name | Description |
|----------|---------|-------------|
| **Service** | `pure` | App Runner service for the main site. URL: `https://qis7miipe5.us-east-1.awsapprunner.com`. Custom domain: www.conjeezou.com. |

---

## Other services (empty in us-east-1)

- **Lambda** – No functions.
- **RDS** – No DB instances.

---

## Summary

- **Main site:** App Runner service `pure` (www.conjeezou.com).
- **Shared:** Default VPC, subnets, 2 Elastic IPs, ACM certs for conjeezou.com and cdn.conjeezou.com.
