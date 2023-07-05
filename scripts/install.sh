# Install all necessary dependencies for the project

# ASSUMES: choco is installed
# USAGE: `. install.ps1` from a PowerShell terminal

brew install nvm

pushd ..
nvm install
nvm use
popd
