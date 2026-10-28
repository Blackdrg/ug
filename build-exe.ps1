# PowerShell build script for MysteryUnlocked.exe
$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor DarkRed
Write-Host "   BUILDING STANDALONE EXECUTABLE: MysteryUnlocked.exe" -ForegroundColor Red
Write-Host "======================================================" -ForegroundColor DarkRed

$cscPath = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (!(Test-Path $cscPath)) {
    Write-Error "Microsoft Visual C# compiler not found at $cscPath"
}

# Check for application icon
$iconParameter = ""
if (Test-Path "app.ico") {
    $iconParameter = "/win32icon:app.ico"
} else {
    Write-Host "app.ico not found, building without custom icon..." -ForegroundColor Yellow
}

# Assemble compiler parameters
$compilerParameters = @(
    "/nologo",
    "/optimize+",
    "/target:exe",
    "/out:MysteryUnlocked.exe"
)

if ($iconParameter -ne "") {
    $compilerParameters += $iconParameter
}

# Embed all necessary web assets
$webAssets = @(
    "index.html",
    "css\style.css",
    "js\app.js",
    "js\data.js",
    "js\state.js",
    "js\exploration.js",
    "js\mystery-board.js",
    "js\evidence-dossier.js",
    "js\interrogation.js",
    "js\deduction.js",
    "js\archive.js",
    "js\audio.js"
)

foreach ($item in $webAssets) {
    if (Test-Path $item) {
        $resourceName = $item.Replace('\', '/')
        $compilerParameters += "/res:$item,$resourceName"
    }
}

if (Test-Path "app.ico") {
    $compilerParameters += "/res:app.ico,app.ico"
}

$compilerParameters += "Launcher.cs"

# Execute C# compiler
& $cscPath $compilerParameters

if ($LASTEXITCODE -eq 0 -and (Test-Path "MysteryUnlocked.exe")) {
    $fileSize = (Get-Item "MysteryUnlocked.exe").Length
    Write-Host "[SUCCESS] Successfully built: MysteryUnlocked.exe ($($fileSize) bytes)" -ForegroundColor Green
    Write-Host "You can share 'MysteryUnlocked.exe' with anyone - it runs standalone with zero dependencies!" -ForegroundColor Cyan
} else {
    Write-Error "Build failed!"
}
