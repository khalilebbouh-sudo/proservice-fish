# Usage (depuis n'importe quel répertoire) :
#   powershell -ExecutionPolicy Bypass -File .\scripts\push-to-github.ps1 -RemoteUrl "https://github.com/VOTRE_USER/VOTRE_REPO.git"
# SSH :
#   .\scripts\push-to-github.ps1 -RemoteUrl "git@github.com:VOTRE_USER/VOTRE_REPO.git"

param(
    [Parameter(Mandatory = $true)]
    [string] $RemoteUrl
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

$gitCandidates = @(
    "git",
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe"
)
$git = $null
foreach ($c in $gitCandidates) {
    if ($c -eq "git") {
        $cmd = Get-Command git -ErrorAction SilentlyContinue
        if ($cmd) { $git = $cmd.Source; break }
    }
    elseif (Test-Path $c) { $git = $c; break }
}
if (-not $git) {
    Write-Error "Git introuvable. Installez Git for Windows ou ajoutez-le au PATH."
}

Write-Host "Depot: $repoRoot"
Write-Host "Git:   $git"

$hasOrigin = & $git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Mise a jour du remote origin -> $RemoteUrl"
    & $git remote set-url origin $RemoteUrl
}
else {
    Write-Host "Ajout du remote origin -> $RemoteUrl"
    & $git remote add origin $RemoteUrl
}

Write-Host "Push branche main..."
& $git push -u origin main
Write-Host "Termine."
