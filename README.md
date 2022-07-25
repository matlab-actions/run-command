# Action for Running MATLAB Commands

The [Run MATLAB Command](#run-matlab-command) action enables you to execute MATLAB&reg; scripts, functions, or statements on a [self-hosted](https://docs.github.com/en/free-pro-team@latest/actions/hosting-your-own-runners/about-self-hosted-runners) or [GitHub&reg;-hosted](https://docs.github.com/en/free-pro-team@latest/actions/reference/specifications-for-github-hosted-runners) runner:

- To use a self-hosted runner, you must set up a computer with MATLAB (R2013b or later) as your runner. The runner uses the topmost MATLAB version on the system path to execute your workflow.

- To use a GitHub-hosted runner, you must include the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action in your workflow to set up MATLAB on the runner. Currently, this action is available only for public projects. It does not set up transformation products, such as MATLAB Coder&trade; and MATLAB Compiler&trade;.

## Examples
Use the **Run MATLAB Command** action to run MATLAB scripts, functions, and statements. You can use this action to flexibly customize your test run or add a step in MATLAB to your workflow.

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
        uses: matlab-actions/run-command@v1
        with:
          command: myscript
```

### Run MATLAB Commands on GitHub-Hosted Runner
Before you run MATLAB code or Simulink models on a GitHub-hosted runner, first use the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action. The action sets up your specified MATLAB release (R2020a or later) on a Linux&reg; virtual machine. If you do not specify a release, the action sets up the latest release of MATLAB.

For example, set up the latest release of MATLAB on a GitHub-hosted runner, and then use the **Run MATLAB Command** action to execute your MATLAB commands.

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
      - name: Set up MATLAB
        uses: matlab-actions/setup-matlab@v1
      - name: Run commands
        uses: matlab-actions/run-command@v1
        with:
          command: results = runtests, assertSuccess(results);
```

## Run MATLAB Command
When you define your workflow in the `.github/workflows` directory of your repository, specify the **Run MATLAB Command** action as `matlab-actions/run-command@v1`. The action requires an input.

Input                     | Description
------------------------- | ---------------
`command`                 | (Required) Script, function, or statement to execute. If the value of `command` is the name of a MATLAB script or function, do not specify the file extension. If you specify more than one script, function, or statement, use a comma or semicolon to separate them.<br/>**Example:** `myscript`<br/>**Example:** `results = runtests, assertSuccess(results);`

MATLAB exits with exit code 0 if the specified script, function, or statement executes successfully without error. Otherwise, MATLAB terminates with a nonzero exit code, which causes the build to fail. To fail the build in certain conditions, use the [`assert`](https://www.mathworks.com/help/matlab/ref/assert.html) or [`error`](https://www.mathworks.com/help/matlab/ref/error.html) functions.

When you use this action, all of the required files must be on the MATLAB search path. If your script or function is not in the root of your repository, you can use the [`addpath`](https://www.mathworks.com/help/matlab/ref/addpath.html), [`cd`](https://www.mathworks.com/help/matlab/ref/cd.html), or [`run`](https://www.mathworks.com/help/matlab/ref/run.html) functions to put it on the path. For example, to run `myscript.m` in a folder `myfolder` located in the root of the repository, you can specify `command` like this:

`command: addpath('myfolder'), myscript`

## Notes
* In MATLAB R2019a and later, the **Run MATLAB Command** action uses  the `-batch` option to start MATLAB noninteractively. Preferences do not persist across different MATLAB sessions launched with the `-batch` option. To run code that requires  the same preferences, use a single action.
* When you use the **Run MATLAB Command** action, you execute third-party code that is licensed under separate terms.

## See Also
- [Action for Running MATLAB Tests](https://github.com/matlab-actions/run-tests/)
- [Action for Setting Up MATLAB on GitHub-Hosted Runner](https://github.com/matlab-actions/setup-matlab/)
- [Continuous Integration with MATLAB and Simulink](https://www.mathworks.com/solutions/continuous-integration.html)

## Contact Us
If you have any questions or suggestions, please contact MathWorks&reg; at [continuous-integration@mathworks.com](mailto:continuous-integration@mathworks.com).
