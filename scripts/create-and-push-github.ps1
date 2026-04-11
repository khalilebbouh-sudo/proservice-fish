<#
.SYNOPSIS
  Cree le depot GitHub (vide) s'il n'existe pas, configure origin, pousse la branche main.

.DESCRIPTION
  Requiert une variable d'environnement GITHUB_TOKEN (PAT) avec le droit "repo".
  Ne stocke pas le jeton dans la config Git : une URL temporaire est utilisee pour le push.

.EXAMPLE
  $env:GITHUB_TOKEN = 'ghp_xxxxxxxx'   # GitHub > Settings > Developer settings > PAT
  powershell -ExecutionPolicy Bypass -File .\scripts\create-and-push-github.ps1 -Owner "mon-compte" -RepoName "proservice-fish"
#>
param(
    [Parameter(Mandatory = $true, HelpMessage = "Votre nom d'utilisateur ou organisation GitHub")]
    [string] $Owner,

    [string] $RepoName = "proservice-fish",

    [switch] $PublicRepo
)

$ErrorActionPreference = "Stop"
if (-not $env:GITHUB_TOKEN -or $env:GITHUB_TOKEN.Length -lt 10) {
    Write-Error @"
Variable d'environnement GITHUB_TOKEN manquante ou trop courte.

1. GitHub > Settings > Developer settings > Personal access tokens > Generate (classic)
2. Cochez au minimum : repo
3. Dans ce terminal, avant de relancer le script :
   `$env:GITHUB_TOKEN = 'votre_jeton'
"@
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

$gitCandidates = @("git", "C:\Program Files\Git\bin\git.exe", "C:\Program Files (x86)\Git\bin\git.exe")
$git = $null
foreach ($c in $gitCandidates) {
    if ($c -eq "git") {
        $cmd = Get-Command git -ErrorAction SilentlyContinue
        if ($cmd) { $git = $cmd.Source; break }
    }
    elseif (Test-Path $c) { $git = $c; break }
}
if (-not $git) { Write-Error "Git introuvable. Installez Git for Windows." }

Write-Host "Depot local: $repoRoot"
Write-Host "GitHub:      $Owner/$RepoName"

$headers = @{
    Authorization        = "Bearer $($env:GITHUB_TOKEN)"
    Accept               = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

$bodyObj = @{
    name        = $RepoName
    private     = (-not $PublicRepo)
    description = "ProService Fish - catalogue + API"
    auto_init   = $false
}
$body = $bodyObj | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json; charset=utf-8" | Out-Null
    Write-Host "Depot cree sur GitHub."
}
catch {
    $code = $null
    if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
    if ($code -eq 422) {
        Write-Host "Depot deja existant (422), on continue vers le push."
    }
    else {
        Write-Error "Creation depot echouee : $($_.Exception.Message)"
    }
}

$cleanUrl = "https://github.com/$Owner/$RepoName.git"
$pushUrl = "https://x-access-token:$($env:GITHUB_TOKEN)@github.com/$Owner/$RepoName.git"

& $git remote get-url origin 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    & $git remote set-url origin $cleanUrl
}
else {
    & $git remote add origin $cleanUrl
}

Write-Host "Push branche main (authentification par jeton)..."
$env:GIT_TERMINAL_PROMPT = "0"
& $git push -u $pushUrl main

if ($LASTEXITCODE -ne 0) {
    Write-Error "git push a echoue. Verifiez le nom du depot, les droits du PAT, et que la branche locale s'appelle bien main."
}

Write-Host "OK. Remote origin = $cleanUrl (sans jeton dans l'URL)."
Write-Host "Ouvrez : https://github.com/$Owner/$RepoName"
