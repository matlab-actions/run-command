# Run MATLAB® Command

This action executes a MATLAB script, function, or statement using the _first_
MATLAB version on the runner's system `PATH`.

MATLAB exits with exit code 0 if the specified script, function, or statement
executes successfully without error. Otherwise, MATLAB terminates with a nonzero
exit code, which causes the build to fail. You can use the
[`assert`](https://www.mathworks.com/help/matlab/ref/assert.html) or
[`error`](https://www.mathworks.com/help/matlab/ref/assert.html) functions in
the command to ensure that builds fail when necessary. When you use this task,
all of the required files must be on the MATLAB search path.

**Note**: By running the code in the submission, you will be executing third party
code that is licensed under separate terms.

## Usage

You can use this action `with`:
| Argument  | Description |
|-----------|-------------|
| `command` | (Required) Script, function, or statement to execute. <br/> If the value of `command` is the name of a MATLAB script or function, do not specify the file extension. If you specify more than one MATLAB command, use a comma or semicolon to separate the commands. <br/> **Example**: `myscript` <br/> **Example**: `results = runtests, assertSuccess(results);`

### Using a GitHub-hosted runner?
If you are using a GitHub-hosted runner, you can use the [Set up MATLAB action](https://github.com/mathworks/setup-matlab-action/) to install MATLAB on the runner.

## Example

```yaml
name: Sample workflow
on: [push]

jobs:
  my-job:
    name: Say hello from MATLAB
    runs-on: ubuntu-latest
    steps:
      # Set up MATLAB using this action first if running on a GitHub-hosted runner!
      - uses: mathworks/setup-matlab-action@v0
      
      - name: Run "disp('hello world')" directly using MATLAB
        uses: mathworks/run-matlab-command-action@v0
        with:
            command: disp('hello world')
```

## See also
- [Set up MATLAB action](https://github.com/mathworks/setup-matlab-action/)
- [Run MATLAB Tests](https://github.com/mathworks/run-matlab-tests-action/)
- [Continuous Integration - MATLAB & Simulink](https://www.mathworks.com/solutions/continuous-integration.html)

## Contact Us
If you have any questions or suggestions, please contact MathWorks® at continuous-integration@mathworks.com.
