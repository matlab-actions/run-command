# Action for Running MATLAB Commands

The [Run MATLAB Command](#run-matlab-command) action enables you to execute MATLAB&reg; scripts, functions, and statements on a self-hosted or GitHub&reg;-hosted runner. The action uses the topmost MATLAB version on the system path.

## Examples
Use the **Run MATLAB Command** action to run MATLAB scripts, functions, and statements. You can use this action to flexibly customize your test run or add a step in MATLAB to your workflow.

### Run MATLAB Script on Self-Hosted Runner
Use a [self-hosted runner](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners) to run the commands in a file named `myscript.m` in the root of your repository.

```yaml
name: Run MATLAB Script on Self-Hosted Runner
on: [push]
jobs:
  my-job:
    name: Run MATLAB Script
    runs-on: self-hosted
    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Run script
        uses: matlab-actions/run-command@v2
        with:
          command: myscript
```

### Run MATLAB Commands on GitHub-Hosted Runner
Before you run MATLAB code or Simulink models on a [GitHub-hosted runner](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/about-github-hosted-runners), first use the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action. The action sets up your specified MATLAB release (R2021a or later) on a Linux&reg;, Windows&reg;, or macOS&reg; runner. If you do not specify a release, the action sets up the latest release of MATLAB.

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
        uses: actions/checkout@v4
      - name: Set up MATLAB
        uses: matlab-actions/setup-matlab@v2
      - name: Run commands
        uses: matlab-actions/run-command@v2
        with:
          command: results = runtests, assertSuccess(results);
```

## Run MATLAB Command
When you define your workflow in the `.github/workflows` directory of your repository, specify the **Run MATLAB Command** action as `matlab-actions/run-command@v2`. The action requires an input and also accepts an optional input.

Input                     | Description
------------------------- | ---------------
`command`                 | <p>(Required) Script, function, or statement to execute. If the value of `command` is the name of a MATLAB script or function, do not specify the file extension. If you specify more than one script, function, or statement, use a comma or semicolon to separate them.<p/><p>MATLAB exits with exit code 0 if the specified script, function, or statement executes successfully without error. Otherwise, MATLAB terminates with a nonzero exit code, which causes the build to fail. To fail the build in certain conditions, use the [`assert`](https://www.mathworks.com/help/matlab/ref/assert.html) or [`error`](https://www.mathworks.com/help/matlab/ref/error.html) function.<p/><p>**Example:** `command: myscript`<br/>**Example:** `command: results = runtests, assertSuccess(results);`</p>
`startup-options`         | <p>(Optional) MATLAB startup options. If you specify more than one option, use a space to separate them. For more information about startup options, see [Commonly Used Startup Options](https://www.mathworks.com/help/matlab/matlab_env/commonly-used-startup-options.html).<p/><p>Using this input to specify the `-batch` or `-r` option is not supported.<p/><p>**Example:** `startup-options: -nojvm`<br/>**Example:** `startup-options: -nojvm -logfile output.log`</p>

When you use this action, all of the required files must be on the MATLAB search path. If your script or function is not in the root of your repository, you can use the [`addpath`](https://www.mathworks.com/help/matlab/ref/addpath.html), [`cd`](https://www.mathworks.com/help/matlab/ref/cd.html), or [`run`](https://www.mathworks.com/help/matlab/ref/run.html) function to put it on the path. For example, to run `myscript.m` in a folder named `myfolder` located in the root of the repository, you can specify `command` like this:

`command: addpath("myfolder"), myscript`

## Notes
* In MATLAB R2019a and later, the **Run MATLAB Command** action uses  the `-batch` option to start MATLAB noninteractively. Preferences do not persist across different MATLAB sessions launched with the `-batch` option. To run code that requires  the same preferences, use a single action.
* When you use the **Run MATLAB Command** action, you execute third-party code that is licensed under separate terms.

## See Also
- [Action for Running MATLAB Builds](https://github.com/matlab-actions/run-build/)
- [Action for Running MATLAB Tests](https://github.com/matlab-actions/run-tests/)
- [Action for Setting Up MATLAB](https://github.com/matlab-actions/setup-matlab/)
- [Continuous Integration with MATLAB and Simulink](https://www.mathworks.com/solutions/continuous-integration.html)

## Contact Us
If you have any questions or suggestions, please contact MathWorks&reg; at [continuous-integration@mathworks.com](mailto:continuous-integration@mathworks.com).
