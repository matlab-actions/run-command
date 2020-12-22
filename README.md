# Action for Running MATLAB Commands

The [Run MATLAB Command](#run-matlab-command) GitHub&reg; action enables you to execute a MATLAB&reg; script, function, or statement on a [self-hosted](https://docs.github.com/en/free-pro-team@latest/actions/hosting-your-own-runners/about-self-hosted-runners) or [GitHub-hosted](https://docs.github.com/en/free-pro-team@latest/actions/reference/specifications-for-github-hosted-runners) runner:

- If you want to use a self-hosted runner, you must set up a computer with MATLAB (R2013b or later) as your runner. The action uses the first MATLAB version on the runner's system path.

- If you want to use a GitHub-hosted runner, you must include the [Set Up MATLAB](https://github.com/matlab-actions/setup-matlab/) action in your workflow to install MATLAB on the runner. Currently, this action is available only for public projects and does not include transformation products, such as MATLAB Coder&trade; and MATLAB Compiler&trade;.

## Usage Examples
Use the **Run MATLAB Command** action to run MATLAB scripts, functions, and statements tailored to your specific needs. You can use this action to flexibly customize your test run or add a MATLAB-related step to your workflow. 

### Run MATLAB Script on Self-Hosted Runner
Use a self-hosted runner to run the commands in a file named `myscript.m` in the root of your repository.

```yaml
name: Run MATLAB Script on Self-Hosted Runner
on: [push]
jobs:
  my-job:
    name: Run MATLAB Script
    runs-on: self-hosted
    steps:
      - name: Check out repository
        uses: actions/checkout@v2
      - name: Run script
        uses: matlab-actions/run-command@v0
        with:
          command: myscript
```

### Run MATLAB Commands on GitHub-Hosted Runner
Use the [Set Up MATLAB](https://github.com/matlab-actions/setup-matlab/) action when you want to run MATLAB code or Simulink models on a GitHub-hosted runner. The action installs your specified MATLAB release (R2020a or later) on a Linux virtual machine. If you do not specify a release, the action installs the latest release of MATLAB.

For example, install the latest release of MATLAB on a GitHub-hosted runner, and then use the **Run MATLAB Command** action to execute your MATLAB commands.

```yaml
name: Run MATLAB Commands on GitHub-Hosted Runner
on: [push]
jobs:
  my-job:
    name: Run MATLAB Commands
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v2
      - name: Install MATLAB
        uses: matlab-actions/setup-matlab@v0
      - name: Run commands
        uses: matlab-actions/run-command@v0
        with:
          command: results = runtests, assertSuccess(results);
```

## Run MATLAB Command
When you define your workflow in the `.github/workflows` directory of your repository, you can specify the **Run MATLAB Command** action as `matlab-actions/run-command@v0`. The action requires an input.

Input                     | Description    
------------------------- | --------------- 
`command`                 | (Required) Script, function, or statement to execute. If the value of `command` is the name of a MATLAB script or function, do not specify the file extension. If you specify more than one MATLAB command, use a comma or semicolon to separate the commands.<br/>**Example:** `myscript`<br/>**Example:** `results = runtests, assertSuccess(results);` 

MATLAB exits with exit code 0 if the specified script, function, or statement executes successfully without error. Otherwise, MATLAB terminates with a nonzero exit code, which causes the build to fail. You can use the [`assert`](https://www.mathworks.com/help/matlab/ref/assert.html) or [`error`](https://www.mathworks.com/help/matlab/ref/error.html) functions in the command to ensure that builds fail when necessary.

When you use this action, all of the required files must be on the MATLAB search path.

## Notes
By running the **Run MATLAB Command** action, you will be executing third-party code that is licensed under separate terms.

## See Also
- [Action for Running MATLAB Tests](https://github.com/matlab-actions/run-tests/)
- [Action for Installing MATLAB on GitHub-Hosted Runner](https://github.com/matlab-actions/setup-matlab/)
- [Continuous Integration with MATLAB and Simulink](https://www.mathworks.com/solutions/continuous-integration.html)

## Contact Us
If you have any questions or suggestions, please contact MathWorks&reg; at [continuous-integration@mathworks.com](mailto:continuous-integration@mathworks.com).
