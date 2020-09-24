# Usage

- Create a `.yml` file under `.github/workflow/your-file.yml`.

- Paste this code (make changes as you need).

```
name: Auto add label to PR based on files changed
on:
  pull_request:
    types: [opened]

jobs:
  label-pr-based-on-size:
    runs-on: ubuntu-latest
    steps:
    - name: Add label based on PR's files changed
      uses: TDAK1509/label-pr-based-on-files-changed@v1.6
      with:
        repo-token: "${{ secrets.GITHUB_TOKEN }}"

```

# Result

- If your PR has < 7 files changed, it will be labeled `Small PR: < 7`.
- If your PR has 7 - 13 files changed, it will be labeled `Medium PR: 7 - 13`.
- If your PR has > 13 files changed, it will be labeled `Big PR: > 13`.
