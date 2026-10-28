# PowerShell build script for MysteryUnlocked.exe
$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor DarkRed
Write-Host "   BUILDING STANDALONE EXECUTABLE: MysteryUnlocked.exe" -ForegroundColor Red
Write-Host "======================================================" -ForegroundColor DarkRed

$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (!(Test-Path $csc)) {
    Write-Error "Microsoft Visual C# compiler not found at $csc"
}

# Ensure app.ico exists
if (!(Test-Path "app.ico")) {
    Write-Host "app.ico not found, building without custom icon..." -ForegroundColor Yellow
    $iconArg = ""
} else {
    $iconArg = "/win32icon:app.ico"
}

$args = @(
    "/nologo",
    "/optimize+",
    "/target:exe",
    "/out:MysteryUnlocked.exe"
)

if ($iconArg -ne "") {
    $args += $iconArg
}

# Embed all necessary web assets
$assets = @(
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

foreach ($asset in $assets) {
    if (Test-Path $asset) {
        $resName = $asset.Replace('\', '/')
        $args += "/res:$asset,$resName"
    }
}

if (Test-Path "app.ico") {
    $args += "/res:app.ico,app.ico"
}

$args += "Launcher.cs"

& $csc $args

if ($LASTEXITCODE -eq 0 -and (Test-Path "MysteryUnlocked.exe")) {
    $size = (Get-Item "MysteryUnlocked.exe").Length
    Write-Host "[SUCCESS] Successfully built: MysteryUnlocked.exe ($($size) bytes)" -ForegroundColor Green
    Write-Host "You can share 'MysteryUnlocked.exe' with anyone - it runs standalone with zero dependencies!" -ForegroundColor Cyan
} else {
    Write-Error "Build failed!"
}
