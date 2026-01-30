# Branch to Namespace Examples

## Valid Examples
| Git Branch | Kubernetes Namespace |
|------------|---------------------|
| main       | project            |
| feature/login | feature-login   |
| bugfix-123 | bugfix-123        |
| hotfix/api | hotfix-api        |
| FEATURE/ABC | feature-abc      |

## Invalid Branch Names (would fail)
- branch/with.dots → dots not allowed
- branch-with-very-long-name-more-than-63-characters → too long
- BRANCH/WITH/UPPERCASE → uppercase not ideal

## Cleanup Command
```bash
# Delete namespace when branch is deleted
kubectl delete namespace feature-login
