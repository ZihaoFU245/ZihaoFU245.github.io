# Setup script for the portfolio website

Write-Host "Setting up Zihao Fu Portfolio Website..." -ForegroundColor Green

# Check if Node.js is installed
if (!(Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if Ruby is installed
if (!(Get-Command "ruby" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Ruby is not installed. Please install Ruby first." -ForegroundColor Red
    exit 1
}

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm install

# Install Ruby dependencies
Write-Host "Installing Ruby dependencies..." -ForegroundColor Yellow
if (Get-Command "bundle" -ErrorAction SilentlyContinue) {
    bundle install
} else {
    gem install bundler
    bundle install
}

# Build Tailwind CSS
Write-Host "Building Tailwind CSS..." -ForegroundColor Yellow
npm run build

Write-Host "Setup complete! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit _data/resume.yml with your information"
Write-Host "2. Edit _data/projects.yml with your projects"
Write-Host "3. Add your profile photo to assets/img/"
Write-Host "4. Run 'npm run dev' to start development server"
Write-Host ""
Write-Host "For more information, see README.md"
