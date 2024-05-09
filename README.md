# Action for Running MATLAB Commands

The [Run MATLAB Command](#run-matlab-command) action enables you to execute MATLAB&reg; scripts, functions, and statements on a [self-hosted](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners) or [GitHub&reg;-hosted](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/about-github-hosted-runners) runner:
- To use a self-hosted runner, you must set up a computer with MATLAB as your self-hosted runner and register the runner with GitHub Actions. The runner uses the topmost MATLAB release on the system path to execute your workflow.
- To use a GitHub-hosted runner, you must include the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action in your workflow to set up your preferred MATLAB release (R2021a or later) on the runner.

## Examples
Use the **Run MATLAB Command** action to run MATLAB scripts, functions, and statements. You can use this action to flexibly customize your test run or add a step in MATLAB to your workflow.

### Run MATLAB Script
On a self-hosted runner, run a script named `myscript.m` in the root of your repository.

```yaml
name: Run MATLAB Script
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

### Run MATLAB Statements
Using the latest release of MATLAB on a GitHub-hosted runner, run your MATLAB statements. To set up the latest release of MATLAB on the runner, specify the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action in your workflow. To run the statements, specify the **Run MATLAB Command** action.

```yaml
name: Run MATLAB Statements
on: [push]
jobs:
  my-job:
    name: Run MATLAB Statements
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Set up MATLAB
        uses: matlab-actions/setup-matlab@v2
      - name: Run statements
        uses: matlab-actions/run-command@v2
        with:
          command: results = runtests, assertSuccess(results);
```


### Use MATLAB Batch Licensing Token
On a GitHub-hosted runner, you need a [MATLAB batch licensing token](https://github.com/mathworks-ref-arch/matlab-dockerfile/blob/main/alternates/non-interactive/MATLAB-BATCH.md#matlab-batch-licensing-token) if your project is private or if your workflow includes transformation products, such as MATLAB Coder&trade; and MATLAB Compiler&trade;. Batch licensing tokens are strings that enable MATLAB to start in noninteractive environments. You can request a token by submitting the [MATLAB Batch Licensing Pilot](https://www.mathworks.com/support/batch-tokens.html) form. 

To use a MATLAB batch licensing token:

1. Set the token as a secret. For more information about secrets, see [Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).
2. Map the secret to an environment variable named `MLM_LICENSE_TOKEN` in your workflow. 

For example, use the latest release of MATLAB on a GitHub-hosted runner to run a script named `myscript.m` in your private project. To install the latest release of MATLAB on the runner, specify the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action in your workflow. To run the script, specify the **Run MATLAB Command** action. In this example, `MyToken` is the name of the secret that holds the batch licensing token.

```YAML
name: Use MATLAB Batch Licensing Token
on: [push]
env:
  MLM_LICENSE_TOKEN: ${{ secrets.MyToken }}
jobs:
  my-job:
    name: Run MATLAB Script in Private Project
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
      - uses: actions/checkout@v4
      - name: Set up MATLAB
      - uses: matlab-actions/setup-matlab@v2
      - name: Run script
      - uses: matlab-actions/run-command@v2
        with:
          command: myscript
```

## Run MATLAB Command
When you define your workflow in the `.github/workflows` directory of your repository, specify the **Run MATLAB Command** action as `matlab-actions/run-command@v2`. The action requires an input and also accepts an optional input.

Input                     | Description
------------------------- | ---------------
`command`                 | <p>(Required) Script, function, or statement to execute. If the value of `command` is the name of a MATLAB script or function, do not specify the file extension. If you specify more than one script, function, or statement, use a comma or semicolon to separate them.</p><p>MATLAB exits with exit code 0 if the specified script, function, or statement executes successfully without error. Otherwise, MATLAB terminates with a nonzero exit code, which causes the action to fail. To fail the action in certain conditions, use the [`assert`](https://www.mathworks.com/help/matlab/ref/assert.html) or [`error`](https://www.mathworks.com/help/matlab/ref/error.html) function.</p><p>**Example:** `command: myscript`<br/>**Example:** `command: results = runtests, assertSuccess(results);`</p>
`startup-options`         | <p>(Optional) MATLAB startup options, specified as a list of options separated by spaces. For more information about startup options, see [Commonly Used Startup Options](https://www.mathworks.com/help/matlab/matlab_env/commonly-used-startup-options.html).</p><p>Using this input to specify the `-batch` or `-r` option is not supported.</p><p>**Example:** `startup-options: -nojvm`<br/>**Example:** `startup-options: -nojvm -logfile output.log`</p>

When you use this action, all of the required files must be on the MATLAB search path. If your script or function is not in the root of your repository, you can use the [`addpath`](https://www.mathworks.com/help/matlab/ref/addpath.html), [`cd`](https://www.mathworks.com/help/matlab/ref/cd.html), or [`run`](https://www.mathworks.com/help/matlab/ref/run.html) function to put it on the path. For example, to run `myscript.m` in a folder named `myfolder` located in the root of the repository, you can specify `command` like this:

`command: addpath("myfolder"), myscript`

## Notes
* By default, when you use the **Run MATLAB Command** action, the root of your repository serves as the MATLAB startup folder. To run your MATLAB commands using a different folder, include the `-sd` startup option or the `cd` command in the action.
* In MATLAB R2019a and later, the **Run MATLAB Command** action uses  the `-batch` option to start MATLAB. Preferences do not persist across different MATLAB sessions launched with the `-batch` option. To run code that requires  the same preferences, use a single action.
* When you use the **Run MATLAB Command** action, you execute third-party code that is licensed under separate terms.

## See Also
- [Action for Running MATLAB Builds](https://github.com/matlab-actions/run-build/)
- [Action for Running MATLAB Tests](https://github.com/matlab-actions/run-tests/)
- [Action for Setting Up MATLAB](https://github.com/matlab-actions/setup-matlab/)
- [Continuous Integration with MATLAB and Simulink](https://www.mathworks.com/solutions/continuous-integration.html)

## Contact Us
If you have any questions or suggestions, contact MathWorks&reg; at [continuous-integration@mathworks.com](mailto:continuous-integration@mathworks.com).
