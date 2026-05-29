# Environment Variable Support

## Overview
Added support for environment variables in window title patterns using the `{env.VARNAME}` syntax.

## Implementation
Modified `WindowTitleService.getVariableValue()` to check for variables starting with `env.` prefix and resolve them from `process.env`.

## Usage Examples

### Basic Usage
```json
{
  "entitled.titlePattern": "{env.USER}@{env.HOSTNAME}"
}
```
Result: `crkrenn@rzhound210`

### Combined with Existing Variables
```json
{
  "entitled.titlePattern": "{env.USER}@{env.HOSTNAME} | {workspace} [{branch}]"
}
```
Result: `crkrenn@rzhound210 | my-project [feature/new-feature]`

### With Fallbacks
```json
{
  "entitled.titlePattern": "{env.USER || workspace} - {repo}"
}
```
Falls back to workspace name if USER environment variable is not set.

### Multiple Environment Variables
```json
{
  "entitled.titlePattern": "{timestamp} | {env.USER} | {workspace || repo}"
}
```
Result: `14:30 | crkrenn | my-project`

## Common Environment Variables
- `USER` - Current username
- `HOSTNAME` - System hostname
- `HOME` - User home directory
- `SHELL` - Default shell
- `PWD` - Present working directory
- `TERM` - Terminal type

## VS Code Built-in Variables
The extension also supports VS Code's built-in variables (note the `${}` syntax):

```json
{
  "entitled.titlePattern": "${remoteName} | {env.USER} | {workspace} [{branch}]"
}
```

**Available VS Code Variables:**
- `${remoteName}` - Remote name for SSH/WSL/Dev Containers (e.g., "ssh: myserver")
- `${dirty}` - Dirty indicator (shows dot when file modified)
- `${activeEditorShort}` - Short filename
- `${rootName}` - Workspace root name
- `${separator}` - Conditional separator
- `${appName}` - "Visual Studio Code"
- `${profileName}` - Profile name

**Example for Remote Development:**
```json
{
  "entitled.titlePattern": "${remoteName} | {env.USER}@{env.HOSTNAME} | {workspace} [{branch}]"
}
```
Result when SSH'd: `ssh: prod-server | john@prod-server | my-app [main]`

## Testing
Added 6 comprehensive tests covering:
- ✅ Basic environment variable resolution
- ✅ Non-existent variables (returns empty string)
- ✅ USER variable usage
- ✅ Environment variables in fallback chains
- ✅ Combining environment variables with other variables
- ✅ Environment variables with special characters

All 37 tests passing.

## Files Modified
1. `src/services/WindowTitleService.ts` - Core implementation
2. `README.md` - Documentation updates
3. `package.json` - Configuration description and version bump
4. `src/test/suite/windowTitleService.test.ts` - Test coverage
5. `CHANGELOG.md` - Feature documentation

## Advantages Over Specific Variables
Choosing broad environment variable support over specific `{user}` and `{host}` variables provides:

1. **Flexibility**: Access to any environment variable
2. **Future-proof**: No need to add new variables for other use cases
3. **Consistency**: Single pattern for all environment variables
4. **Minimal code**: One case handles infinite variables
5. **User empowerment**: Users can access variables specific to their environment
