param([string]$Msg = "Update web app")
$ErrorActionPreference = "Stop"
$dl = "$env:USERPROFILE\Downloads"
$f = Get-ChildItem $dl -Filter "*index*.html" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $f) { Write-Host "No index*.html found in Downloads" -ForegroundColor Red; exit 1 }
if ($f.Length -lt 100000) { Write-Host "Newest file is only $($f.Length) bytes, wrong file?" -ForegroundColor Red; exit 1 }
Write-Host "Using: $($f.Name)  ($([math]::Round($f.Length/1024)) KB, $($f.LastWriteTime))"
Copy-Item $f.FullName "$PSScriptRoot\app\index.html" -Force
Remove-Item $f.FullName
Remove-Item "$PSScriptRoot\app\app-index*.html" -ErrorAction SilentlyContinue
git add -A app
git commit -m $Msg
git push
Write-Host "Done. Wait about 1 minute, then open https://trackly.ivanexo.com/app/?v=$(Get-Random)" -ForegroundColor Green
